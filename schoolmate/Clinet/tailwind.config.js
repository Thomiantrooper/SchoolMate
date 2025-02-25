const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your project files
    "./node_modules/flowbite-react/**/*.js", // Include Flowbite components
    flowbite.content(

    ),
  ],
  plugins: [
    // ...
    flowbite.plugin(),
  ],
};