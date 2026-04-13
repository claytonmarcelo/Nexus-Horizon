import admin from 'firebase-admin'
import path from 'path'
import fs from 'fs'

let serviceAccount: any

const secretPath = '/etc/secrets/firebase-credentials.json'

if (fs.existsSync(secretPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(secretPath, 'utf8'))
} else {
  serviceAccount = require(path.resolve('firebase-credentials.json'))
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const db = admin.firestore()