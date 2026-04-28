/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ember: {
          50: "#fff8ec",
          100: "#ffebc8",
          300: "#f8bd65",
          500: "#e68a2e",
          700: "#92531d"
        },
        ink: {
          900: "#10100f",
          800: "#191716",
          700: "#25211d"
        },
        mint: {
          300: "#91e5cf",
          500: "#38bfa0"
        }
      },
      boxShadow: {
        ember: "0 0 34px rgba(230, 138, 46, 0.32)",
        panel: "0 22px 70px rgba(0, 0, 0, 0.42)"
      }
    }
  },
  plugins: []
};
