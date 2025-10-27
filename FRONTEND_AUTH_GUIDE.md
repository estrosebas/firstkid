# Guía de Autenticación Frontend

## 🔐 Sistema de Autenticación Implementado

### Características

✅ **Login** - Inicio de sesión con email y contraseña
✅ **Register** - Registro de nuevos usuarios
✅ **Rutas Protegidas** - Solo accesibles con sesión iniciada
✅ **Logout** - Cerrar sesión desde el header
✅ **Redirección Automática** - A login si no está autenticado
✅ **Layout Condicional** - Sidebar solo en rutas autenticadas

## 📁 Estructura

```
src/
├── components/
│   ├── ProtectedRoute.tsx    # HOC para proteger rutas
│   └── Header.tsx             # Header con botón de logout
├── pages/
│   ├── Login.tsx              # Página de inicio de sesión
│   └── Register.tsx           # Página de registro
├── services/
│   └── auth.service.ts        # Servicio de autenticación
└── App.tsx                    # Configuración de rutas
```

## 🛣️ Rutas

### Públicas (Sin Sidebar)
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/` - Redirige a `/login`

### Protegidas (Con Sidebar)
- `/home` - Página principal
- `/technique/:slug` - Páginas de técnicas

## 🔒 ProtectedRoute Component

Protege rutas que requieren autenticación:

```typescript
<ProtectedRoute>
  <MainLayout>
    <Home />
  </MainLayout>
</ProtectedRoute>
```

**Funcionamiento:**
1. Verifica si el usuario está autenticado
2. Si SÍ → Renderiza el componente hijo
3. Si NO → Redirige a `/login`

## 📝 Flujo de Usuario

### Registro
```
Usuario → /register
  ↓
Completa formulario
  ↓
authService.register()
  ↓
Backend crea usuario
  ↓
Token guardado en localStorage
  ↓
Redirect a /home
```

### Login
```
Usuario → /login
  ↓
Ingresa credenciales
  ↓
authService.login()
  ↓
Backend valida credenciales
  ↓
Token guardado en localStorage
  ↓
Redirect a /home
```

### Logout
```
Usuario → Click en botón logout (Header)
  ↓
authService.logout()
  ↓
Token eliminado de localStorage
  ↓
Redirect a /login
```

### Acceso a Ruta Protegida
```
Usuario → /home (sin autenticación)
  ↓
ProtectedRoute verifica autenticación
  ↓
No autenticado
  ↓
Redirect a /login
```

## 🧪 Testing

### 1. Probar Registro
```
1. Ve a http://localhost:5173/register
2. Completa el formulario
3. Click en "Crear cuenta"
4. Verifica redirección a /home
5. Verifica que aparezca el Sidebar
```

### 2. Probar Login
```
1. Haz logout
2. Ve a http://localhost:5173/login
3. Ingresa credenciales
4. Click en "Iniciar"
5. Verifica redirección a /home
```

### 3. Probar Rutas Protegidas
```
1. Haz logout
2. Intenta acceder a http://localhost:5173/home
3. Verifica redirección automática a /login
```

### 4. Probar Logout
```
1. Inicia sesión
2. Click en el ícono de logout (esquina superior derecha)
3. Verifica redirección a /login
4. Verifica que no puedas acceder a /home sin login
```

## 💾 Almacenamiento

### localStorage
```typescript
// Token JWT
localStorage.getItem('authToken')

// Usuario actual
localStorage.getItem('currentUser')
```

### Limpieza al Logout
```typescript
authService.logout();
// Elimina: authToken y currentUser
```

## 🎨 UI/UX

### Login Page
- Logo centrado
- Formulario de email y contraseña
- Botón de "Iniciar"
- Link a "Regístrate"
- Sin Sidebar

### Register Page
- Logo centrado
- Formulario con nombre (opcional), email, contraseña
- Confirmación de contraseña
- Validaciones en frontend
- Link a "Inicia sesión"
- Sin Sidebar

### Header (Rutas Protegidas)
- Botón de menú (☰)
- Logo centrado
- Botón de logout (🚪)

## ⚠️ Validaciones

### Register
- ✅ Email válido
- ✅ Contraseña mínimo 6 caracteres
- ✅ Contraseñas coinciden
- ✅ Todos los campos requeridos

### Login
- ✅ Email válido
- ✅ Contraseña requerida

## 🔧 Personalización

### Cambiar Ruta de Redirección
```typescript
// En ProtectedRoute.tsx
return <Navigate to="/login" replace />;
// Cambiar a otra ruta si necesitas
```

### Agregar Nueva Ruta Protegida
```typescript
// En App.tsx
<Route
  path="/nueva-ruta"
  element={
    <ProtectedRoute>
      <MainLayout>
        <NuevoComponente />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

## 📚 Recursos

- **Auth Service:** `src/services/auth.service.ts`
- **API Service:** `src/services/api.service.ts`
- **Integration Guide:** `INTEGRATION_GUIDE.md`
