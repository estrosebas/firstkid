# Guía del Panel de Estadísticas

## 📊 Panel CRM Implementado

### Características

✅ **Estadísticas en Tiempo Real**
- Total de usuarios registrados
- Total de usos de módulos
- Módulos activos
- Scores registrados

✅ **Gráficos Interactivos**
- Gráfico de pastel: Usos por módulo
- Gráfico de barras: Score promedio por módulo

✅ **Actividad Reciente**
- Últimos 10 usos registrados
- Información de módulo, usuario y fecha

✅ **CORS Actualizado**
- Soporte para Capacitor Android/iOS
- URLs permitidas: capacitor://localhost, ionic://localhost

## 🛣️ Acceso

**URL:** `/panel`

**Protección:** Requiere autenticación (ruta protegida)

## 📁 Estructura

### Backend

```
backend/src/
├── services/
│   └── stats.service.ts       # Lógica de estadísticas
├── controllers/
│   └── stats.controller.ts    # Controlador de stats
└── routes/
    └── stats.routes.ts        # Ruta GET /api/stats
```

### Frontend

```
src/
├── pages/
│   └── Panel.tsx              # Página del panel CRM
└── services/
    └── stats.service.ts       # Servicio de stats
```

## 🔌 API Endpoint

### GET /api/stats

**Autenticación:** Requerida (Bearer token)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 10,
    "totalUsage": 45,
    "usageByModule": [
      { "module": "rcp", "count": 20 },
      { "module": "nose", "count": 15 },
      { "module": "burn-skins", "count": 10 }
    ],
    "averageScores": [
      { "module": "rcp", "average": 85, "count": 20 },
      { "module": "nose", "average": 78, "count": 15 },
      { "module": "burn-skins", "average": 92, "count": 10 }
    ],
    "recentActivity": [
      {
        "id": "abc123",
        "userId": "user123",
        "module": "rcp",
        "timestamp": "2025-10-27T10:30:00.000Z"
      }
    ]
  }
}
```

## 📊 Componentes del Panel

### 1. Tarjetas de Estadísticas

Muestra métricas clave:
- **Total Usuarios** - Usuarios registrados
- **Total Usos** - Veces que se han usado los módulos
- **Módulos Activos** - Cantidad de módulos diferentes usados
- **Scores Registrados** - Total de scores guardados

### 2. Gráfico de Pastel

Distribución de usos por módulo:
- RCP (rojo)
- Hemorragia Nasal (azul)
- Quemaduras (naranja)

### 3. Gráfico de Barras

Score promedio por módulo:
- Escala de 0 a 100
- Muestra el rendimiento promedio en cada módulo

### 4. Tabla de Actividad Reciente

Últimos 10 registros de uso:
- Módulo utilizado
- ID de usuario (primeros 8 caracteres)
- Fecha y hora

## 🎨 Diseño

### Colores

- **Rojo (#CC0033):** RCP, Total Usuarios
- **Azul (#0097B2):** Hemorragia Nasal, Total Usos
- **Naranja (#FF9F40):** Quemaduras, Módulos Activos
- **Verde Azulado (#4BC0C0):** Scores Registrados

### Layout

- **Responsive:** Se adapta a diferentes tamaños de pantalla
- **Grid:** Usa CSS Grid para organizar elementos
- **Cards:** Tarjetas con sombra y bordes redondeados

## 🔒 CORS para Capacitor

### URLs Permitidas

```typescript
const allowedOrigins = [
  'http://localhost:5173',      // Vite dev
  'capacitor://localhost',      // Capacitor iOS
  'ionic://localhost',          // Ionic iOS
  'http://localhost',           // Android local
  'http://localhost:8080',      // Android dev
  'http://localhost:8100',      // Ionic serve
];
```

### Configuración

El backend ahora acepta requests desde:
- ✅ Navegador web (desarrollo)
- ✅ Aplicación Capacitor Android
- ✅ Aplicación Capacitor iOS
- ✅ Requests sin origin (mobile apps)

## 🧪 Testing

### 1. Probar en Navegador

```bash
# Iniciar backend
cd backend
npm run dev

# Iniciar frontend
npm run dev

# Acceder al panel
http://localhost:5173/panel
```

### 2. Verificar Datos

1. Inicia sesión
2. Usa algunos módulos (RCP, Nose, Burn-Skins)
3. Ve al panel (`/panel`)
4. Verifica que aparezcan:
   - Estadísticas actualizadas
   - Gráficos con datos
   - Actividad reciente

### 3. Probar en Capacitor

```bash
# Build para Capacitor
npm run build

# Sync con Capacitor
npx cap sync

# Abrir en Android Studio
npx cap open android

# O en Xcode
npx cap open ios
```

## 📱 Capacitor Configuration

### capacitor.config.ts

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medicalai.app',
  appName: 'Medical AI',
  webDir: 'dist',
  server: {
    // Para desarrollo, apunta al backend local
    // url: 'http://10.0.2.2:3000', // Android emulator
    // url: 'http://localhost:3000', // iOS simulator
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
};

export default config;
```

### .env.local para Capacitor

```env
# Desarrollo web
VITE_API_URL=http://localhost:3000

# Producción
# VITE_API_URL=https://tu-backend.railway.app
```

## 🔧 Personalización

### Agregar Nueva Estadística

1. **Backend - stats.service.ts:**
```typescript
async getNewStat(): Promise<number> {
  // Tu lógica aquí
  return 42;
}
```

2. **Backend - stats.controller.ts:**
```typescript
const newStat = await this.statsService.getNewStat();
// Agregar a la respuesta
```

3. **Frontend - Panel.tsx:**
```typescript
<StatCard
  icon={<Icon size={32} />}
  title="Nueva Estadística"
  value={stats.newStat}
  color="#color"
/>
```

### Agregar Nuevo Gráfico

```typescript
import { Line } from 'react-chartjs-2';

// Registrar componentes necesarios
import { LineElement, PointElement } from 'chart.js';
ChartJS.register(LineElement, PointElement);

// Usar en el componente
<ChartCard title="Nuevo Gráfico">
  <Line data={chartData} />
</ChartCard>
```

## 📚 Librerías Utilizadas

- **Chart.js:** Librería de gráficos
- **react-chartjs-2:** Wrapper de React para Chart.js
- **lucide-react:** Iconos

## 🚀 Deployment

### Backend

Asegúrate de que las variables de entorno incluyan:
```env
FRONTEND_URL=https://tu-frontend.vercel.app
```

### Frontend

Build y deploy:
```bash
npm run build
# Deploy dist/ a tu hosting
```

### Capacitor

Build para producción:
```bash
# Actualizar API URL en .env
VITE_API_URL=https://tu-backend.railway.app

# Build
npm run build

# Sync
npx cap sync

# Build nativo
# Android: npx cap open android
# iOS: npx cap open ios
```

## ✅ Checklist

- [ ] Backend corriendo
- [ ] Frontend corriendo
- [ ] Autenticado en la app
- [ ] Datos de prueba creados (usuarios, usos, scores)
- [ ] Panel accesible en `/panel`
- [ ] Gráficos mostrando datos
- [ ] Actividad reciente visible
- [ ] CORS funcionando para Capacitor

---

¡El panel CRM está listo! 📊
