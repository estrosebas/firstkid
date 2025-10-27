import { db } from '../config/firebase.config';
import { logger } from '../utils/logger.util';

export class StatsService {
  /**
   * Get total users count
   */
  async getTotalUsers(): Promise<number> {
    try {
      const snapshot = await db.collection('users').get();
      return snapshot.size;
    } catch (error) {
      logger.error('Error getting total users:', error);
      throw new Error('Error al obtener total de usuarios');
    }
  }

  /**
   * Get total usage records
   */
  async getTotalUsage(): Promise<number> {
    try {
      const snapshot = await db.collection('usage').get();
      return snapshot.size;
    } catch (error) {
      logger.error('Error getting total usage:', error);
      throw new Error('Error al obtener total de usos');
    }
  }

  /**
   * Get usage by module
   */
  async getUsageByModule(): Promise<{ module: string; count: number }[]> {
    try {
      const snapshot = await db.collection('usage').get();
      const usageMap: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const module = data.module;
        usageMap[module] = (usageMap[module] || 0) + 1;
      });

      return Object.entries(usageMap).map(([module, count]) => ({
        module,
        count,
      }));
    } catch (error) {
      logger.error('Error getting usage by module:', error);
      throw new Error('Error al obtener uso por módulo');
    }
  }

  /**
   * Get average scores by module
   */
  async getAverageScoresByModule(): Promise<{ module: string; average: number; count: number }[]> {
    try {
      const snapshot = await db.collection('scores').get();
      const scoreMap: Record<string, { total: number; count: number }> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const module = data.module;
        const score = data.score;

        if (!scoreMap[module]) {
          scoreMap[module] = { total: 0, count: 0 };
        }

        scoreMap[module].total += score;
        scoreMap[module].count += 1;
      });

      return Object.entries(scoreMap).map(([module, data]) => ({
        module,
        average: Math.round(data.total / data.count),
        count: data.count,
      }));
    } catch (error) {
      logger.error('Error getting average scores:', error);
      throw new Error('Error al obtener promedios de scores');
    }
  }

  /**
   * Get recent activity (last 10 usage records)
   */
  async getRecentActivity(): Promise<any[]> {
    try {
      const snapshot = await db
        .collection('usage')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

      const activities: any[] = [];
      snapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return activities;
    } catch (error) {
      logger.error('Error getting recent activity:', error);
      throw new Error('Error al obtener actividad reciente');
    }
  }

  /**
   * Get all stats
   */
  async getAllStats() {
    try {
      const [totalUsers, totalUsage, usageByModule, averageScores, recentActivity] =
        await Promise.all([
          this.getTotalUsers(),
          this.getTotalUsage(),
          this.getUsageByModule(),
          this.getAverageScoresByModule(),
          this.getRecentActivity(),
        ]);

      return {
        totalUsers,
        totalUsage,
        usageByModule,
        averageScores,
        recentActivity,
      };
    } catch (error) {
      logger.error('Error getting all stats:', error);
      throw new Error('Error al obtener estadísticas');
    }
  }
}
