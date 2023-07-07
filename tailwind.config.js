const forms = require("@tailwindcss/forms");
const typography = require("@tailwindcss/typography");

const { config: customColors } = require("./tailwind.colors");
const { maxWidth, config: customTypography } = require("./tailwind.typography");
const { animationTimeline, boxReflect, perspective, shapeRendering, viewTimeline } = require("./tailwind.utils");

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
  plugins: [
    forms({ strategy: "class" }),
    typography,
    animationTimeline,
    boxReflect,
    perspective,
    shapeRendering,
    viewTimeline,
  ],
  darkMode: "class",
  theme: {
    colors: customColors,
    extend: {
      animation: {
        "coverflow-rotate": "linear coverflow-rotate both",
        "coverflow-z-index": "linear coverflow-z-index both",
      },
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
      willChange: {
        "z-index": "z-index",
      },
      typography: customTypography,
    },
    keyframes: {
      "coverflow-rotate": {
        "0%": {
          transform: "translateX(-100%) rotateY(-45deg)",
        },
        "35%": {
          transform: "translateX(0) rotateY(-45deg)",
        },
        "50%": {
          transform: "rotateY(0deg) translateZ(1em) scale(1.5)",
        },
        "65%": {
          transform: "translateX(0) rotateY(45deg)",
        },
        "100%": {
          transform: "translateX(100%) rotateY(45deg)",
        },
      },
      "coverflow-z-index": {
        "0%, 100%": {
          zIndex: 10,
        },
        "50%": {
          zIndex: 50,
        },
      },
    },
    supports: {
      "animation-timeline": "animation-timeline: view()",
    },
  },
};
