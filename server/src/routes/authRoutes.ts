import { FastifyInstance } from 'fastify'
import { register, login, forgotPassword, resetPassword, getProfile, deleteAccount } from '../controllers/authController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { byIp, byIpAndEmail, createRateLimiter } from '../middlewares/rateLimit'

const registerLimiter = createRateLimiter({
  id: 'register',
  windowMs: 1000 * 60 * 30,
  maxAttempts: 8,
  message: 'Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.',
  getKey: byIp,
})

const loginLimiter = createRateLimiter({
  id: 'login',
  windowMs: 1000 * 60 * 10,
  maxAttempts: 5,
  message: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.',
  getKey: byIpAndEmail,
})

const forgotPasswordLimiter = createRateLimiter({
  id: 'forgot-password',
  windowMs: 1000 * 60 * 15,
  maxAttempts: 3,
  message: 'Muitas solicitacoes de recuperacao. Aguarde um pouco antes de tentar de novo.',
  getKey: byIpAndEmail,
})

const resetPasswordLimiter = createRateLimiter({
  id: 'reset-password',
  windowMs: 1000 * 60 * 15,
  maxAttempts: 5,
  message: 'Muitas tentativas de redefinicao. Aguarde alguns minutos e tente novamente.',
  getKey: byIp,
})

export async function authRoutes(server: FastifyInstance): Promise<void> {
  server.post('/auth/register', { preHandler: [registerLimiter] }, register)
  server.post('/auth/login', { preHandler: [loginLimiter] }, login)
  server.post('/auth/forgot-password', { preHandler: [forgotPasswordLimiter] }, forgotPassword)
  server.post('/auth/reset-password', { preHandler: [resetPasswordLimiter] }, resetPassword)

  server.get('/auth/profile', { preHandler: [authMiddleware] }, getProfile)
  server.delete('/auth/account', { preHandler: [authMiddleware] }, deleteAccount)

  server.post('/auth/logout', async (request, reply) => {
    return reply.send({ message: 'Logout realizado com sucesso.' })
  })
}
