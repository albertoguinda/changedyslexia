# Estado Funcional Actual - Change Dyslexia Demo

_Actualizado: 3 Septiembre 2025_

## Funcionando Correctamente

### Backend Completo

- **API Symfony**: 100% operativa, endpoints `/api/metrics/dashboard` y `/api/metrics/skills`
- **Base de datos**: 88+ sesiones reales con métricas específicas de dislexia
- **Integración**: Flujo completo Juegos → API → MySQL → Dashboard

### Frontend Operativo

- **Dashboard Angular**: Conectado con datos reales, sin errores 404
- **Landing Astro**: Responsive completo, navegación funcional
- **Juegos Phaser**: Ambos envían datos automáticamente a API

### Infraestructura

- **Monorepo**: `npm run dev` levanta ecosistema completo
- **Routing**: Configurado correctamente entre todas las apps
- **CORS**: Resuelto, comunicación frontend-backend funcional

## Apps por Puerto

| App               | Puerto | Estado | Funcionalidad                   |
| ----------------- | ------ | ------ | ------------------------------- |
| API Symfony       | 8000   | 100%   | Endpoints operativos            |
| Dashboard Angular | 4200   | 75%    | Datos reales, UI básica         |
| Landing Astro     | 4321   | 95%    | Responsive completo             |
| Letter Detective  | 3001   | 90%    | Funcional, responsive pendiente |
| Word Builder      | 3002   | 90%    | Funcional, responsive pendiente |

## Problemas Resueltos

- Errores 404 en llamadas API
- Mapeo incorrecto datos `basic` → `stats`
- Desconexión backend-frontend
- Configuración rutas Symfony
- Dependencias faltantes MetricsService

## Necesita Mejora

### Dashboard Angular

- Calidad visual básica vs referencia profesional
- TailAdmin copiado en `apps/dashboard/` sin integrar

### Juegos Responsive

- Word Builder: sílabas no visibles en móvil
- Letter Detective: elementos fuera del viewport

### Landing

- Tailwind 4 deshabilitado por conflictos

## Comandos Operativos

```bash
npm run dev          # Ecosistema completo
npm run dev:dashboard # Solo dashboard
npm run health       # Verificar APIs
Métricas Actuales

Sesiones totales: 88
Precisión promedio: 77.83%
Distribución dispositivos: Desktop 32, Mobile 25, Tablet 31
Juegos activos: Word Builder (46 sesiones), Letter Detective (42 sesiones)
```
