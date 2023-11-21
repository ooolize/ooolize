/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        generics: "var(--generics-color)",
      },
      backgroundColor: {
        generics: "var(--generics-backgroundColor)",
      },
    },
  },
  plugins: [],
};
