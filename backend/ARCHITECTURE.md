# Arquitectura del Backend - Medical AI

Este documento describe la arquitectura y flujo de datos del backend.

## Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Authentication
- **Desarrollo**: Nodemon + ts-node

## Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente (Frontend)                    │
│                  React / Vue / Angular                   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │ JSON
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Express Server                         │
│                   (Puerto 3000)                          │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  CORS    │  │  JSON    │  │  Error   │
│Middleware│  │ Parser   │  │ Handler  │
└──────────┘  └──────────┘  └──────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                      Routes                              │
│  /api/auth  |  /api/usage  |  /api/score               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Controllers                            │
│  auth.controller  |  usage.controller  |  score.controller│
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Services                              │
│  auth.service  |  user.service  |  usage.service  |     │
│  score.service                                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Firebase Admin SDK                        │
│         Authentication  |  Firestore                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Firebase Cloud                          │
│         (Datos persistentes en la nube)                  │
└─────────────────────────────────────────────────────────┘
```

## Flujo de Autenticación

```
┌─────────┐                                    ┌──────────┐
│ Cliente │                                    │ Firebase │
└────┬────┘                                    └────┬─────┘
     │                                              │
     │ 1. POST /api/auth/register                  │
     │    { email, password }                      │
     ├──────────────────────────────────────►      │
     │                                              │
     │                                         2. Crear usuario
     │                                              │
     │                                         3. Generar token
     │                                              │
     │ 4. { uid, email, token }                    │
     │◄──────────────────────────────────────      │
     │                                              │
     │ 5. Guardar token en localStorage            │
     │                                              │
     │ 6. POST /api/usage                          │
     │    Header: Authorization: Bearer {token}    │
     ├──────────────────────────────────────►      │
     │                                              │
     │                                         7. Verificar token
     │                                              │
     │                                         8. Obtener userId
     │                                              │
     │                                         9. Guardar en Firestore
     │                                              │
     │ 10. { success, data }                       │
     │◄──────────────────────────────────────      │
     │                                              │
```

## Estructura de Directorios

```
backend/
├── src/
│   ├── config/
│   │   └── firebase.config.ts       # Inicialización de Firebase
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Verificación de tokens
│   │   └── error.middleware.ts      # Manejo global de errores
│   │
│   ├── routes/
│   │   ├── index.ts                 # Agregador de rutas
│   │   ├── auth.routes.ts           # Rutas de autenticación
│   │   ├── usage.routes.ts          # Rutas de uso
│   │   └── score.routes.ts          # Rutas de scores
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts       # Lógica de autenticación
│   │   ├── usage.controller.ts      # Lógica de uso
│   │   └── score.controller.ts      # Lógica de scores
│   │
│   ├── services/
│   │   ├── auth.service.ts          # Servicios de Firebase Auth
│   │   ├── user.service.ts          # Servicios de usuarios
│   │   ├── usage.service.ts         # Servicios de uso
│   │   └── score.service.ts         # Servicios de scores
│   │
│   ├── models/
│   │   ├── user.model.ts            # Modelo de usuario
│   │   ├── usage.model.ts           # Modelo de uso
│   │   └── score.model.ts           # Modelo de score
│   │
│   ├── types/
│   │   └── index.ts                 # Tipos TypeScript compartidos
│   │
│   ├── utils/
│   │   ├── logger.util.ts           # Utilidad de logging
│   │   └── response.util.ts         # Utilidad de respuestas
│   │
│   └── server.ts                    # Punto de entrada
│
├── .env                             # Variables de entorno (no en git)
├── .env.example                     # Ejemplo de variables
├── package.json                     # Dependencias
├── tsconfig.json                    # Configuración TypeScript
└── nodemon.json                     # Configuración Nodemon
```

## Modelos de Datos

### User
```typescript
{
  uid: string;           // ID único de Firebase
  email: string;         // Email del usuario
  createdAt: Timestamp;  // Fecha de creación
}
```

### Usage
```typescript
{
  id: string;            // ID único del documento
  userId: string;        // ID del usuario
  module: string;        // "rcp" | "nose" | "burn-skins"
  timestamp: Timestamp;  // Fecha y hora del uso
}
```

### Score
```typescript
{
  id: string;            // ID único del documento
  userId: string;        // ID del usuario
  module: string;        // "rcp" | "nose" | "burn-skins"
  score: number;         // Puntaje (0-100)
  timestamp: Timestamp;  // Fecha y hora del score
}
```

## Endpoints

### Públicos (No requieren autenticación)
- `GET /health` - Health check
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Protegidos (Requieren token)
- `POST /api/auth/verify-token` - Verificar token
- `POST /api/usage` - Registrar uso de módulo
- `POST /api/score` - Guardar score

## Seguridad

### Autenticación
- Tokens JWT generados por Firebase
- Validación en cada request protegido
- Expiración automática de tokens (1 hora)

### Autorización
- Reglas de Firestore validan que userId coincida con el usuario autenticado
- Los usuarios solo pueden acceder a sus propios datos

### CORS
- Configurado para aceptar requests del frontend
- Headers permitidos: Content-Type, Authorization
- Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS

### Variables de Entorno
- Credenciales sensibles en `.env`
- `.env` en `.gitignore`
- Validación de variables requeridas al inicio

## Manejo de Errores

### Tipos de Errores
1. **Validación** (400): Datos de entrada inválidos
2. **Autenticación** (401): Token inválido o faltante
3. **Autorización** (403): Sin permisos
4. **No encontrado** (404): Recurso no existe
5. **Servidor** (500): Error interno

### Formato de Respuesta de Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

## Logging

### Niveles de Log
- **INFO**: Información general (inicio de servidor, operaciones exitosas)
- **ERROR**: Errores capturados (fallos de autenticación, errores de Firebase)
- **DEBUG**: Información de depuración (solo en desarrollo)

### Formato
```
[2025-10-27T01:00:00.000Z] [LEVEL] Mensaje
```

## Performance

### Optimizaciones
- Conexión persistente a Firebase
- Validación temprana de datos
- Respuestas JSON compactas
- Índices en Firestore para consultas rápidas

### Límites
- Tamaño máximo de request: 10MB
- Timeout de request: 30 segundos
- Rate limiting: (a implementar en producción)

## Escalabilidad

### Horizontal
- Stateless: Puede ejecutarse en múltiples instancias
- Firebase maneja la concurrencia
- Load balancer puede distribuir tráfico

### Vertical
- Node.js single-threaded
- Firebase Admin SDK optimizado
- Conexiones pooling automático

## Deployment

### Desarrollo
```bash
npm run dev
```
- Hot reload con nodemon
- Logs detallados
- Variables de entorno locales

### Producción
```bash
npm run build
npm start
```
- Código compilado a JavaScript
- Logs optimizados
- Variables de entorno del hosting

### Plataformas Recomendadas
- **Google Cloud Run**: Integración nativa con Firebase
- **Railway**: Deploy automático desde Git
- **Render**: Free tier disponible
- **Heroku**: Fácil configuración

## Monitoreo

### Firebase Console
- Usuarios registrados
- Datos en Firestore
- Reglas de seguridad
- Uso de recursos

### Logs del Servidor
- Requests entrantes
- Errores capturados
- Operaciones de Firebase
- Performance

## Testing

### Herramientas
- Thunder Client (VS Code)
- Postman
- curl

### Flujo de Prueba
1. Health check
2. Registro de usuario
3. Verificación de token
4. Operaciones protegidas
5. Verificación en Firebase Console

## Próximas Mejoras

### Funcionalidades
- [ ] Refresh tokens
- [ ] Recuperación de contraseña
- [ ] Perfil de usuario
- [ ] Historial de scores
- [ ] Estadísticas de uso

### Seguridad
- [ ] Rate limiting
- [ ] IP whitelisting
- [ ] Audit logs
- [ ] Encriptación adicional

### Performance
- [ ] Caching con Redis
- [ ] Compresión de respuestas
- [ ] CDN para assets
- [ ] Optimización de queries

### DevOps
- [ ] CI/CD pipeline
- [ ] Tests automatizados
- [ ] Monitoring con Sentry
- [ ] Alertas automáticas

## Recursos

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
