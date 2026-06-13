/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1A365D",   // Azul oscuro
          light: "#5F71B4",     // Variante clara
          dark: "#0F1E3D",      // Variante profunda
        },
        turquoise: {
          DEFAULT: "#33CCCC",   // Verde azul
        },
        accent: {
          DEFAULT: "#EE7E59",   // Naranja intenso
          soft: "#FF9966",      // Naranja suave
          vivid: "#F9CE07",     // Amarillo vibrante
          magenta: "#D1418F",   // Complemento energético
        },
        neutral: {
          light: "#F5F5F5",
          dark: "#333333",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      spacing: {
        "2xs": "0.25rem",
        "xs": "0.5rem",
        "sm": "0.75rem",
        "md": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
    },
  },
  plugins: [],
}

