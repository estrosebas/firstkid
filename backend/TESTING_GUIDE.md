# Guía de Pruebas - Medical AI Backend

Esta guía te ayudará a probar todos los endpoints del backend usando Thunder Client (extensión de VS Code).

## Instalación de Thunder Client

1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Busca "Thunder Client"
4. Instala la extensión
5. Haz clic en el ícono de rayo ⚡ en la barra lateral

## Configuración Inicial

Asegúrate de que el servidor esté corriendo:
```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor Express iniciado exitosamente
📡 Puerto: 3000
🔥 Firebase Project: firstkid
```

---

## 1. Health Check

**Propósito**: Verificar que el servidor está funcionando

### Request
- **Método**: `GET`
- **URL**: `http://localhost:3000/health`
- **Headers**: Ninguno
- **Body**: Ninguno

### Respuesta Esperada
```json
{
  "success": true,
  "message": "Backend API está funcionando correctamente",
  "timestamp": "2025-10-27T01:00:00.000Z"
}
```

---

## 2. Registro de Usuario

**Propósito**: Crear una nueva cuenta de usuario

### Request
- **Método**: `POST`
- **URL**: `http://localhost:3000/api/auth/register`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body** (JSON):
```json
{
  "email": "usuario@example.com",
  "password": "miPassword123"
}
```

### Respuesta Esperada
```json
{
  "success": true,
  "data": {
    "uid": "abc123xyz789...",
    "email": "usuario@example.com",
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE**: Guarda el `token` de la respuesta, lo necesitarás para los siguientes endpoints.

### Errores Comunes
- **400**: Email inválido o contraseña muy corta
- **500**: El usuario ya existe

---

## 3. Inicio de Sesión

**Propósito**: Autenticar un usuario existente

### Request
- **Método**: `POST`
- **URL**: `http://localhost:3000/api/auth/login`
- **Headers**:
  - `Content-Type`: `application/json`
- **Body** (JSON):
```json
{
  "email": "usuario@example.com",
  "password": "miPassword123"
}
```

### Respuesta Esperada
```json
{
  "success": true,
  "data": {
    "uid": "abc123xyz789...",
    "email": "usuario@example.com",
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Errores Comunes
- **401**: Email o contraseña incorrectos
- **400**: Datos de entrada inválidos

---

## 4. Verificar Token

**Propósito**: Validar que un token de autenticación es válido

### Request
- **Método**: `POST`
- **URL**: `http://localhost:3000/api/auth/verify-token`
- **Headers**:
  - `Authorization`: `Bearer TU_TOKEN_AQUI`
- **Body**: Ninguno

### Respuesta Esperada
```json
{
  "success": true,
  "data": {
    "uid": "abc123xyz789...",
    "email": "usuario@example.com"
  }
}
```

### Errores Comunes
- **401**: Token inválido o expirado
- **401**: Header Authorization faltante

---

## 5. Registrar Uso de Módulo

**Propósito**: Registrar cuando un usuario utiliza un módulo específico

### Request
- **Método**: `POST`
- **URL**: `http://localhost:3000/api/usage`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer TU_TOKEN_AQUI`
- **Body** (JSON):
```json
{
  "module": "rcp"
}
```

**Módulos válidos**: `rcp`, `nose`, `burn-skins`

### Respuesta Esperada
```json
{
  "success": true,
  "data": {
    "id": "usage123...",
    "userId": "abc123xyz789...",
    "module": "rcp",
    "timestamp": "2025-10-27T01:00:00.000Z"
  }
}
```

### Errores Comunes
- **401**: Token inválido o faltante
- **400**: Módulo inválido (debe ser rcp, nose o burn-skins)

---

## 6. Guardar Score

**Propósito**: Guardar el puntaje obtenido por un usuario en un módulo

### Request
- **Método**: `POST`
- **URL**: `http://localhost:3000/api/score`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer TU_TOKEN_AQUI`
- **Body** (JSON):
```json
{
  "module": "rcp",
  "score": 85
}
```

**Validaciones**:
- `module`: Debe ser `rcp`, `nose` o `burn-skins`
- `score`: Número entre 0 y 100

### Respuesta Esperada
```json
{
  "success": true,
  "data": {
    "id": "score123...",
    "userId": "abc123xyz789...",
    "module": "rcp",
    "score": 85,
    "timestamp": "2025-10-27T01:00:00.000Z"
  }
}
```

### Errores Comunes
- **401**: Token inválido o faltante
- **400**: Módulo inválido
- **400**: Score fuera del rango 0-100

---

## Flujo de Prueba Completo

Sigue este orden para probar todo el sistema:

### 1. Verificar que el servidor funciona
```
GET http://localhost:3000/health
```

### 2. Registrar un nuevo usuario
```
POST http://localhost:3000/api/auth/register
Body: { "email": "test@example.com", "password": "test123" }
```
**→ Guarda el token de la respuesta**

### 3. Verificar el token
```
POST http://localhost:3000/api/auth/verify-token
Header: Authorization: Bearer {token}
```

### 4. Registrar uso de módulo
```
POST http://localhost:3000/api/usage
Header: Authorization: Bearer {token}
Body: { "module": "rcp" }
```

### 5. Guardar un score
```
POST http://localhost:3000/api/score
Header: Authorization: Bearer {token}
Body: { "module": "rcp", "score": 85 }
```

### 6. Verificar en Firebase Console
- Ve a Firebase Console > Authentication
- Deberías ver el usuario `test@example.com`
- Ve a Firestore Database
- Deberías ver documentos en las colecciones `users`, `usage` y `scores`

---

## Colección de Thunder Client

Puedes importar esta colección en Thunder Client para tener todos los requests listos:

### Crear Colección

1. En Thunder Client, haz clic en "Collections"
2. Click en "New Collection"
3. Nombre: "Medical AI Backend"
4. Agrega cada uno de los requests anteriores

### Variables de Entorno

Crea variables para facilitar las pruebas:

1. Click en "Env" en Thunder Client
2. Crea un nuevo entorno "Local"
3. Agrega estas variables:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (déjalo vacío, lo llenarás después del registro)

4. Usa las variables en tus requests:
   - URL: `{{baseUrl}}/api/auth/register`
   - Header: `Authorization: Bearer {{token}}`

---

## Verificar Datos en Firebase Console

### Ver Usuarios
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "firstkid"
3. Click en "Authentication"
4. Verás la lista de usuarios registrados

### Ver Datos en Firestore
1. En Firebase Console, click en "Firestore Database"
2. Explora las colecciones:
   - **users**: Información de usuarios
   - **usage**: Registros de uso de módulos
   - **scores**: Puntajes guardados

---

## Troubleshooting

### Error: "Cannot connect to localhost:3000"
- Verifica que el servidor esté corriendo con `npm run dev`
- Revisa que el puerto 3000 no esté ocupado

### Error: "Token inválido"
- El token expira después de 1 hora
- Genera un nuevo token haciendo login nuevamente
- Verifica que estés copiando el token completo

### Error: "PERMISSION_DENIED" en Firestore
- Verifica que las reglas de seguridad estén publicadas
- Asegúrate de estar usando un token válido
- Revisa que el userId en los datos coincida con el usuario autenticado

### Error: "Firebase initialization failed"
- Verifica que el archivo `.env` tenga las credenciales correctas
- Asegúrate de que `FIREBASE_PRIVATE_KEY` tenga comillas dobles
- Reinicia el servidor después de cambiar el `.env`

---

## Próximos Pasos

Una vez que todos los endpoints funcionen correctamente:

1. ✅ Integra el frontend con estos endpoints
2. ✅ Implementa manejo de errores en el frontend
3. ✅ Agrega loading states durante las peticiones
4. ✅ Implementa refresh de tokens si es necesario
5. ✅ Considera agregar más endpoints según necesites

---

## Recursos

- [Thunder Client Documentation](https://www.thunderclient.com/docs)
- [Postman Alternative](https://www.postman.com/)
- [Firebase Console](https://console.firebase.google.com/)
- [Backend README](./README.md)
- [Firebase Setup Guide](./FIREBASE_SETUP.md)
