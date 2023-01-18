/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      notosans: ["Noto Sans", "Noto Sans KR", "sans-serif"],
      scoredream: ["S-Core Dream", "sans-serif"],
    },
    extend: { colors: { lime: "#cddc39", lightgray: "#eaeef3", green: "#97c05c", red: "#ff7867" } },
  },
  plugins: [],
};
