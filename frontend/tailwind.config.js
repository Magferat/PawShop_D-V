/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navbarskin: "#E0A75D",
        lightskin: "#EDDDB2",
        addtocartgreen: "#6EDB6A",
        verylightgreen: "#CCE7B0"
      },
    },
  },
  plugins: [],
};
