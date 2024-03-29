/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    // colors: {
    //   'blue': '#1fb6ff',
    //   'pink': '#ff49db',
    //   'orange': '#ff7849',
    //   'green': '#13ce66',
    //   'gray-dark': '#273444',
    //   'gray': '#8492a6',
    //   'gray-light': '#d3dce6',
    // },
    extend: {
      fontFamily: {
        'sans': ['Mnxy', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        generics: "var(--generics-color)",
      },
      backgroundColor: {
        generics: "var(--generics-backgroundColor)",
      },
      keyframes: {
        distinct: {
          '0%': { filter: 'blur(10px)', opacity: 0 },
          '100%': { filter: 'blur(0px)', opacity: 1 },
        },
        enter: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      }
    }

  },
  plugins: [],
};
