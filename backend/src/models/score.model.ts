/**
 * Score Model
 * Defines the Score interface and validation functions
 */

import { ModuleType } from '../types';
import { isValidModule } from './usage.model';

export interface Score {
  id?: string;
  userId: string;
  module: ModuleType;
  score: number;
  timestamp: Date;
}

/**
 * Validates if a score is within the allowed range (0-100)
 * @param score - Score value to validate
 * @returns true if valid, false otherwise
 */
export function isValidScore(score: number): boolean {
  return typeof score === 'number' && score >= 0 && score <= 100 && !isNaN(score);
}

/**
 * Validates score data
 * @param score - Score object to validate
 * @returns true if valid, throws error otherwise
 */
export function validateScore(score: Partial<Score>): boolean {
  if (!score.userId || typeof score.userId !== 'string' || score.userId.trim() === '') {
    throw new Error('User ID is required and must be a non-empty string');
  }

  if (!score.module || typeof score.module !== 'string') {
    throw new Error('Module is required and must be a string');
  }

  if (!isValidModule(score.module)) {
    throw new Error('Module must be one of: rcp, nose, burn-skins');
  }

  if (score.score === undefined || score.score === null) {
    throw new Error('Score is required');
  }

  if (!isValidScore(score.score)) {
    throw new Error('Score must be a number between 0 and 100');
  }

  if (!score.timestamp || !(score.timestamp instanceof Date)) {
    throw new Error('Timestamp must be a valid Date');
  }

  return true;
}

/**
 * Creates a new Score object
 * @param userId - User ID
 * @param module - Module name
 * @param score - Score value (0-100)
 * @returns Score object
 */
export function createScore(userId: string, module: ModuleType, score: number): Score {
  if (!isValidScore(score)) {
    throw new Error('Score must be a number between 0 and 100');
  }

  return {
    userId,
    module,
    score,
    timestamp: new Date(),
  };
}
