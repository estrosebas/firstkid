import { db } from '../config/firebase.config';
import { Score, createScore, validateScore } from '../models/score.model';
import { ModuleType } from '../types';
import { logger } from '../utils/logger.util';

export class ScoreService {
  private scoresCollection = db.collection('scores');

  /**
   * Save a new score record in Firestore
   * @param userId - User ID from authenticated request
   * @param module - Module name (rcp, nose, burn-skins)
   * @param score - Score value (0-100)
   * @returns Created score record
   */
  async saveScore(userId: string, module: ModuleType, score: number): Promise<Score> {
    try {
      // Create score object
      const scoreData = createScore(userId, module, score);

      // Validate score data
      validateScore(scoreData);

      // Save to Firestore
      const docRef = await this.scoresCollection.add({
        userId: scoreData.userId,
        module: scoreData.module,
        score: scoreData.score,
        timestamp: scoreData.timestamp,
      });

      logger.info(`Score saved: ${docRef.id} for user ${userId}, module ${module}, score ${score}`);

      // Return score with generated ID
      return {
        id: docRef.id,
        ...scoreData,
      };
    } catch (error: any) {
      logger.error('Error saving score:', error);
      throw new Error(error.message || 'Error al guardar score');
    }
  }

  /**
   * Get score records for a specific user
   * @param userId - User ID
   * @returns Array of score records
   */
  async getUserScores(userId: string): Promise<Score[]> {
    try {
      const snapshot = await this.scoresCollection
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .get();

      const scores: Score[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        scores.push({
          id: doc.id,
          userId: data.userId,
          module: data.module as ModuleType,
          score: data.score,
          timestamp: data.timestamp.toDate(),
        });
      });

      logger.info(`Retrieved ${scores.length} score records for user ${userId}`);

      return scores;
    } catch (error: any) {
      logger.error('Error getting user scores:', error);
      throw new Error('Error al obtener scores del usuario');
    }
  }

  /**
   * Get score records for a specific user and module
   * @param userId - User ID
   * @param module - Module name
   * @returns Array of score records
   */
  async getUserModuleScores(userId: string, module: ModuleType): Promise<Score[]> {
    try {
      const snapshot = await this.scoresCollection
        .where('userId', '==', userId)
        .where('module', '==', module)
        .orderBy('timestamp', 'desc')
        .get();

      const scores: Score[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        scores.push({
          id: doc.id,
          userId: data.userId,
          module: data.module as ModuleType,
          score: data.score,
          timestamp: data.timestamp.toDate(),
        });
      });

      logger.info(`Retrieved ${scores.length} score records for user ${userId}, module ${module}`);

      return scores;
    } catch (error: any) {
      logger.error('Error getting user module scores:', error);
      throw new Error('Error al obtener scores del módulo');
    }
  }
}
