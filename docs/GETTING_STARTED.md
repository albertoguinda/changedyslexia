# 🚀 Guía de Configuración - Cognitive PlayKit

## 📋 Prerrequisitos

### Software Requerido

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Angular CLI** >= 18.0.0
- **Git**

### Verificación Rápida

```bash
node --version    # >= 18.0.0
npm --version     # >= 9.0.0
ng version        # >= 18.0.0
Instalación Angular CLI
bashnpm install -g @angular/cli
🏗️ Setup del Proyecto
1. Clonar y Navegar
bashgit clone [repositorio]
cd cognitive-playkit
2. Configurar Landing Page
bashcd apps/landing
npm install
npm run dev
Verificar: http://localhost:4321
3. Configurar Dashboard
bashcd apps/dashboard
npm install
ng serve
Verificar: http://localhost:4200
🎨 Configuración de Estilos
TailwindCSS + DaisyUI
javascript// tailwind.config.js (ya configurado)
module.exports = {
  content: ['./src/**/*.{html,ts,astro}'],
  plugins: [require('daisyui')]
}
Fuente OpenDyslexic
css/* Fuente específica para dislexia */
.font-dyslexic {
  font-family: 'OpenDyslexic', 'Inter', sans-serif;
}
🧪 Scripts Útiles
Desarrollo
bash# Landing page
cd apps/landing && npm run dev

# Dashboard
cd apps/dashboard && ng serve
Build de Producción
bash# Landing
npm run build

# Dashboard
ng build --configuration=production
🔧 Troubleshooting
Puerto ocupado
bash# Landing en puerto alternativo
npm run dev -- --port 4322

# Dashboard en puerto alternativo
ng serve --port 4201
Dependencias
bash# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
✅ Checklist de Verificación

 Landing carga en http://localhost:4321
 Dashboard carga en http://localhost:4200
 Estilos TailwindCSS funcionan
 Componentes DaisyUI funcionan
 Build de producción exitoso

👨‍💻 Desarrollado por
Alberto Guinda
📧 Email: albertoguindasevilla@gmail.com
🌐 Portfolio: https://albertoguindaportfolio.vercel.app
💼 GitHub: https://github.com/albertoguinda
🔗 LinkedIn: https://linkedin.com/in/albertoguindasevilla
```
