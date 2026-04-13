import { FastifyInstance } from 'fastify'
import { register, login, getProfile } from '../controllers/authController'

export async function authRoutes(server: FastifyInstance): Promise<void> {
  server.post('/auth/register', register)
  server.post('/auth/login', login)

  server.get('/auth/profile', {
    preHandler: [async (req, reply) => {
      try {
        await req.jwtVerify()
      } catch {
        reply.status(401).send({ error: 'Token inválido.' })
      }
    }]
  }, getProfile)

  server.post('/auth/logout', async (request, reply) => {
    return reply.send({ message: 'Logout realizado com sucesso.' })
  })
}