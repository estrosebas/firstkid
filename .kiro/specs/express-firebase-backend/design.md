# Design Document - Express Firebase Backend

## Overview

El backend será una API REST construida con Express.js que se ejecutará como un servidor independiente en la raíz del proyecto. Utilizará Firebase Admin SDK para autenticación y Firestore para almacenamiento de datos. La arquitectura seguirá el patrón MVC con separación clara de responsabilidades mediante capas de routes, controllers, services y models.

El servidor se ejecutará en un puerto separado (por defecto 3000) y el frontend React existente se comunicará con él mediante peticiones HTTP. Se implementará CORS para permitir comunicación cross-origin durante desarrollo.

## Architecture

### High-Level Architecture

```
Frontend (React/Vite) ←→ Backend API (Express) ←→ Firebase Services
                                                    ├─ Firebase Auth
                                                    └─ Firestore
```

### Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── firebase.config.ts       # Inicialización Firebase Admin SDK
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Verificación de tokens JWT
│   │   ├── error.middleware.ts      # Manejo global de errores
│   │   └── validation.middleware.ts # Validación de requests
│   ├── routes/
│   │   ├── auth.routes.ts           # Rutas de autenticación
│   │   ├── usage.routes.ts          # Rutas de registro de uso
│   │   ├── score.routes.ts          # Rutas de scores
│   │   └── index.ts                 # Agregador de rutas
│   ├── controllers/
│   │   ├── auth.controller.ts       # Lógica de autenticación
│   │   ├── usage.controller.ts      # Lógica de registro de uso
│   │   └── score.controller.ts      # Lógica de scores
│   ├── services/
│   │   ├── auth.service.ts          # Servicios de Firebase Auth
│   │   ├── user.service.ts          # Servicios de usuarios en Firestore
│   │   ├── usage.service.ts         # Servicios de registros de uso
│   │   └── score.service.ts         # Servicios de scores
│   ├── models/
│   │   ├── user.model.ts            # Interfaz y validación de Usuario
│   │   ├── usage.model.ts           # Interfaz y validación de Uso
│   │   └── score.model.ts           # Interfaz y validación de Score
│   ├── types/
│   │   └── index.ts                 # Tipos TypeScript compartidos
│   ├── utils/
│   │   ├── response.util.ts         # Helpers para respuestas HTTP
│   │   └── logger.util.ts           # Logger simple
│   └── server.ts                    # Punto de entrada del servidor
├── .env.example                     # Ejemplo de variables de entorno
├── .gitignore                       # Ignorar node_modules y .env
├── package.json                     # Dependencias del backend
└── tsconfig.json                    # Configuración TypeScript
```

## Components and Interfaces

### 1. Authentication Flow

**Endpoints:**
- `POST /api/auth/register` - Registro con email/password
- `POST /api/auth/login` - Login con email/password
- `POST /api/auth/verify-token` - Verificar token de Firebase

**Flow:**
1. Cliente envía credenciales al endpoint
2. Controller valida el formato de los datos
3. Service interactúa con Firebase Auth
4. Si es registro exitoso, se crea documento de usuario en Firestore
5. Se retorna token de autenticación o error

**Auth Middleware:**
```typescript
// Verificación de token en cada request protegido
async function verifyToken(req, res, next) {
  1. Extraer token del header Authorization
  2. Verificar token con Firebase Admin SDK
  3. Adjuntar datos de usuario decodificados a req.user
  4. Continuar al siguiente middleware o retornar 401
}
```

### 2. Usage Tracking System

**Endpoint:**
- `POST /api/usage` - Registrar uso de módulo

**Request Body:**
```typescript
{
  module: 'rcp' | 'nose' | 'burn-skins'
}
```

**Flow:**
1. Middleware verifica autenticación
2. Controller valida que el módulo sea válido
3. Service crea documento en colección `usages` con:
   - userId (del token)
   - module
   - timestamp
4. Retorna confirmación

**Firestore Structure:**
```
usages/
  └── {usageId}/
      ├── userId: string
      ├── module: string
      ├── timestamp: Timestamp
```

### 3. Score Management System

**Endpoint:**
- `POST /api/score` - Guardar score de módulo

**Request Body:**
```typescript
{
  module: 'rcp' | 'nose' | 'burn-skins',
  score: number  // 0-100
}
```

**Flow:**
1. Middleware verifica autenticación
2. Controller valida módulo y rango de score
3. Service guarda score en colección `scores`
4. Retorna score guardado

**Firestore Structure:**
```
scores/
  └── {scoreId}/
      ├── userId: string
      ├── module: string
      ├── score: number
      ├── timestamp: Timestamp
```

### 4. User Management

**Firestore Structure:**
```
users/
  └── {userId}/  // Mismo ID que Firebase Auth
      ├── email: string
      ├── displayName: string (opcional)
      ├── photoURL: string (opcional)
      ├── createdAt: Timestamp
      ├── lastLogin: Timestamp
```

## Data Models

### User Model
```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
}
```

### Usage Model
```typescript
interface Usage {
  id?: string;
  userId: string;
  module: 'rcp' | 'nose' | 'burn-skins';
  timestamp: Date;
}
```

### Score Model
```typescript
interface Score {
  id?: string;
  userId: string;
  module: 'rcp' | 'nose' | 'burn-skins';
  score: number;  // 0-100
  timestamp: Date;
}
```

### API Response Model
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

## Error Handling

### Error Middleware Strategy

Todos los errores se capturan en un middleware global que:
1. Identifica el tipo de error
2. Mapea a código HTTP apropiado
3. Formatea respuesta consistente
4. Registra en logs

### Error Types

```typescript
class AppError extends Error {
  statusCode: number;
  code: string;
  
  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Errores específicos
class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El módulo especificado no es válido"
  }
}
```

## Security Considerations

### 1. Environment Variables
- Credenciales de Firebase en `.env`
- Service Account JSON path en variable de entorno
- Puerto del servidor configurable

### 2. CORS Configuration
```typescript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 3. Token Verification
- Todos los endpoints protegidos verifican token JWT de Firebase
- Tokens se validan con Firebase Admin SDK
- Tokens expirados rechazan automáticamente

### 4. Input Validation
- Validación de tipos de datos
- Sanitización de inputs
- Validación de rangos (scores 0-100)
- Validación de módulos permitidos

## Firebase Configuration

### Required Environment Variables

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Firebase Admin SDK Initialization

```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

export const auth = admin.auth();
export const db = admin.firestore();
```

## API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/auth/register | No | Registrar nuevo usuario |
| POST | /api/auth/login | No | Login con email/password |
| POST | /api/auth/verify-token | Yes | Verificar token válido |
| POST | /api/usage | Yes | Registrar uso de módulo |
| POST | /api/score | Yes | Guardar score de módulo |

## Testing Strategy

### Unit Tests
- Servicios de Firebase (mocked)
- Validaciones de modelos
- Utilidades y helpers

### Integration Tests
- Endpoints completos con Firebase Emulator
- Flujos de autenticación
- Creación y lectura de datos en Firestore

### Manual Testing
- Postman/Thunder Client para probar endpoints
- Verificar respuestas de error
- Validar integración con frontend

## Deployment Considerations

### Development
- Backend corre en `localhost:3000`
- Frontend corre en `localhost:5173` (Vite)
- CORS habilitado para desarrollo local

### Production
- Backend puede desplegarse en servicios como:
  - Google Cloud Run
  - Heroku
  - Railway
  - Render
- Variables de entorno configuradas en plataforma
- CORS configurado para dominio de producción
- HTTPS obligatorio

## Dependencies

### Core Dependencies
```json
{
  "express": "^4.18.2",
  "firebase-admin": "^12.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-validator": "^7.0.1"
}
```

### Dev Dependencies
```json
{
  "typescript": "^5.3.3",
  "@types/express": "^4.17.21",
  "@types/cors": "^2.8.17",
  "@types/node": "^20.10.5",
  "ts-node": "^10.9.2",
  "nodemon": "^3.0.2"
}
```

## Performance Considerations

1. **Connection Pooling**: Firebase Admin SDK maneja conexiones automáticamente
2. **Caching**: Considerar cache de tokens verificados (opcional para v1)
3. **Rate Limiting**: Implementar en versiones futuras si es necesario
4. **Batch Operations**: Para operaciones múltiples en Firestore
5. **Indexes**: Crear índices en Firestore para queries frecuentes (userId + module)
