import { Router } from 'express';
import authRoutes from './auth.routes';
import usageRoutes from './usage.routes';
import scoreRoutes from './score.routes';
import statsRoutes from './stats.routes';

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

// Rutas de estadísticas
router.use('/stats', statsRoutes);

export default router;
