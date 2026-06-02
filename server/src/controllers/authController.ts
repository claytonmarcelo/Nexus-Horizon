import { randomUUID } from 'crypto'
import { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { db } from '../config/firebase'

function createMailTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body as {
    name: string
    email: string
    password: string
  }

  const usersRef = db.collection('users')
  const existing = await usersRef.where('email', '==', email).get()

  if (!existing.empty) {
    return reply.status(400).send({ error: 'Email já cadastrado.' })
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
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  })
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as {
    email: string
    password: string
  }

  const usersRef = db.collection('users')
  const snapshot = await usersRef.where('email', '==', email).get()

  if (snapshot.empty) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' })
  }

  const userDoc = snapshot.docs[0]
  const user = userDoc.data()

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' })
  }

  await usersRef.doc(user.id).update({
    totalConnections: (user.totalConnections || 0) + 1,
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
      totalConnections: (user.totalConnections || 0) + 1,
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
  const snapshot = await usersRef.where('email', '==', email).get()

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0]
    const user = userDoc.data() as any
    const resetToken = randomUUID()
    const resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString()

    await usersRef.doc(user.id).update({
      resetToken,
      resetTokenExpiresAt,
    })

    const frontendUrl = process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:19006'
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`
    const transporter = createMailTransporter()

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Nexus Horizon - Recuperação de senha',
        text: `Você solicitou a recuperação de senha. Abra este link para redefinir: ${resetLink}`,
        html: `<p>Você solicitou a recuperação de senha.</p><p>Clique no link abaixo para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`,
      })
    } else {
      console.warn('SMTP não configurado. Defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS para enviar o email.')
    }
  }

  return reply.send({
    message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
  })
}

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const { token, password } = request.body as { token: string; password: string }

  if (!token || !password) {
    return reply.status(400).send({ error: 'Token e nova senha são obrigatórios.' })
  }

  const usersRef = db.collection('users')
  const snapshot = await usersRef.where('resetToken', '==', token).get()

  if (snapshot.empty) {
    return reply.status(400).send({ error: 'Token inválido ou expirado.' })
  }

  const userDoc = snapshot.docs[0]
  const user = userDoc.data() as any

  if (!user.resetTokenExpiresAt || new Date(user.resetTokenExpiresAt) < new Date()) {
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

  return reply.send({
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan || 'Nexus Pro',
    totalConnections: user.totalConnections || 0,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  })
}