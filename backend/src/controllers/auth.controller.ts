import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { logger } from '../utils/logger.util';
import { validationResult } from 'express-validator';

export class AuthController {
  private authService = AuthService;

  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          errors.array()[0].msg,
          400
        );
      }

      const { email, password, displayName } = req.body;

      const result = await this.authService.register(email, password, displayName);

      logger.info(`User registered successfully: ${result.uid}`);

      return sendSuccess(res, result, 201);
    } catch (error: any) {
      logger.error('Error in register controller:', error);
      return sendError(
        res,
        'REGISTRATION_ERROR',
        error.message || 'Error al registrar usuario',
        400
      );
    }
  };

  /**
   * Login user with email and password
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          errors.array()[0].msg,
          400
        );
      }

      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      logger.info(`User logged in successfully: ${result.uid}`);

      return sendSuccess(res, result, 200);
    } catch (error: any) {
      logger.error('Error in login controller:', error);
      return sendError(
        res,
        'LOGIN_ERROR',
        error.message || 'Error al iniciar sesión',
        401
      );
    }
  };

  /**
   * Verify token from Authorization header
   * POST /api/auth/verify-token
   */
  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          'Token de autenticación no proporcionado',
          400
        );
      }

      const token = authHeader.split('Bearer ')[1];

      if (!token) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          'Token de autenticación inválido',
          400
        );
      }

      const decodedToken = await this.authService.verifyToken(token);

      logger.info(`Token verified successfully for user: ${decodedToken.uid}`);

      return sendSuccess(res, {
        uid: decodedToken.uid,
        email: decodedToken.email,
        valid: true
      }, 200);
    } catch (error: any) {
      logger.error('Error in verify-token controller:', error);
      return sendError(
        res,
        'TOKEN_VERIFICATION_ERROR',
        error.message || 'Error al verificar token',
        401
      );
    }
  };
}
