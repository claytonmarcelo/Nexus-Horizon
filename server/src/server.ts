import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import dotenv from 'dotenv'
import path from 'path'
import { connectivityRoutes } from './routes/connectivityRoutes'
import { authRoutes } from './routes/authRoutes'

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

const server = Fastify({ logger: true })

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  if (isProduction) {
    console.error('FATAL: JWT_SECRET é obrigatório em produção.')
    process.exit(1)
  }
  console.warn('WARN: JWT_SECRET não definido. Usando chave padrão apenas para desenvolvimento.')
}

server.register(fastifyJwt, {
  secret: jwtSecret || 'nexus-horizon-dev-secret',
})

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [process.env.FRONTEND_URL || 'http://localhost:19006', 'http://localhost:3333', 'http://localhost:3000']

server.register(fastifyCors, {
  origin: isProduction ? allowedOrigins : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

server.register(fastifyStatic, {
  root: path.join(__dirname, '../src/config/web'),
  prefix: '/',
})

server.register(fastifyStatic, {
  root: path.join(__dirname, '../src/config/web/admin/crm/pages'),
  prefix: '/admin/crm/pages/',
  decorateReply: false,
})

server.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  const statusCode = error.statusCode || 500
  const message = statusCode === 500 && isProduction
    ? 'Erro interno do servidor'
    : error.message

  if (statusCode === 500) {
    console.error(error)
  }

  reply.status(statusCode).send({
    error: message,
    statusCode,
  })
})

server.register(authRoutes, { prefix: '/api' })
server.register(connectivityRoutes, { prefix: '/api' })

server.get('/health', async () => ({
  status: 'Nexus Horizon online',
  timestamp: new Date().toISOString(),
}))

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`Nexus Horizon server running on port ${port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
