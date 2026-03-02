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
        "background-dark": "#111111", // Asphalt Black
        "surface": "#1E1E1E", // Wet Concrete
        "text-main": "#F2F2F2", // Chalk White
        "accent-red": "#FF3333", // Spray Paint Red
      },
      fontFamily: {
        "display": ["Saira Stencil One", "sans-serif"],
        "body": ["Space Grotesk", "sans-serif"],
        "mono": ["Space Mono", "monospace"],
      },
      borderRadius: {
        "DEFAULT": "0px", // Brutalist
        "sm": "2px",
        "md": "4px",
        "lg": "8px",
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
        'hazard-stripe': "repeating-linear-gradient(45deg, #000, #000 10px, #FEE101 10px, #FEE101 20px)",
      }
    },
  },
  plugins: [],
}

