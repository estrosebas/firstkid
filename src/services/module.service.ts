/**
 * Module Service
 * Handles module usage tracking and score management
 */

import { apiService } from './api.service';

export type ModuleType = 'rcp' | 'nose' | 'burn-skins';

export interface UsageRecord {
  id: string;
  userId: string;
  module: ModuleType;
  timestamp: string;
}

export interface ScoreRecord {
  id: string;
  userId: string;
  module: ModuleType;
  score: number;
  timestamp: string;
}

class ModuleService {
  /**
   * Register module usage
   */
  async registerUsage(module: ModuleType): Promise<{ success: boolean; data?: UsageRecord; error?: string }> {
    const response = await apiService.post<UsageRecord>('/api/usage', { module });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error?.message || 'Failed to register usage',
    };
  }

  /**
   * Save module score
   */
  async saveScore(
    module: ModuleType,
    score: number
  ): Promise<{ success: boolean; data?: ScoreRecord; error?: string }> {
    const response = await apiService.post<ScoreRecord>('/api/score', { module, score });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error?.message || 'Failed to save score',
    };
  }
}

// Export singleton instance
export const moduleService = new ModuleService();
