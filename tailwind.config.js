/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{njk,html,js}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jost", "sans-serif"],
      },
      colors: {
        brand: {
          bg: "var(--color-brand-bg)",
          text: "var(--color-brand-text)",
          accent: "var(--color-brand-accent)",
          heading: "var(--color-brand-heading)",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
