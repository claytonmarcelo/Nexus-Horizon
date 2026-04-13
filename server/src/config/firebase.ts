import admin from 'firebase-admin'
import path from 'path'

let serviceAccount: any

if (process.env.FIREBASE_CREDENTIALS) {
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS)
} else {
  serviceAccount = require(path.resolve('firebase-credentials.json'))
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const db = admin.firestore()