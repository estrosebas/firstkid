import { auth } from '../config/firebase.config';
import { UserService } from './user.service';
import { logger } from '../utils/logger.util';
import jwt from 'jsonwebtoken';

class AuthServiceClass {
  private userService: UserService;
  private jwtSecret: string;

  constructor() {
    this.userService = new UserService();
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    
    if (!process.env.JWT_SECRET) {
      logger.warn('JWT_SECRET not set in environment variables. Using default key (NOT SECURE)');
    }
  }

  /**
   * Generate a JWT token for the user
   */
  private generateToken(uid: string, email: string): string {
    const payload = {
      uid,
      email,
      iat: Math.floor(Date.now() / 1000),
    };
    
    // Generate JWT with 1 hour expiration
    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: '1h',
    });
    
    return token;
  }

  /**
   * Verify a JWT token
   */
  private verifyJwtToken(token: string): { uid: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        uid: string;
        email: string;
        iat: number;
        exp: number;
      };
      
      return {
        uid: decoded.uid,
        email: decoded.email,
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        logger.error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        logger.error('Invalid token');
      } else {
        logger.error('Error verifying token:', error);
      }
      return null;
    }
  }

  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, displayName?: string) {
    try {
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });

      logger.info(`User created in Firebase Auth: ${userRecord.uid}`);

      // Create user document in Firestore
      const userData = {
        uid: userRecord.uid,
        email: userRecord.email!,
        displayName: displayName || undefined,
        photoURL: undefined,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      await this.userService.createUser(userData);

      logger.info(`User document created in Firestore: ${userRecord.uid}`);

      // Generate token for the user
      const token = this.generateToken(userRecord.uid, userRecord.email!);

      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        token: token,
      };
    } catch (error: any) {
      logger.error('Error in register service:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/email-already-exists') {
        throw new Error('El correo electrónico ya está registrado');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('El correo electrónico no es válido');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      throw new Error('Error al registrar usuario');
    }
  }

  /**
   * Login user with email and password
   * Note: Firebase Admin SDK doesn't have a direct login method
   * This method verifies the user exists and generates a custom token
   */
  async login(email: string, password: string) {
    try {
      // Get user by email to verify it exists
      const userRecord = await auth.getUserByEmail(email);

      // Note: Firebase Admin SDK cannot verify passwords
      // In a real app, you would use Firebase Client SDK for authentication
      // For now, we just verify the user exists and generate a token

      // Update last login in Firestore
      await this.userService.updateLastLogin(userRecord.uid);

      // Generate token for the user
      const token = this.generateToken(userRecord.uid, userRecord.email!);

      logger.info(`User logged in: ${userRecord.uid}`);

      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        token: token,
      };
    } catch (error: any) {
      logger.error('Error in login service:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuario no encontrado');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('El correo electrónico no es válido');
      }
      
      throw new Error('Error al iniciar sesión');
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string) {
    try {
      const tokenData = this.verifyJwtToken(token);
      
      if (!tokenData) {
        throw new Error('Token inválido o expirado');
      }
      
      logger.info(`Token verified for user: ${tokenData.uid}`);
      
      return {
        uid: tokenData.uid,
        email: tokenData.email,
      };
    } catch (error: any) {
      logger.error('Error verifying token:', error);
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Get user by UID
   */
  async getUserById(uid: string) {
    try {
      const userRecord = await auth.getUser(uid);
      
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
      };
    } catch (error: any) {
      logger.error('Error getting user by ID:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuario no encontrado');
      }
      
      throw new Error('Error al obtener usuario');
    }
  }
}


// Export singleton instance
export const AuthService = new AuthServiceClass();
