import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { logger } from '../utils/logger.util';
import { AuthService } from '../services/auth.service';

// Use the singleton instance of AuthService
const authService = AuthService;

/**
 * Middleware para verificar tokens de autenticación
 * Extrae el token del header Authorization y lo verifica
 */
export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Token de autenticación no proporcionado'
        }
      });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Token de autenticación inválido'
        }
      });
      return;
    }

    // Verificar token
    const decodedToken = await authService.verifyToken(token);
    
    // Adjuntar datos de usuario decodificados a req.user
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    logger.info(`Usuario autenticado: ${decodedToken.uid}`);
    
    // Continuar al siguiente middleware
    next();
  } catch (error: any) {
    logger.error('Error al verificar token:', error);
    
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: error.message || 'Token de autenticación inválido'
      }
    });
  }
};
