import { db } from '../config/firebase.config';
import { Usage, createUsage, validateUsage } from '../models/usage.model';
import { ModuleType } from '../types';
import { logger } from '../utils/logger.util';

export class UsageService {
  private usagesCollection = db.collection('usages');

  /**
   * Create a new usage record in Firestore
   * @param userId - User ID from authenticated request
   * @param module - Module name (rcp, nose, burn-skins)
   * @returns Created usage record
   */
  async createUsageRecord(userId: string, module: ModuleType): Promise<Usage> {
    try {
      // Create usage object
      const usage = createUsage(userId, module);

      // Validate usage data
      validateUsage(usage);

      // Save to Firestore
      const docRef = await this.usagesCollection.add({
        userId: usage.userId,
        module: usage.module,
        timestamp: usage.timestamp,
      });

      logger.info(`Usage record created: ${docRef.id} for user ${userId}, module ${module}`);

      // Return usage with generated ID
      return {
        id: docRef.id,
        ...usage,
      };
    } catch (error: any) {
      logger.error('Error creating usage record:', error);
      throw new Error(error.message || 'Error al crear registro de uso');
    }
  }

  /**
   * Get usage records for a specific user
   * @param userId - User ID
   * @returns Array of usage records
   */
  async getUserUsageRecords(userId: string): Promise<Usage[]> {
    try {
      const snapshot = await this.usagesCollection
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .get();

      const usages: Usage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usages.push({
          id: doc.id,
          userId: data.userId,
          module: data.module as ModuleType,
          timestamp: data.timestamp.toDate(),
        });
      });

      logger.info(`Retrieved ${usages.length} usage records for user ${userId}`);

      return usages;
    } catch (error: any) {
      logger.error('Error getting user usage records:', error);
      throw new Error('Error al obtener registros de uso');
    }
  }

  /**
   * Get usage records for a specific user and module
   * @param userId - User ID
   * @param module - Module name
   * @returns Array of usage records
   */
  async getUserModuleUsageRecords(userId: string, module: ModuleType): Promise<Usage[]> {
    try {
      const snapshot = await this.usagesCollection
        .where('userId', '==', userId)
        .where('module', '==', module)
        .orderBy('timestamp', 'desc')
        .get();

      const usages: Usage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usages.push({
          id: doc.id,
          userId: data.userId,
          module: data.module as ModuleType,
          timestamp: data.timestamp.toDate(),
        });
      });

      logger.info(`Retrieved ${usages.length} usage records for user ${userId}, module ${module}`);

      return usages;
    } catch (error: any) {
      logger.error('Error getting user module usage records:', error);
      throw new Error('Error al obtener registros de uso del módulo');
    }
  }
}
