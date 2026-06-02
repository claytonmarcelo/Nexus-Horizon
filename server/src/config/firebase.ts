import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env

const missingVars: string[] = []
if (!FIREBASE_PROJECT_ID) missingVars.push('FIREBASE_PROJECT_ID')
if (!FIREBASE_CLIENT_EMAIL) missingVars.push('FIREBASE_CLIENT_EMAIL')
if (!FIREBASE_PRIVATE_KEY) missingVars.push('FIREBASE_PRIVATE_KEY')

if (missingVars.length > 0) {
  throw new Error(
    `Firebase configuracao incompleta. Variaveis ausentes: ${missingVars.join(', ')}. ` +
    'Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY no .env'
  )
}

const privateKey = FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  })
}

export const db = admin.firestore()
