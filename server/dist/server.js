"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const static_1 = __importDefault(require("@fastify/static"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const connectivityRoutes_1 = require("./routes/connectivityRoutes");
const authRoutes_1 = require("./routes/authRoutes");
dotenv_1.default.config();
const server = (0, fastify_1.default)({ logger: false });
server.register(jwt_1.default, {
    secret: process.env.JWT_SECRET,
});
server.register(cors_1.default, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});
server.register(static_1.default, {
    root: path_1.default.join(__dirname, '../src/config/web'),
    prefix: '/',
});
server.register(authRoutes_1.authRoutes, { prefix: '/api' });
server.register(connectivityRoutes_1.connectivityRoutes, { prefix: '/api' });
server.get('/health', async () => ({
    status: 'Nexus Horizon online',
    timestamp: new Date().toISOString(),
}));
const start = async () => {
    try {
        await server.listen({
            port: Number(process.env.PORT) || 3333,
            host: '0.0.0.0',
        });
        console.log('Nexus Horizon server running on port 3333');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map