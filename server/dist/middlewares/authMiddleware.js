"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
async function authMiddleware(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Token inválido ou expirado.',
        });
    }
}
//# sourceMappingURL=authMiddleware.js.map