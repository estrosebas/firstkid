import { Router } from 'express';
import { body } from 'express-validator';
import { UsageController } from '../controllers/usage.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
const usageController = new UsageController();

/**
 * POST /api/usage
 * Create a new usage record for a module
 * Protected route - requires authentication
 */
router.post(
  '/',
  verifyToken,
  [
    body('module')
      .notEmpty()
      .withMessage('El módulo es requerido')
      .isString()
      .withMessage('El módulo debe ser una cadena de texto')
      .isIn(['rcp', 'nose', 'burn-skins'])
      .withMessage('El módulo debe ser uno de: rcp, nose, burn-skins')
  ],
  usageController.createUsage
);

/**
 * GET /api/usage
 * Get usage records for authenticated user
 * Protected route - requires authentication
 */
router.get(
  '/',
  verifyToken,
  usageController.getUserUsage
);

export default router;
