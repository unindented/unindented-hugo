const colors = require("tailwindcss/colors");

const accent = "purple";
const gray = "zinc";

module.exports = {
  accent,
  gray,
  config: {
    transparent: "transparent",
    current: "currentColor",
    black: colors.black,
    white: colors.white,
    gray: colors[gray],
    blue: colors[accent],
    cyan: colors.cyan,
    indigo: colors.indigo,
    lime: colors.lime,
    pink: colors.pink,
    red: colors.red,
    violet: colors.violet,
    yellow: colors.yellow,
  },
};
