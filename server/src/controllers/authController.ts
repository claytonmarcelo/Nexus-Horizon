import { randomUUID } from 'crypto'
import { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { db } from '../config/firebase'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function createMailTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

function validateEmail(email: string): string | null {
  if (!email || typeof email !== 'string') return 'Email é obrigatório.'
  const normalized = email.trim().toLowerCase()
  if (!EMAIL_REGEX.test(normalized)) return 'Email inválido.'
  return null
}

function validatePassword(password: string): string | null {
  if (!password || typeof password !== 'string') return 'Senha é obrigatória.'
  if (password.length < MIN_PASSWORD_LENGTH) return `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
  return null
}

function validateName(name: string): string | null {
  if (!name || typeof name !== 'string') return 'Nome é obrigatório.'
  if (name.trim().length < 2) return 'Nome deve ter no mínimo 2 caracteres.'
  return null
}

function sanitizeUser(doc: FirebaseFirestore.DocumentData) {
  const { password, resetToken, resetTokenExpiresAt, ...safe } = doc
  return safe
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body as { name: string; email: string; password: string }

  const nameError = validateName(name)
  if (nameError) return reply.status(400).send({ error: nameError })

  const emailError = validateEmail(email)
  if (emailError) return reply.status(400).send({ error: emailError })

  const trimmedPassword = typeof password === 'string' ? password.trim() : password
  const passwordError = validatePassword(trimmedPassword)
  if (passwordError) return reply.status(400).send({ error: passwordError })

  const normalizedEmail = email.trim().toLowerCase()

  const usersRef = db.collection('users')
  const existing = await usersRef.where('email', '==', normalizedEmail).get()

  if (!existing.empty) {
    return reply.status(409).send({ error: 'Este email já está cadastrado.' })
  }

  const hashedPassword = await bcrypt.hash(trimmedPassword, 10)
  const newUser = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
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
    user: { id: newUser.id, name: newUser.name, email: newUser.email, plan: 'Nexus Pro', totalConnections: 0, createdAt: newUser.createdAt },
  })
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string }

  if (!email || !password) {
    return reply.status(400).send({ error: 'Email e senha são obrigatórios.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const trimmedPassword = typeof password === 'string' ? password.trim() : password
  const usersRef = db.collection('users')
  const snapshot = await usersRef.where('email', '==', normalizedEmail).get()

  if (snapshot.empty) {
    return reply.status(401).send({ error: 'Email ou senha incorretos.' })
  }

  const userDoc = snapshot.docs[0]
  const user = userDoc.data()

  const validPassword = await bcrypt.compare(trimmedPassword, user.password)
  if (!validPassword) {
    return reply.status(401).send({ error: 'Email ou senha incorretos.' })
  }

  const totalConnections = (user.totalConnections || 0) + 1
  await usersRef.doc(user.id).update({
    totalConnections,
    lastLogin: new Date().toISOString(),
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
      totalConnections,
      createdAt: user.createdAt,
    },
  })
}

export async function forgotPassword(request: FastifyRequest, reply: FastifyReply) {
  const { email } = request.body as { email: string }

  if (!email) {
    return reply.status(400).send({ error: 'Informe o email para recuperação.' })
  }

  const usersRef = db.collection('users')
  const snapshot = await usersRef.where('email', '==', email.trim().toLowerCase()).get()

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0]
    const user = userDoc.data()
    const resetToken = randomUUID()
    const resetTokenExpiresAt = Date.now() + 1000 * 60 * 60

    await usersRef.doc(user.id).update({ resetToken, resetTokenExpiresAt })

    const frontendUrl = process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:19006'
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`
    const transporter = createMailTransporter()

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email.trim().toLowerCase(),
        subject: 'Nexus Horizon - Recuperação de senha',
        text: `Você solicitou a recuperação de senha. Abra este link para redefinir: ${resetLink}`,
        html: `<p>Você solicitou a recuperação de senha.</p><p>Clique no link abaixo para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`,
      })
    }
  }

  return reply.send({
    message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
  })
}

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const { token, password } = request.body as { token: string; password: string }

  if (!token) return reply.status(400).send({ error: 'Token é obrigatório.' })

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
