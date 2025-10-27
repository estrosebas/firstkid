# 📚 Índice de Documentación - Medical AI Backend

Guía completa de toda la documentación disponible.

## 🚀 Para Empezar

### 1. [QUICK_START.md](./QUICK_START.md)
**Tiempo estimado: 5 minutos**

Configuración rápida para poner el backend en marcha.

**Incluye:**
- ✅ Checklist de configuración
- ⚙️ Instalación de dependencias
- 🔥 Configuración básica de Firebase
- 🌍 Variables de entorno
- 🧪 Prueba rápida

**Ideal para:** Primera vez configurando el proyecto

---

### 2. [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
**Tiempo estimado: 15-20 minutos**

Guía detallada paso a paso para configurar Firebase desde cero.

**Incluye:**
- 📝 Crear proyecto en Firebase Console
- 🔐 Configurar Authentication (Email/Password)
- 💾 Crear Firestore Database con colecciones
- 🔒 Configurar reglas de seguridad
- 🔑 Obtener credenciales (Service Account)
- ⚙️ Configurar archivo `.env` local
- ✅ Probar la conexión

**Ideal para:** Configuración completa y detallada de Firebase

---

### 3. [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)
**Tiempo estimado: 5 minutos**

Guía para usar la colección de Postman (recomendado).

**Incluye:**
- 📦 Colección completa lista para importar
- ⚙️ Variables de entorno configuradas
- 🔄 Token se guarda automáticamente
- ✅ Tests automáticos incluidos
- 📊 Ejecutar toda la colección

**Archivos incluidos:**
- `Medical-AI-Backend.postman_collection.json`
- `Medical-AI-Backend.postman_environment.json`

**Ideal para:** Pruebas rápidas y profesionales con Postman

---

### 4. [TESTING_GUIDE.md](./TESTING_GUIDE.md)
**Tiempo estimado: 10 minutos**

Guía completa para probar con Thunder Client (VS Code).

**Incluye:**
- 🔌 Instalación de Thunder Client
- 📋 Ejemplos de todos los endpoints
- 🔄 Flujo de prueba completo
- ❌ Solución de problemas comunes
- 🔍 Verificación en Firebase Console

**Ideal para:** Probar desde VS Code sin salir del editor

---

## 📖 Documentación Técnica

### 5. [README.md](./README.md)
Documentación principal del backend.

**Incluye:**
- 📁 Estructura del proyecto
- 📦 Requisitos previos
- 🛠️ Scripts disponibles
- 🌐 Endpoints de la API con ejemplos
- ⚠️ Manejo de errores
- 🚀 Instrucciones de producción

**Ideal para:** Referencia rápida de la API

---

### 6. [ARCHITECTURE.md](./ARCHITECTURE.md)
Arquitectura y diseño del sistema.

**Incluye:**
- 🏗️ Stack tecnológico
- 📊 Diagramas de arquitectura
- 🔄 Flujo de autenticación
- 📂 Estructura de directorios
- 💾 Modelos de datos
- 🔒 Seguridad
- 📈 Performance y escalabilidad
- 🚀 Deployment
- 🔮 Próximas mejoras

**Ideal para:** Entender cómo funciona el sistema

---

## 🗺️ Rutas de Aprendizaje

### Para Desarrolladores Nuevos
1. [QUICK_START.md](./QUICK_START.md) - Configuración inicial
2. [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Setup de Firebase
3. [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - Importar colección de Postman
4. [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Probar endpoints
5. [README.md](./README.md) - Referencia de API
6. [ARCHITECTURE.md](./ARCHITECTURE.md) - Entender la arquitectura

### Para Configuración Rápida
1. [QUICK_START.md](./QUICK_START.md)
2. [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - Importar y probar

### Para Troubleshooting
1. [QUICK_START.md](./QUICK_START.md) - Problemas comunes
2. [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Solución de problemas
3. [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Troubleshooting de endpoints

### Para Integración con Frontend
1. [README.md](./README.md) - Endpoints disponibles
2. [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - Ejemplos de requests en Postman
3. [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Ejemplos de requests en Thunder Client
4. [ARCHITECTURE.md](./ARCHITECTURE.md) - Flujo de autenticación

---

## 📝 Archivos de Configuración

### `.env`
Variables de entorno (NO en git)
```env
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### `.env.example`
Plantilla de variables de entorno (SÍ en git)

### `package.json`
Dependencias y scripts del proyecto

### `tsconfig.json`
Configuración de TypeScript

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo (con hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Producción
npm start
```

---

## 🌐 Endpoints Principales

### Públicos
- `GET /health` - Health check
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login

### Protegidos (requieren token)
- `POST /api/auth/verify-token` - Verificar token
- `POST /api/usage` - Registrar uso
- `POST /api/score` - Guardar score

Ver detalles completos en [README.md](./README.md)

---

## 🆘 Ayuda Rápida

### El servidor no inicia
1. Verifica que `.env` exista y tenga todas las variables
2. Revisa [QUICK_START.md](./QUICK_START.md#-problemas-comunes)
3. Consulta [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#solución-de-problemas)

### Los endpoints no funcionan
1. Verifica que el servidor esté corriendo
2. Revisa [TESTING_GUIDE.md](./TESTING_GUIDE.md#troubleshooting)
3. Comprueba Firebase Console

### Error de autenticación
1. Verifica que el token sea válido
2. Revisa [TESTING_GUIDE.md](./TESTING_GUIDE.md#error-token-inválido)
3. Genera un nuevo token con login

### Error de Firebase
1. Verifica credenciales en `.env`
2. Revisa [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#paso-42-extraer-información-del-json)
3. Comprueba Firebase Console

---

## 📚 Recursos Externos

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Thunder Client](https://www.thunderclient.com/)

---

## 🎯 Checklist de Configuración Completa

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto creado en Firebase Console
- [ ] Authentication habilitado
- [ ] Firestore Database creado
- [ ] Colecciones creadas (users, usage, scores)
- [ ] Reglas de seguridad configuradas
- [ ] Service Account Key descargado
- [ ] Archivo `.env` configurado
- [ ] Servidor inicia correctamente
- [ ] Health check funciona
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Endpoints protegidos funcionan
- [ ] Datos visibles en Firebase Console

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección de troubleshooting en cada guía
2. Verifica los logs del servidor
3. Consulta Firebase Console para errores
4. Revisa que todas las configuraciones estén correctas

---

**¡Listo para empezar!** 🚀

Comienza con [QUICK_START.md](./QUICK_START.md) y en 5 minutos tendrás el backend funcionando.
