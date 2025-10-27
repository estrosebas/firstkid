# Guía de Postman - Medical AI Backend

Esta guía te ayudará a importar y usar la colección de Postman para probar todos los endpoints del backend.

## 📦 Archivos Incluidos

- **Medical-AI-Backend.postman_collection.json** - Colección con todos los endpoints
- **Medical-AI-Backend.postman_environment.json** - Variables de entorno

## 🚀 Instalación

### 1. Descargar Postman

Si no tienes Postman instalado:
1. Ve a [postman.com/downloads](https://www.postman.com/downloads/)
2. Descarga e instala Postman para tu sistema operativo
3. Crea una cuenta gratuita o inicia sesión

### 2. Importar la Colección

1. Abre Postman
2. Haz clic en **"Import"** (esquina superior izquierda)
3. Arrastra el archivo `Medical-AI-Backend.postman_collection.json` o haz clic en "Upload Files"
4. Haz clic en **"Import"**
5. Verás la colección "Medical AI Backend" en la barra lateral

### 3. Importar el Entorno

1. Haz clic en **"Import"** nuevamente
2. Arrastra el archivo `Medical-AI-Backend.postman_environment.json`
3. Haz clic en **"Import"**
4. En la esquina superior derecha, selecciona **"Medical AI Backend - Local"** del dropdown de entornos

## ⚙️ Configuración

### Variables de Entorno

El entorno incluye estas variables (puedes editarlas):

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `baseUrl` | `http://localhost:3000` | URL del servidor backend |
| `authToken` | (vacío) | Token de autenticación (se llena automáticamente) |
| `userId` | (vacío) | ID del usuario (se llena automáticamente) |
| `userEmail` | (vacío) | Email del usuario (se llena automáticamente) |
| `testEmail` | `test@example.com` | Email para pruebas |
| `testPassword` | `test123456` | Contraseña para pruebas |

### Editar Variables

1. Haz clic en el ícono de ojo 👁️ en la esquina superior derecha
2. Haz clic en **"Edit"** junto a "Medical AI Backend - Local"
3. Modifica los valores según necesites
4. Haz clic en **"Save"**

## 🧪 Uso de la Colección

### Flujo Recomendado

#### 1. Verificar que el Servidor Esté Corriendo

Primero, asegúrate de que el backend esté corriendo:
```bash
cd backend
npm run dev
```

#### 2. Health Check

- Abre el request **"Health Check"**
- Haz clic en **"Send"**
- Deberías ver una respuesta exitosa

#### 3. Registrar Usuario

- Abre el request **"Register User"**
- Haz clic en **"Send"**
- El token se guardará automáticamente en `authToken`
- Verás el token en la consola de Postman

**Nota:** Si el usuario ya existe, usa el request "Login" en su lugar.

#### 4. Verificar Token

- Abre el request **"Verify Token"**
- Haz clic en **"Send"**
- Verifica que el token sea válido

#### 5. Registrar Uso de Módulo

Prueba cualquiera de estos:
- **"Register Usage - RCP"**
- **"Register Usage - Nose"**
- **"Register Usage - Burn Skins"**

Haz clic en **"Send"** y verifica la respuesta.

#### 6. Guardar Score

Prueba cualquiera de estos:
- **"Save Score - RCP"** (score: 85)
- **"Save Score - Nose"** (score: 92)
- **"Save Score - Burn Skins"** (score: 78)

Puedes modificar el score en el body del request.

## 📊 Tests Automáticos

Cada request incluye tests automáticos que verifican:
- ✅ Código de estado HTTP
- ✅ Estructura de la respuesta
- ✅ Campos requeridos
- ✅ Tipos de datos

Los resultados de los tests aparecen en la pestaña **"Test Results"** después de enviar un request.

## 🔄 Gestión de Tokens

### Token Automático

Los requests **"Register User"** y **"Login"** incluyen scripts que:
1. Extraen el token de la respuesta
2. Lo guardan en la variable `authToken`
3. Lo muestran en la consola

Los demás requests usan automáticamente este token en el header:
```
Authorization: Bearer {{authToken}}
```

### Token Manual

Si necesitas usar un token diferente:
1. Copia el token de la respuesta
2. Haz clic en el ícono de ojo 👁️
3. Pega el token en la variable `authToken`

### Token Expirado

Los tokens expiran después de 1 hora. Si recibes un error 401:
1. Ejecuta el request **"Login"** nuevamente
2. El nuevo token se guardará automáticamente

## 📝 Modificar Requests

### Cambiar el Email de Prueba

1. Edita las variables de entorno:
   - `testEmail`: Tu email
   - `testPassword`: Tu contraseña

2. O edita directamente el body del request:
```json
{
  "email": "tu-email@example.com",
  "password": "tu-password"
}
```

### Cambiar el Score

En los requests de score, modifica el valor:
```json
{
  "module": "rcp",
  "score": 95
}
```

**Validación:** El score debe estar entre 0 y 100.

### Cambiar el Módulo

Módulos válidos:
- `rcp`
- `nose`
- `burn-skins`

## 🔍 Ver Respuestas

Después de enviar un request, verás varias pestañas:

### Body
Muestra la respuesta JSON del servidor.

### Headers
Muestra los headers de la respuesta.

### Test Results
Muestra los resultados de los tests automáticos.

### Console
Muestra logs adicionales (como el token guardado).

## 🎯 Ejemplos de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "userId": "user123",
    "module": "rcp",
    "score": 85,
    "timestamp": "2025-10-27T01:00:00.000Z"
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El score debe estar entre 0 y 100"
  }
}
```

## 🐛 Troubleshooting

### Error: "Could not send request"

**Causa:** El servidor no está corriendo.

**Solución:**
```bash
cd backend
npm run dev
```

### Error: 401 Unauthorized

**Causa:** Token inválido o expirado.

**Solución:**
1. Ejecuta el request **"Login"**
2. El nuevo token se guardará automáticamente

### Error: 400 Bad Request

**Causa:** Datos de entrada inválidos.

**Solución:**
- Verifica el formato del body
- Asegúrate de que los valores sean correctos
- Revisa la descripción del request

### Error: 500 Internal Server Error

**Causa:** Error en el servidor.

**Solución:**
1. Revisa los logs del servidor
2. Verifica que Firebase esté configurado correctamente
3. Asegúrate de que el archivo `.env` tenga las credenciales correctas

### Variables no se Guardan

**Causa:** Entorno no seleccionado.

**Solución:**
1. Verifica que "Medical AI Backend - Local" esté seleccionado en el dropdown de entornos
2. Haz clic en el ícono de ojo 👁️ para verificar las variables

## 🔄 Ejecutar Toda la Colección

Puedes ejecutar todos los requests en secuencia:

1. Haz clic derecho en la colección "Medical AI Backend"
2. Selecciona **"Run collection"**
3. Configura el orden de ejecución
4. Haz clic en **"Run Medical AI Backend"**
5. Verás los resultados de todos los requests

**Nota:** Asegúrate de que el usuario de prueba no exista antes de ejecutar toda la colección, o comenta el request "Register User".

## 📊 Exportar Resultados

Para compartir resultados:

1. Ejecuta la colección
2. Haz clic en **"Export Results"**
3. Guarda el archivo JSON

## 🌐 Usar con Servidor Remoto

Si despliegas el backend en producción:

1. Crea un nuevo entorno:
   - Nombre: "Medical AI Backend - Production"
   - `baseUrl`: URL de tu servidor en producción

2. Cambia al nuevo entorno en el dropdown

3. Ejecuta los requests normalmente

## 📚 Recursos Adicionales

- [Postman Documentation](https://learning.postman.com/docs/getting-started/introduction/)
- [Postman Tests](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Postman Variables](https://learning.postman.com/docs/sending-requests/variables/)

## 🎓 Tips y Trucos

### 1. Usar la Consola de Postman

Abre la consola (View > Show Postman Console) para ver:
- Requests enviados
- Respuestas recibidas
- Logs de scripts
- Errores detallados

### 2. Guardar Requests Favoritos

Marca requests frecuentes como favoritos:
- Haz clic en la estrella ⭐ junto al nombre del request

### 3. Duplicar Requests

Para crear variaciones:
1. Haz clic derecho en un request
2. Selecciona **"Duplicate"**
3. Modifica el duplicado

### 4. Organizar con Carpetas

Puedes crear carpetas dentro de la colección:
1. Haz clic derecho en la colección
2. Selecciona **"Add Folder"**
3. Arrastra requests a las carpetas

### 5. Compartir la Colección

Para compartir con tu equipo:
1. Haz clic derecho en la colección
2. Selecciona **"Share"**
3. Genera un link o exporta el JSON

## ✅ Checklist de Uso

- [ ] Postman instalado
- [ ] Colección importada
- [ ] Entorno importado
- [ ] Entorno seleccionado en el dropdown
- [ ] Servidor backend corriendo
- [ ] Health check exitoso
- [ ] Usuario registrado o login exitoso
- [ ] Token guardado en variables
- [ ] Endpoints protegidos funcionando
- [ ] Datos verificados en Firebase Console

---

**¡Listo para probar!** 🚀

Comienza con el request **"Health Check"** y sigue el flujo recomendado.
