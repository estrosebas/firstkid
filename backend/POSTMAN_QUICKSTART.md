# 🚀 Postman Quick Start

Importa y prueba la API en 3 pasos.

## Paso 1: Importar Archivos

### En Postman:

1. Click en **"Import"** (esquina superior izquierda)
2. Arrastra estos 2 archivos:
   - `Medical-AI-Backend.postman_collection.json`
   - `Medical-AI-Backend.postman_environment.json`
3. Click en **"Import"**

## Paso 2: Seleccionar Entorno

1. En la esquina superior derecha, abre el dropdown de entornos
2. Selecciona **"Medical AI Backend - Local"**

## Paso 3: Probar

### 1. Asegúrate de que el servidor esté corriendo:
```bash
cd backend
npm run dev
```

### 2. Ejecuta estos requests en orden:

1. **Health Check** ✅
   - Click en "Send"
   - Verifica que responda con `success: true`

2. **Register User** 👤
   - Click en "Send"
   - El token se guarda automáticamente

3. **Register Usage - RCP** 📊
   - Click en "Send"
   - Usa el token guardado automáticamente

4. **Save Score - RCP** 🎯
   - Click en "Send"
   - Guarda un score de 85

## ✅ ¡Listo!

Todos los endpoints están configurados y listos para usar.

### Próximos Pasos:

- Modifica los valores en el body de los requests
- Prueba los otros módulos (nose, burn-skins)
- Verifica los datos en Firebase Console
- Lee la [guía completa](./POSTMAN_GUIDE.md) para más detalles

## 🔄 Token Automático

Los requests de **Register** y **Login** guardan automáticamente el token en las variables de entorno. Los demás requests lo usan automáticamente.

## 📝 Variables Configurables

Edita estas variables en el entorno:

- `testEmail`: Email para pruebas (default: test@example.com)
- `testPassword`: Contraseña para pruebas (default: test123456)

## ❓ Problemas?

Ver [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) sección Troubleshooting.
