# Quick Start - Medical AI Backend

Guía rápida para poner en marcha el backend en 5 minutos.

## ✅ Checklist de Configuración

### 1. Instalar Dependencias
```bash
cd backend
npm install
```

### 2. Configurar Firebase
Sigue estos pasos en orden:

1. **Crear proyecto en Firebase Console**
   - Ve a https://console.firebase.google.com/
   - Click en "Agregar proyecto"
   - Nombre: `firstkid` (o el que prefieras)

2. **Habilitar Authentication**
   - En Firebase Console > Authentication
   - Click "Get started"
   - Habilita "Email/Password"

3. **Crear Firestore Database**
   - En Firebase Console > Firestore Database
   - Click "Create database"
   - Modo: "Production mode"
   - Ubicación: Elige la más cercana

4. **Crear colecciones** (con un documento de ejemplo cada una):
   - `users`
   - `usage`
   - `scores`

5. **Configurar reglas de seguridad**
   - Copia las reglas de [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#paso-35-configurar-reglas-de-seguridad)

6. **Obtener credenciales**
   - Firebase Console > ⚙️ > Project settings
   - Tab "Service accounts"
   - Click "Generate new private key"
   - Descarga el archivo JSON

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita `backend/.env` con los valores del JSON descargado:
```env
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANTE**: 
- El `FIREBASE_PRIVATE_KEY` debe estar entre comillas dobles
- Mantén los `\n` en la clave

### 4. Iniciar el Servidor
```bash
npm run dev
```

Deberías ver:
```
✅ Firebase Admin SDK inicializado correctamente
✅ Variables de entorno validadas correctamente
🚀 Servidor Express iniciado exitosamente
📡 Puerto: 3000
🔥 Firebase Project: tu-project-id
```

### 5. Probar la API

#### Opción A: Thunder Client (Recomendado)
1. Instala la extensión "Thunder Client" en VS Code
2. Sigue la guía: [TESTING_GUIDE.md](./TESTING_GUIDE.md)

#### Opción B: Navegador
Abre: http://localhost:3000/health

Deberías ver:
```json
{
  "success": true,
  "message": "Backend API está funcionando correctamente"
}
```

## 🚀 Próximos Pasos

1. ✅ Backend funcionando
2. ✅ Firebase configurado
3. ✅ Endpoints listos para usar

Ahora puedes:
- Probar todos los endpoints con [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- Integrar el frontend con el backend
- Ver los datos en Firebase Console

## 📚 Documentación Completa

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Guía detallada de configuración de Firebase
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Cómo probar todos los endpoints
- **[README.md](./README.md)** - Documentación completa de la API

## ❌ Problemas Comunes

### Error: "Faltan variables de entorno"
- Verifica que el archivo `.env` exista en `backend/.env`
- Asegúrate de que todas las variables estén configuradas
- Reinicia el servidor después de editar `.env`

### Error: "Firebase initialization failed"
- Verifica que `FIREBASE_PRIVATE_KEY` tenga comillas dobles
- Asegúrate de que los `\n` estén presentes en la clave
- Verifica que el `project_id` sea correcto

### Error: "Cannot connect to localhost:3000"
- Verifica que el servidor esté corriendo
- Revisa que el puerto 3000 no esté ocupado
- Intenta cambiar el puerto en `.env`

### El servidor inicia pero los endpoints no funcionan
- Verifica en Firebase Console que Authentication esté habilitado
- Asegúrate de que Firestore Database esté creado
- Revisa que las reglas de seguridad estén publicadas

## 🆘 Necesitas Ayuda?

1. Revisa la documentación completa en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. Consulta la sección de troubleshooting en cada guía
3. Verifica los logs del servidor para más detalles del error
