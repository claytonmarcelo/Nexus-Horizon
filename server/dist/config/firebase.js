"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const credentialsPath = path_1.default.resolve(__dirname, '../../firebase-credentials.json');
const credentials = fs_1.default.existsSync(credentialsPath)
    ? JSON.parse(fs_1.default.readFileSync(credentialsPath, 'utf8'))
    : undefined;
const firebaseConfig = process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }
    : credentials;
if (!firebaseConfig) {
    throw new Error('Firebase configuration not found. Set environment variables or add firebase-credentials.json.');
}
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(firebaseConfig),
    });
}
exports.db = firebase_admin_1.default.firestore();
//# sourceMappingURL=firebase.js.map