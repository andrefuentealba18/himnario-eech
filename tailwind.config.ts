import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Lato', 'sans-serif'],
        headline: ['Playfair Display', 'serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'aura-giant': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.3' },
          '33%': { transform: 'scale(1.3) rotate(120deg)', opacity: '0.6' },
          '66%': { transform: 'scale(0.8) rotate(240deg)', opacity: '0.4' },
        },
        'letter-reveal': {
          '0%': { transform: 'translateY(60px) scale(0.5)', opacity: '0', filter: 'blur(20px)' },
          '60%': { transform: 'translateY(-10px) scale(1.1)', opacity: '1', filter: 'blur(0)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1', filter: 'blur(0)' },
        },
        'rainbow-slide': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'loading-beam': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        'loading-beam-long': {
          '0%': { transform: 'translateX(-200%)', opacity: '0' },
          '30%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateX(300%)', opacity: '0' },
        },
        'title-reveal-big': {
          '0%': { transform: 'translateY(40px) scale(0.9)', opacity: '0', filter: 'blur(20px)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1', filter: 'blur(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'shine-sweep': {
          '0%': { transform: 'translateX(-150%) skewX(-25deg)' },
          '100%': { transform: 'translateX(150%) skewX(-25deg)' },
        },
        'office-dot': {
          '0%': { left: '-10%', opacity: '0' },
          '5%': { opacity: '1' },
          '50%': { left: '50%' },
          '95%': { opacity: '1' },
          '100%': { left: '110%', opacity: '0' },
        },
        'aura-slow': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.3' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'pulse-slow': 'pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aura-giant': 'aura-giant 25s ease-in-out infinite',
        'letter-reveal': 'letter-reveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'rainbow-slide': 'rainbow-slide 4s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 15s linear infinite',
        'loading-beam': 'loading-beam 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'loading-beam-long': 'loading-beam-long 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'title-reveal-big': 'title-reveal-big 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'pulse-ring': 'pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'shine-sweep': 'shine-sweep 3s ease-in-out infinite',
        'office-dot-1': 'office-dot 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'office-dot-2': 'office-dot 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.15s',
        'office-dot-3': 'office-dot 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.3s',
        'office-dot-4': 'office-dot 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.45s',
        'office-dot-5': 'office-dot 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s',
        'aura-slow': 'aura-slow 15s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
