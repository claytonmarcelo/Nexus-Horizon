import { FastifyInstance } from 'fastify'
import { register, login, forgotPassword, resetPassword, getProfile, deleteAccount } from '../controllers/authController'
import { authMiddleware } from '../middlewares/authMiddleware'

export async function authRoutes(server: FastifyInstance): Promise<void> {
  server.post('/auth/register', register)
  server.post('/auth/login', login)
  server.post('/auth/forgot-password', forgotPassword)
  server.post('/auth/reset-password', resetPassword)

  server.get('/auth/profile', { preHandler: [authMiddleware] }, getProfile)
  server.delete('/auth/account', { preHandler: [authMiddleware] }, deleteAccount)

  server.post('/auth/logout', async (request, reply) => {
    return reply.send({ message: 'Logout realizado com sucesso.' })
  })
}
