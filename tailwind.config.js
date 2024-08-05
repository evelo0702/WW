/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dongle: ["Dongle", "sans-serif"],
      },
      height: {
        "95vh": "95vh",
      },
    },
  },
  plugins: [],
};
