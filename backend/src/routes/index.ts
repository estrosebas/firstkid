import { Router } from 'express';
import authRoutes from './auth.routes';
import usageRoutes from './usage.routes';
import scoreRoutes from './score.routes';

const router = Router();

/**
 * Agregador de rutas principal
 * Todas las rutas se montan bajo el prefijo /api
 */

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de registro de uso de módulos
router.use('/usage', usageRoutes);

// Rutas de scores
router.use('/score', scoreRoutes);

export default router;
