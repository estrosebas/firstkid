# Sistema de Tokens - Medical AI Backend

## Descripción

El backend utiliza un sistema de tokens personalizado para la autenticación de usuarios.

## ¿Por qué no usar Firebase ID Tokens?

Firebase Admin SDK tiene dos tipos de tokens:

1. **Custom Tokens**: Generados por el servidor, pero deben ser intercambiados por ID Tokens en el cliente
2. **ID Tokens**: Generados por Firebase Authentication en el cliente después de autenticar

Como este es un backend-only (sin cliente Firebase), implementamos un sistema de tokens simple y seguro.

## Cómo Funciona

### 1. Generación de Tokens

Cuando un usuario hace login o register:
- Se genera un token aleatorio seguro de 64 caracteres hexadecimales
- El token se almacena en memoria con el `uid` y `email` del usuario
- El token expira después de 1 hora

```typescript
const token = crypto.randomBytes(32).toString('hex');
// Ejemplo: "72f5182deed24351151b792593fa37d22b4b0e7dee42ef294ec5c420292abc28"
```

### 2. Verificación de Tokens

Cuando un endpoint protegido recibe un request:
- Extrae el token del header `Authorization: Bearer {token}`
- Busca el token en el almacén en memoria
- Verifica que no haya expirado
- Retorna los datos del usuario (`uid`, `email`)

### 3. Expiración

- Los tokens expiran después de **1 hora**
- Los tokens expirados se eliminan automáticamente
- El usuario debe hacer login nuevamente para obtener un nuevo token

## Uso

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "uid": "abc123...",
    "email": "usuario@example.com",
    "token": "72f5182deed24351151b792593fa37d22b4b0e7dee42ef294ec5c420292abc28"
  }
}
```

### Usar Token en Endpoints Protegidos
```bash
POST /api/usage
Authorization: Bearer 72f5182deed24351151b792593fa37d22b4b0e7dee42ef294ec5c420292abc28
Content-Type: application/json

{
  "module": "rcp"
}
```

### Verificar Token
```bash
POST /api/auth/verify-token
Authorization: Bearer 72f5182deed24351151b792593fa37d22b4b0e7dee42ef294ec5c420292abc28

Response:
{
  "success": true,
  "data": {
    "uid": "abc123...",
    "email": "usuario@example.com",
    "valid": true
  }
}
```

## Limitaciones

### Tokens en Memoria

Los tokens se almacenan en memoria (RAM), lo que significa:

**Ventajas:**
- ✅ Muy rápido
- ✅ Simple de implementar
- ✅ No requiere base de datos adicional

**Desventajas:**
- ❌ Los tokens se pierden al reiniciar el servidor
- ❌ No funciona con múltiples instancias del servidor (sin load balancer con sticky sessions)
- ❌ No se pueden revocar tokens de forma persistente

### Soluciones para Producción

Para un entorno de producción, considera:

#### Opción 1: Redis
Almacenar tokens en Redis para persistencia y escalabilidad:
```typescript
import Redis from 'ioredis';
const redis = new Redis();

// Guardar token
await redis.setex(token, 3600, JSON.stringify({ uid, email }));

// Verificar token
const data = await redis.get(token);
```

#### Opción 2: JWT Tokens
Usar JSON Web Tokens firmados:
```typescript
import jwt from 'jsonwebtoken';

// Generar token
const token = jwt.sign({ uid, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### Opción 3: Firebase ID Tokens
Integrar con Firebase Client SDK en el frontend:
- El frontend autentica con Firebase
- Obtiene un ID Token
- Envía el ID Token al backend
- El backend verifica con `auth.verifyIdToken()`

## Seguridad

### Buenas Prácticas Implementadas

✅ **Tokens aleatorios criptográficamente seguros**
- Usa `crypto.randomBytes()` de Node.js

✅ **Expiración automática**
- Los tokens expiran después de 1 hora

✅ **Limpieza periódica**
- Los tokens expirados se eliminan automáticamente

✅ **Transmisión segura**
- Los tokens se envían en el header `Authorization`
- Nunca en la URL o query parameters

✅ **Validación en cada request**
- Todos los endpoints protegidos verifican el token

### Recomendaciones Adicionales

Para mayor seguridad en producción:

1. **HTTPS Obligatorio**
   - Siempre usa HTTPS en producción
   - Los tokens nunca deben enviarse por HTTP

2. **Rate Limiting**
   - Limita intentos de login
   - Previene ataques de fuerza bruta

3. **Refresh Tokens**
   - Implementa refresh tokens para sesiones largas
   - Los access tokens deben ser de corta duración

4. **Revocación de Tokens**
   - Implementa un sistema para revocar tokens
   - Útil cuando un usuario cierra sesión o cambia contraseña

5. **Logging y Monitoreo**
   - Registra intentos de autenticación fallidos
   - Monitorea patrones sospechosos

## Migración a JWT (Opcional)

Si decides migrar a JWT en el futuro:

### 1. Instalar dependencias
```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

### 2. Agregar variable de entorno
```env
JWT_SECRET=tu-secreto-super-seguro-aqui
```

### 3. Actualizar AuthService
```typescript
import jwt from 'jsonwebtoken';

private generateToken(uid: string, email: string): string {
  return jwt.sign(
    { uid, email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

private verifySimpleToken(token: string): { uid: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}
```

## Testing

### Probar el Sistema de Tokens

1. **Login y obtener token**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

2. **Verificar token**
```bash
curl -X POST http://localhost:3000/api/auth/verify-token \
  -H "Authorization: Bearer {token}"
```

3. **Usar token en endpoint protegido**
```bash
curl -X POST http://localhost:3000/api/usage \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"module":"rcp"}'
```

4. **Esperar 1 hora y verificar expiración**
```bash
# Después de 1 hora, el token debería ser inválido
curl -X POST http://localhost:3000/api/auth/verify-token \
  -H "Authorization: Bearer {token}"
# Response: {"success":false,"error":{"code":"AUTHENTICATION_ERROR","message":"Token inválido o expirado"}}
```

## Troubleshooting

### Token inválido después de reiniciar el servidor

**Causa**: Los tokens se almacenan en memoria y se pierden al reiniciar.

**Solución**: Haz login nuevamente para obtener un nuevo token.

### Token inválido en diferentes instancias del servidor

**Causa**: Cada instancia tiene su propio almacén de tokens en memoria.

**Solución**: Usa Redis o JWT para compartir tokens entre instancias.

### Token expira muy rápido

**Causa**: La expiración está configurada a 1 hora.

**Solución**: Modifica el tiempo de expiración en `auth.service.ts`:
```typescript
const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hora
// Cambiar a:
const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
```

## Conclusión

El sistema actual es:
- ✅ Simple y fácil de entender
- ✅ Seguro para desarrollo y pruebas
- ✅ Suficiente para aplicaciones pequeñas
- ⚠️ Requiere mejoras para producción a gran escala

Para producción, considera migrar a JWT o Redis según tus necesidades de escalabilidad.
