// Tipos TypeScript compartidos
import { Request } from 'express';

export type ModuleType = 'rcp' | 'nose' | 'burn-skins';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}
