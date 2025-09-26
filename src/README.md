# Sistema de Informes LOGISAMB

Sistema web de informes para la gestión integral de residuos industriales, peligrosos y domiciliarios.

## 🚀 Características

- **Autenticación segura** - Sistema de login con asociación a empresas
- **Dashboard ejecutivo** - Métricas clave y estadísticas en tiempo real
- **Gestión de guías** - Seguimiento completo de guías de retiro de residuos
- **Control de facturas** - Gestión de facturas impagas con alertas de mora
- **Filtros avanzados** - Filtrado por fechas, sucursales, servicios y más
- **Exportación de datos** - Exportar a Excel, CSV y PDF
- **Test de conexiones** - Verificación de conectividad con base de datos
- **Interfaz responsive** - Optimizada para desktop y móvil

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **Fechas**: date-fns
- **Base de datos**: MariaDB (backend requerido)

## 📊 Estructura de Base de Datos



## 🔐 Autenticación

El sistema incluye usuarios de prueba:
- **demo@demo** / **demo**
- **admin@copec** / **admin123**
- **usuario@shell** / **user123**

## 📱 Funcionalidades

### Dashboard
- Métricas clave: guías registradas, total facturado, facturas impagas
- Alertas para facturas en estado crítico
- Indicadores visuales por estado de mora

### Guías de Retiro
- Listado completo con filtros por fecha, sucursal, servicio
- Alertas cuando los litros retirados exceden el límite
- Exportación a múltiples formatos

### Facturas Impagas
- Control de mora con códigos de color
- Estados: Baja (1-30 días), Media (31-60), Alta (61-90), Crítica (+90)
- Alertas prominentes para facturas críticas

### Test de Conexiones
- Verificación de conectividad con MariaDB
- Prueba de endpoints del backend
- Configuración de parámetros de conexión

## 🎨 Diseño

El sistema replica fielmente el diseño de referencia de LOGISAMB con:
- Colores corporativos (verde y azul)
- Tipografía clara y profesional
- Iconografía consistente
- Interfaz responsive

## 🔍 API Endpoints Esperados

```typescript


## 📄 Licencia

Proyecto desarrollado para LOGISAMB - Manejo Integral de Residuos Industriales, Peligrosos y Domiciliarios.

---

Para soporte técnico o consultas sobre implementación, contacta al equipo de desarrollo.