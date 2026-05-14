/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#FEE101", // Caution Tape Yellow
        "background-light": "#f8f8f5",
        "background-dark": "#020202", // Near Black
        "surface": "#050505", // Deep Dark Surface
        "text-main": "#F2F2F2", // Chalk White
        "accent-red": "#FF3333", // Spray Paint Red
        "steel": "#A3A3A3", // Medium Gray for better contrast on black
      },
      fontFamily: {
        "display": ["Barlow", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "mono": ["Space Mono", "monospace"],
      },
      borderRadius: {
        "DEFAULT": "0px", // Brutalist
        "sm": "2px",
        "md": "4px",
        "lg": "8px",
      },
      backgroundImage: {
        'noise': "url(\"https://grainy-gradients.vercel.app/noise.svg\")", // Use a static lightweight SVG instead of generating feTurbulence on the fly
        'hazard-stripe': "repeating-linear-gradient(45deg, #000, #000 10px, #FEE101 10px, #FEE101 20px)",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out both',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9) translateY(5px)' },
          'to': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translate3d(-50%, 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
}

