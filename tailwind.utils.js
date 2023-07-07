const plugin = require("tailwindcss/plugin");

const animationTimeline = plugin(({ matchUtilities }) => {
  matchUtilities({
    "animation-timeline": (value) => ({
      "animation-timeline": `--${value}`,
    }),
  });
});

const boxReflect = plugin(({ matchUtilities, theme }) => {
  matchUtilities(
    {
      "box-reflect": (value) => ({
        "--tw-box-reflect-length": value,
        "-webkit-box-reflect": "below var(--tw-box-reflect-length) linear-gradient(var(--tw-gradient-stops))",
      }),
    },
    { values: theme("spacing") }
  );
});

const perspective = plugin(({ matchUtilities }) => {
  matchUtilities({
    perspective: (value) => ({
      perspective: value,
    }),
  });
});

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

const viewTimeline = plugin(({ addUtilities, matchUtilities }) => {
  addUtilities({
    ".view-timeline-block": {
      "view-timeline-axis": "block",
    },
    ".view-timeline-inline": {
      "view-timeline-axis": "inline",
    },
  });
  matchUtilities({
    "view-timeline-name": (value) => ({
      "view-timeline-name": `--${value}`,
    }),
  });
});

module.exports = {
  animationTimeline,
  boxReflect,
  perspective,
  shapeRendering,
  viewTimeline,
};
