import { db } from '../config/firebase.config';
import { User } from '../models/user.model';
import { logger } from '../utils/logger.util';

export class UserService {
  private usersCollection = db.collection('users');

  /**
   * Create a new user document in Firestore
   */
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const userDoc = {
        email: userData.email,
        displayName: userData.displayName || null,
        photoURL: userData.photoURL || null,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin,
      };

      // Use the Firebase Auth UID as the document ID
      await this.usersCollection.doc(userData.uid).set(userDoc);

      logger.info(`User document created: ${userData.uid}`);

      return {
        uid: userData.uid,
        email: userDoc.email,
        displayName: userDoc.displayName || undefined,
        photoURL: userDoc.photoURL || undefined,
        createdAt: userDoc.createdAt,
        lastLogin: userDoc.lastLogin,
      };
    } catch (error) {
      logger.error('Error creating user document:', error);
      throw new Error('Error al crear documento de usuario');
    }
  }

  /**
   * Get user by UID
   */
  async getUserByUid(uid: string): Promise<User | null> {
    try {
      const userDoc = await this.usersCollection.doc(uid).get();

      if (!userDoc.exists) {
        return null;
      }

      const data = userDoc.data()!;
      
      return {
        uid: userDoc.id,
        email: data.email,
        displayName: data.displayName || undefined,
        photoURL: data.photoURL || undefined,
        createdAt: data.createdAt.toDate(),
        lastLogin: data.lastLogin.toDate(),
      };
    } catch (error) {
      logger.error('Error getting user by UID:', error);
      throw new Error('Error al obtener usuario');
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const querySnapshot = await this.usersCollection
        .where('email', '==', email)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();

      return {
        uid: userDoc.id,
        email: data.email,
        displayName: data.displayName || undefined,
        photoURL: data.photoURL || undefined,
        createdAt: data.createdAt.toDate(),
        lastLogin: data.lastLogin.toDate(),
      };
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw new Error('Error al obtener usuario por email');
    }
  }

  /**
   * Update user profile
   */
  async updateUser(
    uid: string,
    updates: Partial<Pick<User, 'displayName' | 'photoURL'>>
  ): Promise<User> {
    try {
      const updateData: any = {};

      if (updates.displayName !== undefined) {
        updateData.displayName = updates.displayName;
      }
      if (updates.photoURL !== undefined) {
        updateData.photoURL = updates.photoURL;
      }

      await this.usersCollection.doc(uid).update(updateData);

      logger.info(`User updated: ${uid}`);

      const updatedUser = await this.getUserByUid(uid);
      
      if (!updatedUser) {
        throw new Error('Usuario no encontrado después de actualizar');
      }

      return updatedUser;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new Error('Error al actualizar usuario');
    }
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(uid: string): Promise<void> {
    try {
      await this.usersCollection.doc(uid).update({
        lastLogin: new Date(),
      });

      logger.info(`Last login updated for user: ${uid}`);
    } catch (error) {
      logger.error('Error updating last login:', error);
      // Don't throw error for last login update failure
      // This is not critical for the login flow
    }
  }

  /**
   * Delete user document
   */
  async deleteUser(uid: string): Promise<void> {
    try {
      await this.usersCollection.doc(uid).delete();

      logger.info(`User document deleted: ${uid}`);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw new Error('Error al eliminar usuario');
    }
  }

  /**
   * Check if user exists
   */
  async userExists(uid: string): Promise<boolean> {
    try {
      const userDoc = await this.usersCollection.doc(uid).get();
      return userDoc.exists;
    } catch (error) {
      logger.error('Error checking if user exists:', error);
      return false;
    }
  }
}
