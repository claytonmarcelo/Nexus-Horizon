import admin from 'firebase-admin'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const credentialsPath = path.resolve(__dirname, '../../firebase-credentials.json')
const credentials = fs.existsSync(credentialsPath)
  ? JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
  : undefined

const firebaseConfig =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }
    : credentials

if (!firebaseConfig) {
  throw new Error('Firebase configuration not found. Set environment variables or add firebase-credentials.json.')
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
  })
}

export const db = admin.firestore()
