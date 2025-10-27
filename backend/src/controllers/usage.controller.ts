import { Response, NextFunction } from 'express';
import { UsageService } from '../services/usage.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';
import { logger } from '../utils/logger.util';
import { validationResult } from 'express-validator';
import { isValidModule } from '../models/usage.model';

export class UsageController {
  private usageService: UsageService;

  constructor() {
    this.usageService = new UsageService();
  }

  /**
   * Create a new usage record
   * POST /api/usage
   */
  createUsage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

      const { module } = req.body;

      // Validate module
      if (!isValidModule(module)) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          'El módulo debe ser uno de: rcp, nose, burn-skins',
          400
        );
      }

      // Create usage record
      const usage = await this.usageService.createUsageRecord(userId, module);

      logger.info(`Usage record created successfully: ${usage.id}`);

      return sendSuccess(res, usage, 201);
    } catch (error: any) {
      logger.error('Error in createUsage controller:', error);
      return sendError(
        res,
        'USAGE_CREATION_ERROR',
        error.message || 'Error al crear registro de uso',
        400
      );
    }
  };

  /**
   * Get usage records for authenticated user
   * GET /api/usage
   */
  getUserUsage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

      const usages = await this.usageService.getUserUsageRecords(userId);

      logger.info(`Retrieved usage records for user: ${userId}`);

      return sendSuccess(res, usages, 200);
    } catch (error: any) {
      logger.error('Error in getUserUsage controller:', error);
      return sendError(
        res,
        'USAGE_RETRIEVAL_ERROR',
        error.message || 'Error al obtener registros de uso',
        400
      );
    }
  };
}
