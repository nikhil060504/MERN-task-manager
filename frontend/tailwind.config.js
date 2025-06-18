/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
        },
      },
      animation: {
        loader: "loader 1s linear infinite",
      },
      keyframes: {
        loader: {
          "0%": { transform: "rotate(0) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.5)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
