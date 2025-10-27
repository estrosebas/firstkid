import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.util';

// Cargar variables de entorno
dotenv.config();

// Validar variables de entorno requeridas
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  const errorMsg = `Faltan las siguientes variables de entorno requeridas: ${missingVars.join(', ')}`;
  logger.error(errorMsg);
  throw new Error(errorMsg);
}

// Inicializar Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
  
  logger.info('Firebase Admin SDK inicializado correctamente');
} catch (error) {
  logger.error('Error al inicializar Firebase Admin SDK:', error);
  throw error;
}

// Exportar servicios de Firebase
export const auth = admin.auth();
export const db = admin.firestore();

export default admin;
