import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
const statsController = new StatsController();

/**
 * GET /api/stats
 * Get all statistics (protected route)
 */
router.get('/', verifyToken, statsController.getAllStats);

export default router;
