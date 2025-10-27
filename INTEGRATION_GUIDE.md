# Guía de Integración Frontend-Backend

Esta guía explica cómo el frontend se integra con el backend de Medical AI.

## 🔧 Configuración

### Backend

1. **Iniciar el servidor backend:**
```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Frontend

1. **Configurar la URL de la API:**

Crea o edita el archivo `.env.local` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000
```

2. **Iniciar el frontend:**
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📁 Estructura de Servicios

### API Service (`src/services/api.service.ts`)

Servicio base para todas las peticiones HTTP:

```typescript
import { apiService } from './services/api.service';

// GET request
const response = await apiService.get('/api/endpoint');

// POST request
const response = await apiService.post('/api/endpoint', { data });
```

**Características:**
- Manejo automático de tokens de autenticación
- Headers configurados automáticamente
- Manejo de errores centralizado

### Auth Service (`src/services/auth.service.ts`)

Maneja la autenticación de usuarios:

```typescript
import { authService } from './services/auth.service';

// Login
const result = await authService.login({ email, password });

// Register
const result = await authService.register({ email, password, displayName });

// Logout
authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();
```

**Almacenamiento:**
- Token: `localStorage.getItem('authToken')`
- Usuario: `localStorage.getItem('currentUser')`

### Module Service (`src/services/module.service.ts`)

Maneja el registro de uso y scores de módulos:

```typescript
import { moduleService } from './services/module.service';

// Register module usage
await moduleService.registerUsage('rcp');

// Save score
await moduleService.saveScore('rcp', 85);
```

**Módulos disponibles:**
- `rcp` - Reanimación Cardiopulmonar
- `nose` - Hemorragia Nasal
- `burn-skins` - Quemaduras

## 🔐 Flujo de Autenticación

### 1. Login

```typescript
// src/pages/Login.tsx
const result = await authService.login({ email, password });

if (result.success) {
  // Token y usuario guardados automáticamente
  navigate('/home');
} else {
  setError(result.error);
}
```

### 2. Requests Autenticados

Todos los requests a endpoints protegidos incluyen automáticamente el token:

```typescript
// El token se agrega automáticamente desde localStorage
const response = await apiService.post('/api/usage', { module: 'rcp' });
```

### 3. Logout

```typescript
authService.logout();
// Limpia token y usuario de localStorage
navigate('/login');
```

## 📊 Integración con Módulos

### Registro de Uso

Cuando un usuario abre un módulo (RCP, Nose, Burn-Skins):

```typescript
// src/pages/Technique.tsx
const handleStartPractice = async () => {
  // Registrar uso del módulo
  await moduleService.registerUsage(slugToModule[slug]);
  
  // Abrir detector
  setShowRCPDetector(true);
};
```

### Guardado de Scores

Los scores se guardan automáticamente durante la detección:

```typescript
// En RCPDetector
const score = Math.round(prob * 100);
await moduleService.saveScore("rcp", score);
```

**Frecuencia:**
- Se guarda un score cada vez que el modelo hace una predicción
- Aproximadamente cada 1 segundo durante la detección activa

## 🔄 Flujo Completo de Usuario

1. **Login**
   ```
   Usuario → Login Page → authService.login() → Backend /api/auth/login
   ↓
   Token guardado en localStorage
   ↓
   Redirect a /home
   ```

2. **Usar Módulo**
   ```
   Usuario → Technique Page → Click "Practicar"
   ↓
   moduleService.registerUsage() → Backend /api/usage
   ↓
   Abrir Detector (RCP/Nose/Burn)
   ```

3. **Detección y Score**
   ```
   Detector → Captura frame cada 1s → Modelo TensorFlow
   ↓
   Predicción (score 0-100)
   ↓
   moduleService.saveScore() → Backend /api/score
   ↓
   Mostrar resultado al usuario
   ```

## 🛠️ Desarrollo

### Agregar Nuevo Endpoint

1. **Backend:** Crear ruta y controlador
2. **Frontend:** Agregar método en el servicio correspondiente

Ejemplo:

```typescript
// src/services/module.service.ts
async getScoreHistory(module: ModuleType) {
  const response = await apiService.get(`/api/scores/${module}`);
  return response;
}
```

### Debugging

**Ver requests en la consola:**
```typescript
// Los errores se logean automáticamente en api.service.ts
console.log('API Request Error:', error);
```

**Ver token actual:**
```typescript
console.log('Token:', authService.getToken());
console.log('User:', authService.getCurrentUser());
```

## 🔒 Seguridad

### Tokens JWT

- **Expiración:** 1 hora
- **Almacenamiento:** localStorage
- **Transmisión:** Header `Authorization: Bearer {token}`

### Protección de Rutas

Para proteger rutas en el frontend:

```typescript
// Verificar autenticación antes de renderizar
if (!authService.isAuthenticated()) {
  navigate('/login');
  return null;
}
```

### CORS

El backend está configurado para aceptar requests desde:
- `http://localhost:5173` (desarrollo)
- Configurable via `FRONTEND_URL` en `.env`

## 📝 Variables de Entorno

### Backend (`.env`)
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
```

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:3000
```

## 🧪 Testing

### Probar Login

1. Inicia backend y frontend
2. Ve a `http://localhost:5173/login`
3. Usa credenciales de Firebase
4. Verifica que redirija a `/home`

### Probar Módulos

1. Login exitoso
2. Ve a una técnica (ej: `/technique/rcp`)
3. Click en "Practicar"
4. Verifica en la consola:
   - `Usage registered for module: rcp`
   - `Score saved: XX`

### Verificar en Firebase

1. Ve a Firebase Console
2. Firestore Database
3. Verifica documentos en:
   - `users` - Usuario registrado
   - `usage` - Registros de uso
   - `scores` - Scores guardados

## ❌ Troubleshooting

### Error: "Cannot connect to backend"

**Causa:** Backend no está corriendo o URL incorrecta

**Solución:**
```bash
# Verificar que el backend esté corriendo
cd backend
npm run dev

# Verificar .env.local
cat .env.local
# Debe tener: VITE_API_URL=http://localhost:3000
```

### Error: "Token inválido"

**Causa:** Token expirado o inválido

**Solución:**
```typescript
// Hacer logout y login nuevamente
authService.logout();
// Usuario debe hacer login de nuevo
```

### Error: "CORS policy"

**Causa:** Frontend URL no está en la lista de CORS del backend

**Solución:**
```bash
# En backend/.env, verificar:
FRONTEND_URL=http://localhost:5173
```

### Scores no se guardan

**Causa:** Usuario no autenticado o error en el servicio

**Solución:**
```typescript
// Verificar autenticación
console.log('Authenticated:', authService.isAuthenticated());
console.log('Token:', authService.getToken());

// Verificar errores en consola del navegador
```

## 📚 Recursos

- **Backend API Docs:** `backend/README.md`
- **Postman Collection:** `backend/Medical-AI-Backend.postman_collection.json`
- **Token System:** `backend/TOKEN_SYSTEM.md`
- **Architecture:** `backend/ARCHITECTURE.md`

## 🚀 Deployment

### Backend

1. Configurar variables de entorno en el hosting
2. Actualizar `FRONTEND_URL` con la URL de producción
3. Desplegar con `npm run build && npm start`

### Frontend

1. Actualizar `VITE_API_URL` con la URL del backend en producción
2. Build: `npm run build`
3. Desplegar la carpeta `dist/`

### Ejemplo con Railway

**Backend:**
```bash
# Variables de entorno en Railway
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
JWT_SECRET=...
FRONTEND_URL=https://tu-frontend.vercel.app
PORT=3000
NODE_ENV=production
```

**Frontend:**
```bash
# Variables de entorno en Vercel
VITE_API_URL=https://tu-backend.railway.app
```

## ✅ Checklist de Integración

- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] `.env` configurado en backend
- [ ] `.env.local` configurado en frontend
- [ ] Firebase configurado correctamente
- [ ] Login funciona
- [ ] Registro de usage funciona
- [ ] Guardado de scores funciona
- [ ] Datos visibles en Firebase Console

---

¡La integración está completa! 🎉
