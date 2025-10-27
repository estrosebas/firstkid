# Medical AI Backend

Backend REST API construido con Express.js y Firebase para la aplicación Medical AI.

## 🚀 Quick Start

**¿Primera vez configurando el proyecto?** → [QUICK_START.md](./QUICK_START.md)

## 📚 Documentación

**📖 [Ver índice completo de documentación](./DOCS_INDEX.md)**

- **[QUICK_START.md](./QUICK_START.md)** - Configuración rápida en 5 minutos ⚡
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Guía detallada de configuración de Firebase 🔥
- **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Colección de Postman para pruebas 📮
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Cómo probar con Thunder Client 🧪
- **[TOKEN_SYSTEM.md](./TOKEN_SYSTEM.md)** - Sistema de autenticación y tokens 🔐
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura y diseño del sistema 🏗️

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración de Firebase y otros servicios
│   ├── middleware/      # Middleware de Express (auth, error handling, etc.)
│   ├── routes/          # Definición de rutas de la API
│   ├── controllers/     # Lógica de controladores
│   ├── services/        # Servicios de negocio (Firebase, etc.)
│   ├── models/          # Modelos de datos e interfaces
│   ├── types/           # Tipos TypeScript compartidos
│   └── utils/           # Utilidades y helpers
├── .env.example         # Ejemplo de variables de entorno
├── package.json         # Dependencias del proyecto
└── tsconfig.json        # Configuración de TypeScript
```

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Firebase con proyecto configurado

## Instalación

1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Configurar Firebase y variables de entorno:
   - **📖 Sigue la guía completa**: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Esta guía incluye:
     - Crear proyecto en Firebase
     - Configurar Authentication y Firestore
     - Obtener credenciales
     - Configurar archivo `.env`
     - Probar la conexión

3. Configuración rápida (si ya tienes Firebase configurado):
```bash
cp .env.example .env
```
   - Edita `.env` con tus credenciales de Firebase
   - Ve a Firebase Console > Project Settings > Service Accounts
   - Genera una nueva clave privada
   - Copia los valores al archivo `.env`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm run build` - Compila el proyecto TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción

## Endpoints de la API

### Autenticación

#### POST /api/auth/register
Registrar nuevo usuario con email y contraseña.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/login
Iniciar sesión con credenciales existentes.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/verify-token
Verificar validez de un token de autenticación.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com"
  }
}
```

### Registro de Uso

#### POST /api/usage
Registrar cuando un usuario utiliza un módulo específico (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "module": "rcp"
}
```
Módulos válidos: `rcp`, `nose`, `burn-skins`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "usage-id",
    "userId": "firebase-user-id",
    "module": "rcp",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Scores

#### POST /api/score
Guardar score de un módulo para el usuario autenticado (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "module": "rcp",
  "score": 85
}
```
- Módulos válidos: `rcp`, `nose`, `burn-skins`
- Score: número entre 0 y 100

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "score-id",
    "userId": "firebase-user-id",
    "module": "rcp",
    "score": 85,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Manejo de Errores

Todos los errores siguen el mismo formato de respuesta:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

**Códigos de Estado HTTP:**
- `400` - Error de validación
- `401` - No autenticado
- `403` - No autorizado
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

## Desarrollo

El servidor se ejecuta por defecto en `http://localhost:3000`.

Para desarrollo local:
1. Inicia el backend: `npm run dev`
2. El servidor estará disponible en `http://localhost:3000`
3. Configura el frontend para hacer peticiones a esta URL

## Pruebas de la API

### Opción 1: Postman (Recomendado) 🚀

**📖 Guía completa**: [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)

Incluye colección completa con:
- ✅ Todos los endpoints configurados
- ✅ Tests automáticos
- ✅ Variables de entorno
- ✅ Token se guarda automáticamente

**Archivos para importar:**
- `Medical-AI-Backend.postman_collection.json`
- `Medical-AI-Backend.postman_environment.json`

### Opción 2: Thunder Client (VS Code)

**📖 Guía completa**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)

Esta guía incluye:
- Instrucciones para instalar Thunder Client
- Ejemplos de todos los endpoints con requests completos
- Flujo de prueba paso a paso
- Solución de problemas comunes
- Cómo verificar datos en Firebase Console

### Prueba Rápida

1. Registra un usuario en `/api/auth/register`
2. Copia el token de la respuesta
3. Usa el token en el header `Authorization: Bearer <token>` para endpoints protegidos

## Producción

Para desplegar en producción:

1. Compila el proyecto:
```bash
npm run build
```

2. Configura las variables de entorno en tu plataforma de hosting

3. Inicia el servidor:
```bash
npm start
```

Plataformas recomendadas:
- Google Cloud Run
- Railway
- Render
- Heroku
