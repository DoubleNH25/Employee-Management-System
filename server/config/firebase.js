import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

if (!serviceAccount.project_id) {
  throw new Error('FIREBASE_PROJECT_ID is required but not found in environment variables');
}
if (!serviceAccount.client_email) {
  throw new Error('FIREBASE_CLIENT_EMAIL is required but not found in environment variables');
}
if (!serviceAccount.private_key) {
  throw new Error('FIREBASE_PRIVATE_KEY is required but not found in environment variables');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

export const initializeFirebase = async () => {
  try {
    await db.collection('_health').doc('test').set({
      timestamp: new Date(),
      status: 'connected'
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export default admin;