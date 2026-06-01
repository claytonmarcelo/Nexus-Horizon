import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import dotenv from 'dotenv'
import path from 'path'
import { connectivityRoutes } from './routes/connectivityRoutes'
import { authRoutes } from './routes/authRoutes'

dotenv.config()

const server = Fastify({ logger: true })
const jwtSecret = process.env.JWT_SECRET || 'nexus-horizon-secret-key'

if (!process.env.JWT_SECRET) {
  server.log.warn('JWT_SECRET não definido. Usando chave padrão para desenvolvimento.')
}

server.register(fastifyJwt, {
  secret: jwtSecret,
})

server.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

server.register(fastifyStatic, {
  root: path.join(__dirname, '../src/config/web'),
  prefix: '/',
})

server.register(authRoutes, { prefix: '/api' })
server.register(connectivityRoutes, { prefix: '/api' })

server.get('/health', async () => ({
  status: 'Nexus Horizon online',
  timestamp: new Date().toISOString(),
}))

const start = async () => {
  try {
    await server.listen({
      port: Number(process.env.PORT) || 3333,
      host: '0.0.0.0',
    })
    console.log('Nexus Horizon server running on port 3333')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
