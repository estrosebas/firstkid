import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Helper para enviar respuestas exitosas consistentes
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  return res.status(statusCode).json(response);
};

/**
 * Helper para enviar respuestas de error consistentes
 */
export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message
    }
  };
  return res.status(statusCode).json(response);
};
