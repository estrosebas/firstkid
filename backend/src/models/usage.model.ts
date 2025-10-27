/**
 * Usage Model
 * Defines the Usage interface and validation functions
 */

import { ModuleType } from '../types';

export interface Usage {
  id?: string;
  userId: string;
  module: ModuleType;
  timestamp: Date;
}

/**
 * Validates if a module name is allowed
 * @param module - Module name to validate
 * @returns true if valid, false otherwise
 */
export function isValidModule(module: string): module is ModuleType {
  const allowedModules: ModuleType[] = ['rcp', 'nose', 'burn-skins'];
  return allowedModules.includes(module as ModuleType);
}

/**
 * Validates usage data
 * @param usage - Usage object to validate
 * @returns true if valid, throws error otherwise
 */
export function validateUsage(usage: Partial<Usage>): boolean {
  if (!usage.userId || typeof usage.userId !== 'string' || usage.userId.trim() === '') {
    throw new Error('User ID is required and must be a non-empty string');
  }

  if (!usage.module || typeof usage.module !== 'string') {
    throw new Error('Module is required and must be a string');
  }

  if (!isValidModule(usage.module)) {
    throw new Error('Module must be one of: rcp, nose, burn-skins');
  }

  if (!usage.timestamp || !(usage.timestamp instanceof Date)) {
    throw new Error('Timestamp must be a valid Date');
  }

  return true;
}

/**
 * Creates a new Usage object
 * @param userId - User ID
 * @param module - Module name
 * @returns Usage object
 */
export function createUsage(userId: string, module: ModuleType): Usage {
  return {
    userId,
    module,
    timestamp: new Date(),
  };
}
