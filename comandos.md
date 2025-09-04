# Comandos Operativos - Cognitive PlayKit

## Instalación y Setup

````bash
npm run setup                # Instalación completa del monorepo
npm run setup:workspaces     # Solo dependencias de workspaces
npm run setup:api           # Configurar API (recordatorio MySQL)
´´´

Desarrollo
```bash
npm run dev                  # Ecosistema completo (5 apps)
npm run dev:core            # API + Landing + Dashboard
npm run dev:frontend        # Landing + Dashboard (sin API/juegos)
npm run dev:games           # Solo juegos Phaser
´´´

Apps Individuales
```bash
npm run dev:api             # API Symfony (puerto 8000)
npm run dev:landing         # Landing Astro (puerto 4321)
npm run dev:dashboard       # Dashboard Angular (puerto 4200)
npm run dev:letter          # Letter Detective (puerto 3001)
npm run dev:word            # Word Builder (puerto 3002)
´´´

Build y Deployment
```bash
npm run build              # Build frontend + juegos
npm run build:frontend     # Landing + Dashboard
npm run build:games        # Solo juegos Phaser
npm run deploy:build       # Build completo para deployment
´´´

Mantenimiento
```bash
npm run clean              # Limpiar deps + builds
npm run reinstall          # Limpieza completa + reinstalación
npm run health             # Verificar estado completo
npm run ports              # Ver todos los puertos
npm run status             # Estado API específicamente
´´´

Desarrollo
```bash
npm run test               # Tests en todos los workspaces
npm run lint               # Linting en todos los workspaces
npm run format             # Formateo en todos los workspaces
´´´

Puertos por Defecto
```bash
API: http://localhost:8000
Landing: http://localhost:4321
Dashboard: http://localhost:4200
Letter Detective: http://localhost:3001
Word Builder: http://localhost:3002
´´´
````
