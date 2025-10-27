import { Router } from 'express';
import { body } from 'express-validator';
import { ScoreController } from '../controllers/score.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
const scoreController = new ScoreController();

/**
 * POST /api/score
 * Save a new score for a module
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
      .withMessage('El módulo debe ser uno de: rcp, nose, burn-skins'),
    body('score')
      .notEmpty()
      .withMessage('El score es requerido')
      .isNumeric()
      .withMessage('El score debe ser un número')
      .custom((value) => {
        const numValue = Number(value);
        if (numValue < 0 || numValue > 100) {
          throw new Error('El score debe estar entre 0 y 100');
        }
        return true;
      })
  ],
  scoreController.saveScore
);

/**
 * GET /api/score
 * Get score records for authenticated user
 * Protected route - requires authentication
 */
router.get(
  '/',
  verifyToken,
  scoreController.getUserScores
);

export default router;
