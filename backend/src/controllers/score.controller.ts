import { Response, NextFunction } from 'express';
import { ScoreService } from '../services/score.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';
import { logger } from '../utils/logger.util';
import { validationResult } from 'express-validator';
import { isValidModule } from '../models/usage.model';
import { isValidScore } from '../models/score.model';

export class ScoreController {
  private scoreService: ScoreService;

  constructor() {
    this.scoreService = new ScoreService();
  }

  /**
   * Save a new score record
   * POST /api/score
   */
  saveScore = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          errors.array()[0].msg,
          400
        );
      }

      // Get user ID from authenticated request
      const userId = req.user?.uid;
      if (!userId) {
        return sendError(
          res,
          'AUTHENTICATION_ERROR',
          'Usuario no autenticado',
          401
        );
      }

      const { module, score } = req.body;

      // Validate module
      if (!isValidModule(module)) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          'El módulo debe ser uno de: rcp, nose, burn-skins',
          400
        );
      }

      // Validate score range
      if (!isValidScore(score)) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          'El score debe ser un número entre 0 y 100',
          400
        );
      }

      // Save score
      const savedScore = await this.scoreService.saveScore(userId, module, score);

      logger.info(`Score saved successfully: ${savedScore.id}`);

      return sendSuccess(res, savedScore, 201);
    } catch (error: any) {
      logger.error('Error in saveScore controller:', error);
      return sendError(
        res,
        'SCORE_SAVE_ERROR',
        error.message || 'Error al guardar score',
        400
      );
    }
  };

  /**
   * Get score records for authenticated user
   * GET /api/score
   */
  getUserScores = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.uid;
      if (!userId) {
        return sendError(
          res,
          'AUTHENTICATION_ERROR',
          'Usuario no autenticado',
          401
        );
      }

      const scores = await this.scoreService.getUserScores(userId);

      logger.info(`Retrieved score records for user: ${userId}`);

      return sendSuccess(res, scores, 200);
    } catch (error: any) {
      logger.error('Error in getUserScores controller:', error);
      return sendError(
        res,
        'SCORE_RETRIEVAL_ERROR',
        error.message || 'Error al obtener scores',
        400
      );
    }
  };
}
