/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        // 'sans': ['"Georgia"', 'sans-serif'],
        mono: ["ui-monospace", "SFMono-Regular"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};