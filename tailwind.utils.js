const plugin = require("tailwindcss/plugin");

const shapeRendering = plugin(({ addUtilities }) => {
  addUtilities({
    ".shape-auto": {
      "shape-rendering": "auto",
    },
    ".shape-optimize-speed": {
      "shape-rendering": "optimizeSpeed",
    },
    ".shape-crisp-edges": {
      "shape-rendering": "crispEdges",
    },
    ".shape-geometric-precision": {
      "shape-rendering": "geometricPrecision",
    },
  });
});

module.exports = {
  shapeRendering,
};
