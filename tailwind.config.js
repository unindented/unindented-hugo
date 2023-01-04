const forms = require("@tailwindcss/forms");
const typography = require("@tailwindcss/typography");

const { config: customColors } = require("./tailwind.colors");
const { maxWidth, config: customTypography } = require("./tailwind.typography");

module.exports = {
  content: [
    "./content/**/*.html",
    "./content/**/*.md",
    "./content/**/*.js",
    "./content/**/*.mjs",
    "./layouts/**/*.html",
    "./static/js/*.js",
    "./static/js/*.mjs",
  ],
  plugins: [forms({ strategy: "class" }), typography],
  darkMode: "class",
  theme: {
    colors: customColors,
    extend: {
      backgroundImage: {
        "gradient-to-rm": `linear-gradient(to right, var(--tw-gradient-from) 0, var(--tw-gradient-to) 50vw, transparent 50vw)`,
      },
      brightness: {
        80: "0.8",
      },
      contrast: {
        120: "1.2",
      },
      maxWidth: {
        prose: maxWidth,
      },
      typography: customTypography,
    },
  },
};
