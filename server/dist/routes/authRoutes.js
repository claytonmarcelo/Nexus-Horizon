"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const authController_1 = require("../controllers/authController");
async function authRoutes(server) {
    server.post('/auth/register', authController_1.register);
    server.post('/auth/login', authController_1.login);
    server.get('/auth/profile', {
        preHandler: [async (req, reply) => {
                try {
                    await req.jwtVerify();
                }
                catch {
                    reply.status(401).send({ error: 'Token inválido.' });
                }
            }]
    }, authController_1.getProfile);
    server.post('/auth/logout', async (request, reply) => {
        return reply.send({ message: 'Logout realizado com sucesso.' });
    });
}
//# sourceMappingURL=authRoutes.js.map