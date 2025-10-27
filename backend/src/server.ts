import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger.util';

// Cargar variables de entorno
dotenv.config();

/**
 * Validar variables de entorno requeridas
 */
const validateEnvVariables = (): void => {
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'PORT',
    'FRONTEND_URL',
    'JWT_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    logger.error('Faltan las siguientes variables de entorno requeridas:');
    missingVars.forEach(varName => logger.error(`  - ${varName}`));
    logger.error('\nPor favor, configura estas variables en el archivo .env');
    logger.error('Puedes usar .env.example como referencia');
    process.exit(1);
  }

  logger.info('Variables de entorno validadas correctamente');
};

/**
 * Configurar CORS
 */
const configureCors = () => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
  ];

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  return cors(corsOptions);
};

/**
 * Crear y configurar la aplicación Express
 */
const createApp = (): Application => {
  const app = express();

  // Middleware de parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configurar CORS
  app.use(configureCors());

  // Ruta de health check
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Backend API está funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  });

  // Montar todas las rutas bajo /api
  app.use('/api', routes);

  // Middleware para rutas no encontradas
  app.use(notFoundHandler);

  // Middleware de manejo global de errores (debe ser el último)
  app.use(errorHandler);

  return app;
};

/**
 * Iniciar el servidor
 */
const startServer = (): void => {
  // Validar variables de entorno antes de iniciar
  validateEnvVariables();

  const app = createApp();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info('='.repeat(50));
    logger.info(`🚀 Servidor Express iniciado exitosamente`);
    logger.info(`📡 Puerto: ${PORT}`);
    logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 URL: http://localhost:${PORT}`);
    logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
    logger.info(`🔥 Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`);
    logger.info('='.repeat(50));
  });
};

// Iniciar el servidor si este archivo se ejecuta directamente
if (require.main === module) {
  startServer();
}

export { createApp, startServer };
