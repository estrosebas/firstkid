/**
 * Stats Service
 * Handles statistics and analytics data
 */

import { apiService } from './api.service';

export interface StatsData {
  totalUsers: number;
  totalUsage: number;
  usageByModule: { module: string; count: number }[];
  averageScores: { module: string; average: number; count: number }[];
  recentActivity: any[];
}

class StatsService {
  /**
   * Get all statistics
   */
  async getAllStats(): Promise<{ success: boolean; data?: StatsData; error?: string }> {
    const response = await apiService.get<StatsData>('/api/stats');

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error?.message || 'Failed to fetch statistics',
    };
  }
}

// Export singleton instance
export const statsService = new StatsService();
