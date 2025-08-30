/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bruh-black": "#111",
        "bruh-white": "#e8e8e8",
        "bruh-gray": "#577780",
      },
      backgroundImage: {
        "hero-bg": "url('/bg.jpg')",
      },
      backgroundSize: {
        100: "100%",
        400: "400%",
      },
      fontFamily: {
        space: "Space, sans-serif",
        space_light: "Space-Light, sans-serif",
        space_semibold: "Space-Semibold, sans-serif",
        bitcount: "Bitcount, sans-serif",
      },
      keyframes: {
        scale: {
          "0%, 100%": { transform: "scale(100%))" },
          "50%": { transform: "scale(110%)" },
        },
      },
      animation: {
        scale: "scale 0.8s ease-in-out",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
