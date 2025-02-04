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
        "90vh": "90vh",
        "85vh": "85vh",
        "80vh": "80vh",
        "75vh": "75vh",
        "50vh": "50vh",
      },
      fontDisplay: "swap",
    },
  },
  plugins: [],
};
