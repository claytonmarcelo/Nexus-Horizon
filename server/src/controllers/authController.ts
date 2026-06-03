import { randomUUID } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { db } from '../config/firebase'
import { FieldValue } from 'firebase-admin/firestore'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const DEFAULT_PRODUCTION_FRONTEND_URL = 'https://claytonmarcelo.github.io/Nexus-Horizon'
const DEFAULT_DEVELOPMENT_FRONTEND_URL = 'http://localhost:3333'
const isProduction = process.env.NODE_ENV === 'production'

type AuthBody = Record<string, unknown>
type ClientContext = {
  deviceType: string
  deviceLabel: string
  systemName: string
  systemVersion: string
  runtime: string
  recordedAt?: string
}

function createMailTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

function getBody(request: FastifyRequest): AuthBody {
  if (typeof request.body === 'object' && request.body !== null) {
    return request.body as AuthBody
  }

  return {}
}

function getTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function validateEmail(email: string): string | null {
  if (!email) return 'Email é obrigatório.'
  if (!EMAIL_REGEX.test(email)) return 'Email inválido.'
  return null
}

function validatePassword(password: string): string | null {
  if (!password) return 'Senha é obrigatória.'
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
  }
  if (!/[A-Z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra maiúscula.'
  }
  if (!/[a-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra minúscula.'
  }
  if (!/[0-9]/.test(password)) {
    return 'A senha deve conter pelo menos um número.'
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'A senha deve conter pelo menos um caractere especial.'
  }

  return null
}

function validateName(name: string): string | null {
  if (!name) return 'Nome é obrigatório.'
  if (name.length < 2) return 'Nome deve ter no mínimo 2 caracteres.'
  return null
}

function sanitizeUser(doc: FirebaseFirestore.DocumentData) {
  const { password, resetToken, resetTokenExpiresAt, ...safe } = doc
  return safe
}

function sanitizeContextValue(value: unknown, fallback = '--') {
  if (typeof value !== 'string') {
    return fallback
  }

  const normalized = value.trim()
  return normalized ? normalized.slice(0, 80) : fallback
}

function getClientContext(body: AuthBody): ClientContext | null {
  if (typeof body.clientContext !== 'object' || body.clientContext === null) {
    return null
  }

  const rawContext = body.clientContext as Record<string, unknown>

  return {
    deviceType: sanitizeContextValue(rawContext.deviceType, 'unknown'),
    deviceLabel: sanitizeContextValue(rawContext.deviceLabel, 'Dispositivo nao identificado'),
    systemName: sanitizeContextValue(rawContext.systemName, 'Sistema nao identificado'),
    systemVersion: sanitizeContextValue(rawContext.systemVersion),
    runtime: sanitizeContextValue(rawContext.runtime, 'Ambiente nao identificado'),
  }
}

function getResetPasswordBaseUrl() {
  const configuredBaseUrl =
    process.env.RESET_PASSWORD_URL ||
    process.env.FRONTEND_URL ||
    process.env.APP_URL ||
    process.env.PUBLIC_APP_URL

  if (configuredBaseUrl) {
    return configuredBaseUrl.trim()
  }

  return isProduction
    ? DEFAULT_PRODUCTION_FRONTEND_URL
    : DEFAULT_DEVELOPMENT_FRONTEND_URL
}

function buildResetPasswordLink(token: string) {
  const baseUrl = getResetPasswordBaseUrl().replace(/\/+$/, '')
  const resetUrl = baseUrl.includes('reset-password')
    ? new URL(baseUrl)
    : new URL(`${baseUrl}/reset-password.html`)

  resetUrl.searchParams.set('token', token)
  return resetUrl.toString()
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = getBody(request)
  const name = getTrimmedString(body.name)
  const email = getTrimmedString(body.email).toLowerCase()
  const password = getTrimmedString(body.password)

  const nameError = validateName(name)
  if (nameError) return reply.status(400).send({ error: nameError })

  const emailError = validateEmail(email)
  if (emailError) return reply.status(400).send({ error: emailError })

  const passwordError = validatePassword(password)
  if (passwordError) return reply.status(400).send({ error: passwordError })

  const usersRef = db.collection('users')
  const existing = await usersRef.where('email', '==', email).get()

  if (!existing.empty) {
    return reply.status(409).send({ error: 'Email já cadastrado.' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = {
    id: randomUUID(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    plan: 'Nexus Pro',
    totalConnections: 0,
  }

  await usersRef.doc(newUser.id).set(newUser)

  const token = await reply.jwtSign(
    { id: newUser.id, email: newUser.email, name: newUser.name },
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  return reply.status(201).send({
    message: 'Usuário criado com sucesso.',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      plan: newUser.plan,
      totalConnections: newUser.totalConnections,
      createdAt: newUser.createdAt,
    },
  })
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const body = getBody(request)
  const email = getTrimmedString(body.email).toLowerCase()
  const password = getTrimmedString(body.password)
  const clientContext = getClientContext(body)

  if (!email || !password) {
    return reply.status(400).send({ error: 'Email e senha são obrigatórios.' })
  }

  const usersRef = db.collection('users')
  const snapshot = await usersRef.where('email', '==', email).get()

  if (snapshot.empty) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' })
  }

  const userDoc = snapshot.docs[0]
  const user = userDoc.data()

  if (!user.password || typeof user.password !== 'string') {
    return reply.status(401).send({ error: 'Credenciais inválidas.' })
  }

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' })
  }

  const lastLogin = new Date().toISOString()
  const newTotalConnections = (user.totalConnections || 0) + 1
  const lastLoginContext = clientContext
    ? {
        ...clientContext,
        recordedAt: lastLogin,
      }
    : user.lastLoginContext || null

  await usersRef.doc(user.id).update({
    totalConnections: FieldValue.increment(1),
    lastLogin,
    ...(lastLoginContext ? { lastLoginContext } : {}),
  })

  const token = await reply.jwtSign(
    { id: user.id, email: user.email, name: user.name },
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  return reply.send({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan || 'Nexus Pro',
      totalConnections: newTotalConnections,
      createdAt: user.createdAt,
      lastLogin,
      lastLoginContext,
    },
  })
}

export async function forgotPassword(request: FastifyRequest, reply: FastifyReply) {
  const body = getBody(request)
  const email = getTrimmedString(body.email).toLowerCase()

  if (!email) {
    return reply.status(400).send({ error: 'Informe o email para recuperação.' })
  }

  const transporter = createMailTransporter()
  if (!transporter && isProduction) {
    return reply.status(503).send({
      error: 'Recuperação de senha indisponível no momento.',
    })
  }

  const usersRef = db.collection('users')
  const snapshot = await usersRef.where('email', '==', email).get()

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0]
    const user = userDoc.data()
    const resetToken = randomUUID()
    const resetTokenExpiresAt = Date.now() + 1000 * 60 * 60
    const resetLink = buildResetPasswordLink(resetToken)

    await usersRef.doc(user.id).update({ resetToken, resetTokenExpiresAt })

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Nexus Horizon - Recuperação de senha',
        text: `Você solicitou a recuperação de senha. Abra este link para redefinir: ${resetLink}`,
        html: `<p>Você solicitou a recuperação de senha.</p><p>Clique no link abaixo para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`,
      })
    } else {
      return reply.send({
        message: 'Link de redefinição gerado para desenvolvimento.',
        resetLink,
      })
    }
  }

  return reply.send({
    message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
  })
}

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const body = getBody(request)
  const token = getTrimmedString(body.token)
  const password = getTrimmedString(body.password)

  if (!token) {
    return reply.status(400).send({ error: 'Token é obrigatório.' })
  }

  const passwordError = validatePassword(password)
  if (passwordError) return reply.status(400).send({ error: passwordError })

  const usersRef = db.collection('users')
  const snapshot = await usersRef.where('resetToken', '==', token).get()

  if (snapshot.empty) {
    return reply.status(400).send({ error: 'Token inválido ou expirado.' })
  }

  const userDoc = snapshot.docs[0]
  const user = userDoc.data()

  if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < Date.now()) {
    return reply.status(400).send({ error: 'Token inválido ou expirado.' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await usersRef.doc(user.id).update({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpiresAt: null,
  })

  return reply.send({ message: 'Senha redefinida com sucesso.' })
}

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.user as { id: string }
  const usersRef = db.collection('users')
  const userDoc = await usersRef.doc(id).get()

  if (!userDoc.exists) {
    return reply.status(404).send({ error: 'Usuário não encontrado.' })
  }

  const user = userDoc.data()!
  return reply.send(sanitizeUser(user))
}
