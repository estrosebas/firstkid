import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { ModuleType } from '../types';

/**
 * Middleware para procesar resultados de validación de express-validator
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: firstError.msg
      }
    });
    return;
  }
  
  next();
};

/**
 * Validadores para autenticación
 */
export const validateRegister: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre debe tener entre 1 y 100 caracteres')
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

/**
 * Validadores para registro de uso de módulos
 */
export const validateUsage: ValidationChain[] = [
  body('module')
    .notEmpty()
    .withMessage('El módulo es requerido')
    .isIn(['rcp', 'nose', 'burn-skins'])
    .withMessage('El módulo debe ser uno de: rcp, nose, burn-skins')
];

/**
 * Validadores para scores
 */
export const validateScore: ValidationChain[] = [
  body('module')
    .notEmpty()
    .withMessage('El módulo es requerido')
    .isIn(['rcp', 'nose', 'burn-skins'])
    .withMessage('El módulo debe ser uno de: rcp, nose, burn-skins'),
  body('score')
    .notEmpty()
    .withMessage('El score es requerido')
    .isNumeric()
    .withMessage('El score debe ser un número')
    .isFloat({ min: 0, max: 100 })
    .withMessage('El score debe estar entre 0 y 100')
];

/**
 * Validador genérico para módulos
 */
export const isValidModule = (module: string): module is ModuleType => {
  return ['rcp', 'nose', 'burn-skins'].includes(module);
};
