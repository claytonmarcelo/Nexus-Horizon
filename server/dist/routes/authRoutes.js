"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
async function authRoutes(server) {
    server.post('/auth/register', authController_1.register);
    server.post('/auth/login', authController_1.login);
    server.post('/auth/forgot-password', authController_1.forgotPassword);
    server.post('/auth/reset-password', authController_1.resetPassword);
    server.get('/auth/profile', { preHandler: [authMiddleware_1.authMiddleware] }, authController_1.getProfile);
    server.post('/auth/logout', async (request, reply) => {
        return reply.send({ message: 'Logout realizado com sucesso.' });
    });
}
//# sourceMappingURL=authRoutes.js.map