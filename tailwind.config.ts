import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Colors (Base do Sistema)
        'bg-primary': '#0a0e1a',     // Background principal
        'bg-secondary': '#111827',   // Cards e containers
        'bg-tertiary': '#1f2937',    // Hover states
        
        // Blue Spectrum (Funcional)
        'blue': {
          50: '#eff6ff',        // Text hints
          100: '#dbeafe',       // Light accents
          300: '#93c5fd',       // Secondary text
          500: '#3b82f6',       // Primary actions
          600: '#2563eb',       // Primary hover
          700: '#1d4ed8',       // Active states
          900: '#1e3a8a',       // Deep accents
        },
        
        // Purple Spectrum (Premium/AI)
        'purple': {
          400: '#a78bfa',     // AI indicators
          500: '#8b5cf6',     // Premium features
          600: '#7c3aed',     // Premium hover
        },
        
        // Neutral Tech (Structure)
        'slate': {
          50: '#f8fafc',       // White text
          200: '#e2e8f0',      // Light gray text
          400: '#94a3b8',      // Medium gray text
          500: '#64748b',      // Dark gray text
          600: '#475569',      // Borders light
          700: '#334155',      // Borders medium
          800: '#1e293b',      // Borders dark
        },
        
        // Accent Colors (Apenas para Status Críticos)
        'green': {
          500: '#10b981',      // Success only
        },
        'amber': {
          500: '#f59e0b',      // Warning only
        },
        'red': {
          500: '#ef4444',      // Error only
        },
        
        // Legacy support
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
        'card-gradient': 'linear-gradient(135deg, #3b82f6/5 0%, #8b5cf6/5 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'grid-pattern': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 20px 40px rgba(0, 0, 0, 0.4)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 20px rgba(147, 51, 234, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
