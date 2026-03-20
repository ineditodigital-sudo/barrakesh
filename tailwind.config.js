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
      }
    },
  },
  plugins: [],
}

