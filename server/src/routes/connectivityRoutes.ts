import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middlewares/authMiddleware'
import {
  SatelliteProvider,
  CellularProvider,
  LiFiProvider,
  DirectToCellProvider,
} from '../core/ConnectivityProvider'

export async function connectivityRoutes(server: FastifyInstance): Promise<void> {
  server.get(
    '/connectivity/:type',
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const { type } = request.params as { type: string }

      const providers: Record<string, any> = {
        satellite: new SatelliteProvider('SAT-BR-001'),
        cellular: new CellularProvider('TOWER-SP-042'),
        lifi: new LiFiProvider('LIFI-LAB-001'),
        directcell: new DirectToCellProvider('DTC-BR-001'),
      }

      const provider = providers[type]

      if (!provider) {
        return reply.status(400).send({ error: 'Provedor inválido.' })
      }

      return {
        type,
        status: await provider.getStatus(),
        latency: provider.getLatency(),
        signal: provider.getSignalStrength(),
        technology: provider.getTechnology(),
      }
    }
  )
}