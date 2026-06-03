import { FastifyReply, FastifyRequest } from 'fastify'

type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitOptions = {
  id: string
  windowMs: number
  maxAttempts: number
  message: string
  getKey?: (request: FastifyRequest) => string
}

const rateLimitStore = new Map<string, RateLimitEntry>()

function normalizeValue(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function getRequestBody(request: FastifyRequest): Record<string, unknown> {
  return typeof request.body === 'object' && request.body !== null
    ? request.body as Record<string, unknown>
    : {}
}

function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key)
    }
  }
}

export function byIp(request: FastifyRequest): string {
  return request.ip || 'unknown-ip'
}

export function byIpAndEmail(request: FastifyRequest): string {
  const body = getRequestBody(request)
  const email = normalizeValue(body.email)
  return `${byIp(request)}:${email || 'unknown-email'}`
}

export function createRateLimiter(options: RateLimitOptions) {
  return async function rateLimit(request: FastifyRequest, reply: FastifyReply) {
    const now = Date.now()
    cleanupExpiredEntries(now)

    const identifier = options.getKey ? options.getKey(request) : byIp(request)
    const key = `${options.id}:${identifier}`
    const currentEntry = rateLimitStore.get(key)

    const entry = currentEntry && currentEntry.resetAt > now
      ? currentEntry
      : { count: 0, resetAt: now + options.windowMs }

    entry.count += 1
    rateLimitStore.set(key, entry)

    if (entry.count > options.maxAttempts) {
      reply.header('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)))

      return reply.status(429).send({
        error: options.message,
      })
    }
  }
}
