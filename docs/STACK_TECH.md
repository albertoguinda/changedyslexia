# 🛠️ Stack Tecnológico - Cognitive PlayKit

## 🎯 Filosofía de Selección

Cada tecnología fue elegida estratégicamente para:

- ✅ **Cumplir requisitos** de Change Dyslexia
- ✅ **Optimizar accesibilidad** para dislexia
- ✅ **Garantizar escalabilidad** y mantenibilidad
- ✅ **Demostrar experiencia** técnica avanzada

## 🌐 Frontend Web

### **Astro** - Landing Page

```typescript
// Motivo de elección
- SSG ultra-rápido (Core Web Vitals perfectos)
- SEO optimizado out-of-the-box
- Islands architecture (hidratación selectiva)
- Compatible con cualquier framework UI
Ventajas específicas:

Performance: 100/100 Lighthouse scores
SEO: Ideal para conversión de visitantes
Flexibilidad: Componentes de cualquier framework
Bundle size: Mínimo JavaScript en cliente

Angular 18 - Dashboard
typescript// Motivo de elección
- Framework empresarial robusto
- TypeScript nativo (type safety)
- RxJS para manejo de estado complejo
- CLI potente para generación de código
Ventajas específicas:

Escalabilidad: Arquitectura modular
Testing: Herramientas integradas
Security: Guards, interceptors, sanitización
Performance: OnPush, lazy loading, tree shaking

TailwindCSS + DaisyUI
css/* Motivo de elección */
- Utility-first (desarrollo rápido)
- Purge automático (bundles pequeños)
- Accesibilidad built-in
- Consistencia de diseño
Ventajas específicas:

Accesibilidad: Focus states, color contrast
Responsive: Mobile-first approach
Customización: Design tokens consistentes
Performance: Solo CSS usado se incluye

📊 Visualización de Datos
RosenCharts (Adaptados)
typescript// Motivo de elección
- Diseño moderno y limpio
- Componentes customizables
- Optimizado para dashboards
- Código abierto y ligero
Implementación en Angular:
typescript@Component({
  selector: 'app-progress-chart',
  template: `
    <div class="chart-container">
      <svg #chartSvg></svg>
    </div>
  `
})
export class ProgressChartComponent {
  // Lógica adaptada de RosenCharts TSX
}
⚙️ Backend & API
Symfony 6.4 - API REST
php// Motivo de elección
- Framework maduro y estable
- Doctrine ORM potente
- Security component robusto
- API Platform para REST/GraphQL
Endpoints principales:
phpPOST /api/auth/login        // JWT authentication
GET  /api/users/profile     // User management
POST /api/games/session     // Game data collection
GET  /api/progress/stats    // Analytics & progress
PUT  /api/settings/access   // Accessibility config
MySQL 8.0 - Base de Datos
sql-- Motivo de elección
-- Relaciones complejas (usuarios, niños, sesiones)
-- ACID compliance (consistencia de datos)
-- Performance optimizada
-- Conocimiento amplio del equipo
Schema principal:
sqlusers (id, email, name, role, preferences)
children (id, user_id, name, age, diagnosis_date)
game_sessions (id, child_id, game_id, score, duration)
progress_data (id, child_id, skill, improvement, date)
🎮 Juegos Educativos
Phaser.js 3.70 - Juegos 2D
javascript// Motivo de elección
- Motor 2D especializado en educación
- WebGL + Canvas fallback
- Mobile-friendly
- Plugin ecosystem rico
Juegos implementados:
javascript// Letter Detective: Detección b/d, p/q
// Word Builder: Construcción silábica
// Integración directa con dashboard Angular
Unity 2023.2 - Prototipo 3D
csharp// Motivo de elección
- Motor 3D industry standard
- WebGL export para navegador
- C# familiar para backend devs
- Asset store rica
Juego desarrollado:
csharp// Spatial Navigator: Orientación espacial 3D
// Export: WebGL para integración web
// Platform: Windows, macOS, WebGL
📱 Mobile & PWA
Capacitor 5 - App Híbrida
typescript// Motivo de elección
- Native APIs desde web
- Single codebase
- Performance casi nativa
- Plugin ecosystem
Funcionalidades móviles:
typescript// Offline support con Service Workers
// Push notifications nativas
// Camera API para actividades
// Biometric authentication
♿ Accesibilidad para Dislexia
OpenDyslexic Font
css/* Motivo de elección */
- Diseñada específicamente para dislexia
- Mejora legibilidad 23% promedio
- Open source
- Web fonts disponibles
Animaciones GSAP
javascript// Motivo de elección
- Performance optimizada
- Control granular
- Accessible animations
- Industry standard
Implementación accesible:
javascript// Respeta prefers-reduced-motion
// Animaciones sutiles y funcionales
// Focus indicators claros
// Navigation landmarks
🔧 Herramientas de Desarrollo
TypeScript 5.2
typescript// Ventajas
- Type safety en compile time
- Better IDE support
- Refactoring seguro
- Documentación viva
Monorepo Structure
bash# Organización
apps/          # Aplicaciones independientes
shared/        # Código compartido
docs/          # Documentación centralizada
tools/         # Scripts y utilities
🔐 Seguridad & Privacidad
JWT + Refresh Tokens
typescript// Security
- Stateless authentication
- Short-lived access tokens
- Secure refresh mechanism
- Role-based authorization
GDPR Compliance
typescript// Privacy
- Data minimization
- Consent management
- Right to deletion
- Data portability
🎯 Cumplimiento de Requisitos
Change Dyslexia Stack

✅ Unity: Prototipo 3D funcional
✅ Phaser: Juegos 2D integrados
✅ Symfony: Backend robusto
✅ Angular: Frontend empresarial
✅ Capacitor: App móvil híbrida
✅ Tailwind: Framework CSS moderno

Valor Añadido

🎨 Accesibilidad: Optimizado para dislexia
📊 Analytics: Métricas educativas reales
🔧 Calidad: Testing automatizado
🚀 Performance: Optimización avanzada
📱 Mobile: Experiencia nativa

👨‍💻 Desarrollado por
Alberto Guinda
📧 Email: albertoguindasevilla@gmail.com
🌐 Portfolio: https://albertoguindaportfolio.vercel.app
💼 GitHub: https://github.com/albertoguinda
🔗 LinkedIn: https://linkedin.com/in/albertoguindasevilla
```
