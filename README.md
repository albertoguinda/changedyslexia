# Cognitive PlayKit - Demo Change Dyslexia

**Plataforma Educativa Full-Stack para Evaluación y Entrenamiento de Dislexia**

Demostración técnica integral que muestra arquitectura de desarrollo web moderna, diseñada específicamente para el dominio educativo de la dislexia.

## Demo en Vivo

- **Dashboard**: http://localhost:4200
- **API**: http://localhost:8000/api/metrics/dashboard
- **Juegos**: Letter Detective (3001) | Word Builder (3002)
- **Landing**: http://localhost:4321

## Arquitectura del Sistema

┌─────────────────┬──────────────────┬─────────────────┐
│ Frontend │ Backend │ Juegos │
├─────────────────┼──────────────────┼─────────────────┤
│ Angular 20 │ Symfony PHP │ Phaser.js │
│ Dashboard │ API REST │ TypeScript │
│ Tailwind CSS │ Base datos MySQL │ Vite │
├─────────────────┼──────────────────┼─────────────────┤
│ Astro │ Doctrine ORM │ Canvas API │
│ Landing Page │ CORS habilitado │ Métricas juego │
│ SSR Ready │ Respuestas JSON │ Datos tiempo real│
└─────────────────┴──────────────────┴─────────────────┘

## Características Principales

### Backend (Symfony)

- **API REST** con endpoints completos de métricas
- **Base de datos MySQL** con 88+ sesiones reales de evaluación de dislexia
- **Métricas especializadas** para habilidades cognitivas específicas de dislexia
- **Configuración CORS** para peticiones multi-origen
- **Doctrine ORM** para gestión de datos

### Frontend (Angular)

- **Dashboard en tiempo real** con visualización de datos en vivo
- **Diseño responsive** con Tailwind CSS
- **Gráficos interactivos** usando PrimeNG/Chart.js
- **TypeScript** para seguridad de tipos
- **Arquitectura modular** con lazy loading

### Juegos (Phaser.js)

- **Letter Detective**: Entrenamiento de discriminación visual
- **Word Builder**: Ejercicios de construcción silábica
- **Recolección automática de métricas** enviadas a la API
- **Diseño responsive** para múltiples dispositivos

### Landing (Astro)

- **Generación de sitio estático** para rendimiento óptimo
- **CSS moderno** con arquitectura de componentes
- **Estructura optimizada para SEO**

## Métricas Técnicas

| Componente | Tecnología    | Líneas de Código | Características                         |
| ---------- | ------------- | ---------------- | --------------------------------------- |
| API        | Symfony + PHP | ~2000            | Endpoints REST, ORM, métricas           |
| Dashboard  | Angular + TS  | ~3500            | Gráficos, datos tiempo real, responsive |
| Juegos     | Phaser + TS   | ~1500            | 2 juegos educativos, métricas           |
| Landing    | Astro         | ~800             | SSR, CSS moderno, rendimiento           |

## Inicio Rápido

```bash
# Clonar e instalar
git clone https://github.com/albertoguinda/changedyslexia.git
cd changedyslexia
npm run setup

# Iniciar todos los servicios (5 apps simultáneamente)
npm run dev
Requisitos: Node.js 18+, PHP 8.2+, MySQL
Comandos de Desarrollo
bashnpm run dev          # Iniciar las 5 aplicaciones
npm run dev:core     # Solo API + Dashboard + Landing
npm run build        # Construir todas las aplicaciones frontend
npm run test         # Ejecutar suites de pruebas
npm run clean        # Limpiar dependencias y builds
Datos y Métricas
La plataforma procesa datos reales de evaluación de dislexia incluyendo:

Discriminación Visual: puntuaciones y tendencias
Conciencia Fonológica: seguimiento del desarrollo
Velocidad de Procesamiento: mediciones
Capacidad de Atención: análisis
Patrones de uso por dispositivo (Escritorio/Móvil/Tablet)

Dataset Actual: 88 sesiones auténticas de evaluación con análisis de progresión temporal.
Características Específicas para Dislexia

Seguimiento de habilidades cognitivas alineado con investigación en dislexia
Visualización de progreso para intervenciones educativas
Consideraciones de accesibilidad (fuentes OpenDyslexic, alto contraste)
Métricas basadas en evidencia para evaluación del aprendizaje

Stack Tecnológico
Backend

Symfony 6.x (Framework PHP)
Doctrine ORM (Abstracción base de datos)
MySQL 8.0 (Base de datos relacional)

Frontend

Angular 20 (Framework SPA)
TypeScript (Seguridad de tipos)
Tailwind CSS (CSS utility-first)
PrimeNG (Componentes UI)

Juegos

Phaser.js 3.x (Motor de juegos)
Canvas API (Gráficos 2D)
Vite (Herramienta de construcción)

Infraestructura

npm Workspaces (Gestión monorepo)
Concurrently (Orquestación de procesos)
Git (Control de versiones)

Estructura del Proyecto
cognitive-playkit/
├── apps/
│   ├── api/                    # API REST Symfony
│   ├── dashboard/              # Dashboard admin Angular
│   ├── landing/                # Sitio marketing Astro
│   └── games/
│       ├── letter-detective/   # Juego Phaser.js
│       └── word-builder/       # Juego Phaser.js
├── packages/                   # Utilidades compartidas
├── tools/                      # Herramientas de desarrollo
├── package.json               # Configuración monorepo
└── README.md                  # Documentación
Construido para Change Dyslexia
Este proyecto demuestra capacidades técnicas relevantes para la misión de Change Dyslexia:

Experiencia en tecnología educativa
Enfoque de desarrollo accessibility-first
Análisis de aprendizaje basado en datos
Intervenciones de dislexia respaldadas por investigación
Arquitectura escalable para plataformas educativas

Desarrollador
Alberto Guinda - Desarrollador Full-Stack
Especializado en tecnología educativa y aplicaciones web enfocadas en accesibilidad.

Portfolio: albertoguindaportfolio.vercel.app
LinkedIn: linkedin.com/in/albertoguindasevilla
GitHub: github.com/albertoguinda
Email: albertoguindasevilla@gmail.com


Este proyecto demuestra prácticas modernas de desarrollo web en el contexto de tecnología educativa e investigación en dislexia.
```
