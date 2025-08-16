/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // Fuentes dyslexia-friendly (tu config es mejor aquí)
        'dyslexic': ['OpenDyslexic', 'Comic Sans MS', 'Trebuchet MS', 'Verdana', 'Arial', 'sans-serif'],
        'sans': ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
        // Añadimos las fuentes adicionales de mi config
        'lexend': ['Lexend', 'sans-serif'],
        'space': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        // Tu sistema de colores es más completo y mejor para accesibilidad
        'cognitive': {
          // Primarios - Alto contraste y calmantes
          'primary': '#2563EB',    // Azul claro y legible
          'secondary': '#059669',   // Verde suave
          'accent': '#EA580C',     // Naranja cálido
          
          // Grises con suficiente contraste
          'gray': {
            50: '#FAFAFA',
            100: '#F5F5F5', 
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
          
          // Colores de estado
          'success': '#16A34A',
          'warning': '#EA580C', 
          'error': '#DC2626',
          'info': '#0EA5E9',
          
          // Colores específicos para dislexia
          'dyslexia': {
            'cream': '#FEF7ED',      // Fondo suave
            'blue': '#3B82F6',       // Azul principal
            'green': '#10B981',      // Verde éxito
            'orange': '#F59E0B',     // Naranja atención
            'purple': '#8B5CF6',     // Morado creatividad
            'pink': '#EC4899',       // Rosa motivación
          }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'cognitive': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'cognitive-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'cognitive-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
        'glow-orange': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        // Combinamos todas las animaciones
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'gradient-x': 'gradientX 15s ease infinite',
        'gradient-y': 'gradientY 15s ease infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg) scale(1)' 
          },
          '33%': { 
            transform: 'translateY(-20px) rotate(1deg) scale(1.02)' 
          },
          '66%': { 
            transform: 'translateY(-10px) rotate(-1deg) scale(1.01)' 
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5)'
          },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientY: {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounceIn: {
          '0%': { 
            transform: 'scale(0.3)',
            opacity: '0',
          },
          '50%': { 
            transform: 'scale(1.05)',
          },
          '70%': { 
            transform: 'scale(0.9)',
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      // Añadimos utilidades para mejorar la legibilidad
      fontSize: {
        'dyslexia-sm': ['14px', { lineHeight: '1.8', letterSpacing: '0.05em' }],
        'dyslexia-base': ['16px', { lineHeight: '1.8', letterSpacing: '0.05em' }],
        'dyslexia-lg': ['18px', { lineHeight: '1.8', letterSpacing: '0.05em' }],
        'dyslexia-xl': ['20px', { lineHeight: '1.8', letterSpacing: '0.05em' }],
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
  daisyui: {
    themes: [
      {
        // Tema principal optimizado para accesibilidad
        cognitive: {
          "primary": "#2563EB",
          "primary-focus": "#1D4ED8", 
          "primary-content": "#FFFFFF",
          
          "secondary": "#059669",
          "secondary-focus": "#047857",
          "secondary-content": "#FFFFFF",
          
          "accent": "#EA580C",
          "accent-focus": "#DC2626",
          "accent-content": "#FFFFFF",
          
          "neutral": "#404040",
          "neutral-focus": "#262626",
          "neutral-content": "#FFFFFF",
          
          "base-100": "#FFFFFF",
          "base-200": "#FAFAFA",
          "base-300": "#F5F5F5",
          "base-content": "#171717",
          
          "info": "#0EA5E9",
          "info-content": "#FFFFFF",
          
          "success": "#16A34A", 
          "success-content": "#FFFFFF",
          
          "warning": "#F59E0B",
          "warning-content": "#FFFFFF",
          
          "error": "#DC2626",
          "error-content": "#FFFFFF",

          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-text-case": "none",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px",
          "--tab-border": "2px",
          "--tab-radius": "0.5rem",
        },
        // Tema específico para dislexia con fondo crema
        dyslexia: {
          "primary": "#3B82F6",     // Azul más suave
          "primary-focus": "#2563EB",
          "primary-content": "#FFFFFF",
          
          "secondary": "#10B981",    // Verde calmante
          "secondary-focus": "#059669",
          "secondary-content": "#FFFFFF",
          
          "accent": "#F59E0B",       // Naranja para destacar
          "accent-focus": "#EA580C",
          "accent-content": "#FFFFFF",
          
          "neutral": "#525252",
          "neutral-focus": "#404040",
          "neutral-content": "#FFFFFF",
          
          "base-100": "#FEF7ED",     // Fondo crema suave
          "base-200": "#FEF3E2",
          "base-300": "#FDEDC8",
          "base-content": "#262626",  // Texto oscuro pero no negro puro
          
          "info": "#0EA5E9",
          "info-content": "#FFFFFF",
          
          "success": "#16A34A",
          "success-content": "#FFFFFF",
          
          "warning": "#F59E0B",
          "warning-content": "#FFFFFF",
          
          "error": "#EF4444",        // Rojo menos intenso
          "error-content": "#FFFFFF",

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "0.375rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.3s",
          "--btn-text-case": "none",
          "--btn-focus-scale": "0.95",
          "--border-btn": "3px",
          "--tab-border": "3px",
          "--tab-radius": "0.375rem",
        },
        // Tema de alto contraste
        highContrast: {
          "primary": "#0000FF",
          "primary-focus": "#0000CC",
          "primary-content": "#FFFFFF",
          
          "secondary": "#008000",
          "secondary-focus": "#006600",
          "secondary-content": "#FFFFFF",
          
          "accent": "#FF6600",
          "accent-focus": "#CC5200",
          "accent-content": "#FFFFFF",
          
          "neutral": "#000000",
          "neutral-focus": "#333333",
          "neutral-content": "#FFFFFF",
          
          "base-100": "#FFFFFF",
          "base-200": "#F0F0F0",
          "base-300": "#E0E0E0",
          "base-content": "#000000",
          
          "info": "#0066CC",
          "info-content": "#FFFFFF",
          
          "success": "#008000",
          "success-content": "#FFFFFF",
          
          "warning": "#FF9900",
          "warning-content": "#000000",
          
          "error": "#CC0000",
          "error-content": "#FFFFFF",

          "--rounded-box": "0",
          "--rounded-btn": "0",
          "--rounded-badge": "0",
          "--animation-btn": "0",
          "--animation-input": "0",
          "--btn-text-case": "uppercase",
          "--btn-focus-scale": "1",
          "--border-btn": "4px",
          "--tab-border": "4px",
          "--tab-radius": "0",
        }
      },
      // Temas adicionales de DaisyUI
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
  // Configuración para mejorar la accesibilidad
  future: {
    hoverOnlyWhenSupported: true,
  },
}