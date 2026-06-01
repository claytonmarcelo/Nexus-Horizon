import { FastifyInstance } from 'fastify'
import { register, login, getProfile } from '../controllers/authController'
import { authMiddleware } from '../middlewares/authMiddleware'

export async function authRoutes(server: FastifyInstance): Promise<void> {
  server.post('/auth/register', register)
  server.post('/auth/login', login)

  server.get('/auth/profile', { preHandler: [authMiddleware] }, getProfile)

  server.post('/auth/logout', async (request, reply) => {
    return reply.send({ message: 'Logout realizado com sucesso.' })
  })
}