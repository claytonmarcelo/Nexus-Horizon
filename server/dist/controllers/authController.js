"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getProfile = getProfile;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const firebase_1 = require("../config/firebase");
async function register(request, reply) {
    const { name, email, password } = request.body;
    const usersRef = firebase_1.db.collection('users');
    const existing = await usersRef.where('email', '==', email).get();
    if (!existing.empty) {
        return reply.status(400).send({ error: 'Email já cadastrado.' });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        plan: 'Nexus Pro',
        totalConnections: 0,
    };
    await usersRef.doc(newUser.id).set(newUser);
    return reply.status(201).send({
        message: 'Usuário criado com sucesso.',
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
}
async function login(request, reply) {
    const { email, password } = request.body;
    const usersRef = firebase_1.db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) {
        return reply.status(401).send({ error: 'Credenciais inválidas.' });
    }
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    const validPassword = await bcryptjs_1.default.compare(password, user.password);
    if (!validPassword) {
        return reply.status(401).send({ error: 'Credenciais inválidas.' });
    }
    await usersRef.doc(user.id).update({
        totalConnections: (user.totalConnections || 0) + 1,
        lastLogin: new Date().toISOString(),
    });
    const token = await reply.jwtSign({ id: user.id, email: user.email, name: user.name }, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return reply.send({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            plan: user.plan || 'Nexus Pro',
            totalConnections: (user.totalConnections || 0) + 1,
            createdAt: user.createdAt,
        },
    });
}
async function getProfile(request, reply) {
    const { id } = request.user;
    const usersRef = firebase_1.db.collection('users');
    const userDoc = await usersRef.doc(id).get();
    if (!userDoc.exists) {
        return reply.status(404).send({ error: 'Usuário não encontrado.' });
    }
    const user = userDoc.data();
    return reply.send({
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan || 'Nexus Pro',
        totalConnections: user.totalConnections || 0,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
    });
}
//# sourceMappingURL=authController.js.map