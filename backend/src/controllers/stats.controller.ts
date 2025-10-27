import { Request, Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { logger } from '../utils/logger.util';

export class StatsController {
  private statsService: StatsService;

  constructor() {
    this.statsService = new StatsService();
  }

  /**
   * Get all statistics
   * GET /api/stats
   */
  getAllStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.statsService.getAllStats();

      logger.info('Stats retrieved successfully');

      return sendSuccess(res, stats, 200);
    } catch (error: any) {
      logger.error('Error in getAllStats controller:', error);
      return sendError(
        res,
        'STATS_ERROR',
        error.message || 'Error al obtener estadísticas',
        500
      );
    }
  };
}
