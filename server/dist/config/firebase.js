"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let serviceAccount;
const secretPath = '/etc/secrets/firebase-credentials.json';
if (fs_1.default.existsSync(secretPath)) {
    serviceAccount = JSON.parse(fs_1.default.readFileSync(secretPath, 'utf8'));
}
else {
    serviceAccount = require(path_1.default.resolve('firebase-credentials.json'));
}
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
exports.db = firebase_admin_1.default.firestore();
//# sourceMappingURL=firebase.js.map