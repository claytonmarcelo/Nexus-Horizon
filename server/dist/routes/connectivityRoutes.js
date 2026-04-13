"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectivityRoutes = connectivityRoutes;
const authMiddleware_1 = require("../middlewares/authMiddleware");
const ConnectivityProvider_1 = require("../core/ConnectivityProvider");
async function connectivityRoutes(server) {
    server.get('/connectivity/:type', { preHandler: [authMiddleware_1.authMiddleware] }, async (request, reply) => {
        const { type } = request.params;
        const providers = {
            satellite: new ConnectivityProvider_1.SatelliteProvider('SAT-BR-001'),
            cellular: new ConnectivityProvider_1.CellularProvider('TOWER-SP-042'),
            lifi: new ConnectivityProvider_1.LiFiProvider('LIFI-LAB-001'),
            directcell: new ConnectivityProvider_1.DirectToCellProvider('DTC-BR-001'),
        };
        const provider = providers[type];
        if (!provider) {
            return reply.status(400).send({ error: 'Provedor inválido.' });
        }
        return {
            type,
            status: await provider.getStatus(),
            latency: provider.getLatency(),
            signal: provider.getSignalStrength(),
            technology: provider.getTechnology(),
        };
    });
}
//# sourceMappingURL=connectivityRoutes.js.map