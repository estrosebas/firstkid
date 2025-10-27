# Tutorial: Configuración de Firebase para Medical AI Backend

Este tutorial te guiará paso a paso para configurar Firebase y conectarlo con tu backend local.

## Índice
1. [Crear Proyecto en Firebase](#1-crear-proyecto-en-firebase)
2. [Configurar Authentication](#2-configurar-authentication)
3. [Configurar Firestore Database](#3-configurar-firestore-database)
4. [Obtener Credenciales](#4-obtener-credenciales)
5. [Configurar Backend Local](#5-configurar-backend-local)
6. [Probar la Conexión](#6-probar-la-conexión)

---

## 1. Crear Proyecto en Firebase

### Paso 1.1: Acceder a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Agregar proyecto"** o **"Add project"**

### Paso 1.2: Configurar el Proyecto
1. **Nombre del proyecto**: Ingresa un nombre (ej: `medical-ai-app`)
2. Haz clic en **Continuar**
3. **Google Analytics**: Puedes desactivarlo para desarrollo o dejarlo activado
4. Haz clic en **Crear proyecto**
5. Espera a que se complete la creación (30-60 segundos)
6. Haz clic en **Continuar**

---

## 2. Configurar Authentication

### Paso 2.1: Habilitar Authentication
1. En el menú lateral, haz clic en **"Authentication"** (icono de persona)
2. Haz clic en **"Get started"** o **"Comenzar"**

### Paso 2.2: Habilitar Email/Password
1. Ve a la pestaña **"Sign-in method"** o **"Método de acceso"**
2. Busca **"Email/Password"** en la lista de proveedores
3. Haz clic en **"Email/Password"**
4. Activa el interruptor de **"Enable"** o **"Habilitar"**
5. **NO** actives "Email link (passwordless sign-in)"
6. Haz clic en **"Save"** o **"Guardar"**

### Resultado Esperado
Deberías ver "Email/Password" con estado **"Enabled"** en verde.

---

## 3. Configurar Firestore Database

### Paso 3.1: Crear Base de Datos
1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en **"Create database"** o **"Crear base de datos"**

### Paso 3.2: Configurar Modo de Seguridad
1. Selecciona **"Start in production mode"** (modo producción)
   - Esto es más seguro, las reglas se configurarán después
2. Haz clic en **"Next"** o **"Siguiente"**

### Paso 3.3: Seleccionar Ubicación
1. Elige la ubicación más cercana a tus usuarios:
   - **us-central1** (Iowa) - Recomendado para América
   - **europe-west1** (Bélgica) - Recomendado para Europa
   - **asia-northeast1** (Tokio) - Recomendado para Asia
2. Haz clic en **"Enable"** o **"Habilitar"**
3. Espera a que se cree la base de datos (1-2 minutos)

### Paso 3.4: Crear Colecciones

#### Colección: users
1. Haz clic en **"Start collection"** o **"Iniciar colección"**
2. **Collection ID**: `users`
3. Haz clic en **"Next"**
4. Crea un documento de ejemplo:
   - **Document ID**: Haz clic en "Auto-ID"
   - Agrega campos:
     - `email` (string): `test@example.com`
     - `createdAt` (timestamp): Haz clic en el reloj para usar timestamp actual
5. Haz clic en **"Save"**

#### Colección: usage
1. Haz clic en **"Start collection"**
2. **Collection ID**: `usage`
3. Haz clic en **"Next"**
4. Crea un documento de ejemplo:
   - **Document ID**: Auto-ID
   - Agrega campos:
     - `userId` (string): `test-user-id`
     - `module` (string): `rcp`
     - `timestamp` (timestamp): Timestamp actual
5. Haz clic en **"Save"**

#### Colección: scores
1. Haz clic en **"Start collection"**
2. **Collection ID**: `scores`
3. Haz clic en **"Next"**
4. Crea un documento de ejemplo:
   - **Document ID**: Auto-ID
   - Agrega campos:
     - `userId` (string): `test-user-id`
     - `module` (string): `rcp`
     - `score` (number): `85`
     - `timestamp` (timestamp): Timestamp actual
5. Haz clic en **"Save"**

### Paso 3.5: Configurar Reglas de Seguridad
1. Ve a la pestaña **"Rules"** o **"Reglas"**
2. Reemplaza el contenido con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función helper para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Función helper para verificar que el usuario es el dueño
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Colección users
    match /users/{userId} {
      // Permitir lectura solo al usuario dueño
      allow read: if isOwner(userId);
      // Permitir creación durante registro
      allow create: if isAuthenticated();
      // Permitir actualización solo al dueño
      allow update: if isOwner(userId);
    }
    
    // Colección usage
    match /usage/{usageId} {
      // Permitir lectura solo de registros propios
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // Permitir creación solo si el userId coincide con el usuario autenticado
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
    
    // Colección scores
    match /scores/{scoreId} {
      // Permitir lectura solo de scores propios
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // Permitir creación solo si el userId coincide con el usuario autenticado
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Haz clic en **"Publish"** o **"Publicar"**

---

## 4. Obtener Credenciales

### Paso 4.1: Generar Service Account Key
1. Haz clic en el ícono de **engranaje ⚙️** junto a "Project Overview"
2. Selecciona **"Project settings"** o **"Configuración del proyecto"**
3. Ve a la pestaña **"Service accounts"** o **"Cuentas de servicio"**
4. Haz clic en **"Generate new private key"** o **"Generar nueva clave privada"**
5. Confirma haciendo clic en **"Generate key"**
6. Se descargará un archivo JSON (ej: `medical-ai-app-firebase-adminsdk-xxxxx.json`)
7. **¡IMPORTANTE!** Guarda este archivo en un lugar seguro, NO lo compartas

### Paso 4.2: Extraer Información del JSON
Abre el archivo JSON descargado y encontrarás algo como esto:

```json
{
  "type": "service_account",
  "project_id": "medical-ai-app",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@medical-ai-app.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

Necesitarás estos 3 valores:
- `project_id`
- `client_email`
- `private_key`

---

## 5. Configurar Backend Local

### Paso 5.1: Crear Archivo .env
1. En tu terminal, navega a la carpeta `backend/`:
```bash
cd backend
```

2. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

### Paso 5.2: Editar .env
Abre el archivo `backend/.env` y completa con los valores del JSON:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=medical-ai-app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@medical-ai-app.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANTE:**
- El `FIREBASE_PRIVATE_KEY` debe estar entre comillas dobles
- Mantén los `\n` en la clave privada (son saltos de línea)
- NO compartas este archivo, está en `.gitignore`

### Paso 5.3: Verificar Configuración
El archivo `backend/src/config/firebase.config.ts` ya está configurado para leer estas variables:

```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

export const db = admin.firestore();
export const auth = admin.auth();
```

---

## 6. Probar la Conexión

### Paso 6.1: Instalar Dependencias
```bash
npm install
```

### Paso 6.2: Iniciar el Servidor
```bash
npm run dev
```

Deberías ver:
```
🚀 Server running on port 3000
✅ Firebase initialized successfully
```

### Paso 6.3: Probar Registro de Usuario

#### Opción A: Usando Postman o Thunder Client (Recomendado para Windows)

1. **Instalar Thunder Client** (extensión de VS Code):
   - Abre VS Code
   - Ve a Extensions (Ctrl+Shift+X)
   - Busca "Thunder Client"
   - Instala la extensión

2. **Crear Request de Registro**:
   - Abre Thunder Client
   - Click en "New Request"
   - Método: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Headers:
     - `Content-Type`: `application/json`
   - Body (JSON):
     ```json
     {
       "email": "prueba@example.com",
       "password": "password123"
     }
     ```
   - Click en "Send"

#### Opción B: Usando curl (Linux/Mac/PowerShell)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prueba@example.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "uid": "abc123xyz...",
    "email": "prueba@example.com",
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Paso 6.4: Verificar en Firebase Console
1. Ve a **Authentication** en Firebase Console
2. Deberías ver el usuario `prueba@example.com` en la lista
3. Ve a **Firestore Database**
4. Deberías ver un nuevo documento en la colección `users`

### Paso 6.5: Probar Endpoints Protegidos

#### Usando Thunder Client:

1. **Crear Request de Usage**:
   - Click en "New Request"
   - Método: `POST`
   - URL: `http://localhost:3000/api/usage`
   - Headers:
     - `Content-Type`: `application/json`
     - `Authorization`: `Bearer TU_TOKEN_AQUI` (copia el token de la respuesta anterior)
   - Body (JSON):
     ```json
     {
       "module": "rcp"
     }
     ```
   - Click en "Send"

#### Usando curl:

```bash
curl -X POST http://localhost:3000/api/usage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "module": "rcp"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "xyz789...",
    "userId": "abc123xyz...",
    "module": "rcp",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Solución de Problemas

### Error: "Firebase initialization failed"
- Verifica que las variables en `.env` estén correctamente copiadas
- Asegúrate de que `FIREBASE_PRIVATE_KEY` tenga comillas dobles
- Verifica que no haya espacios extra al inicio o final de las variables

### Error: "PERMISSION_DENIED"
- Verifica que las reglas de Firestore estén publicadas correctamente
- Asegúrate de estar enviando el token en el header `Authorization`
- Verifica que el token no haya expirado

### Error: "User not found" al hacer login
- Asegúrate de haber registrado el usuario primero con `/api/auth/register`
- Verifica en Firebase Console > Authentication que el usuario existe

### El servidor no inicia
- Verifica que el puerto 3000 no esté en uso
- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas
- Revisa los logs en la consola para más detalles del error

---

## Estructura de Datos en Firestore

### Colección: users
```
users/
  └── {userId}/
      ├── email: string
      └── createdAt: timestamp
```

### Colección: usage
```
usage/
  └── {usageId}/
      ├── userId: string
      ├── module: string ("rcp" | "nose" | "burn-skins")
      └── timestamp: timestamp
```

### Colección: scores
```
scores/
  └── {scoreId}/
      ├── userId: string
      ├── module: string ("rcp" | "nose" | "burn-skins")
      ├── score: number (0-100)
      └── timestamp: timestamp
```

---

## Próximos Pasos

1. ✅ Firebase configurado y funcionando
2. ✅ Backend conectado a Firebase
3. ✅ Endpoints probados y funcionando

Ahora puedes:
- Integrar el frontend con estos endpoints
- Agregar más funcionalidades al backend
- Configurar índices en Firestore para consultas más complejas
- Implementar Cloud Functions si es necesario

---

## Documentación Adicional

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Guía completa para probar todos los endpoints
- **[README.md](./README.md)** - Documentación general del backend

## Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## Seguridad

**⚠️ NUNCA compartas:**
- El archivo `.env`
- El archivo JSON de Service Account
- Tokens de autenticación en repositorios públicos

**✅ Buenas prácticas:**
- Mantén `.env` en `.gitignore`
- Usa variables de entorno en producción
- Rota las credenciales periódicamente
- Implementa rate limiting en producción
- Monitorea el uso en Firebase Console
