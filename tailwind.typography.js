const typographyStyles = require("@tailwindcss/typography/src/styles");
const defaultTheme = require("tailwindcss/defaultTheme");
const { gray, config: customColors } = require("./tailwind.colors");

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;

const maxWidth = defaultTheme.screens.md;

const typographyModifiers = {
  sm: {
    css: [
      {
        dl: {
          marginTop: em(16, 14),
          marginBottom: em(16, 14),
        },
        "dt, dd": {
          marginTop: em(4, 14),
          marginBottom: em(4, 14),
        },
        dd: {
          paddingLeft: em(28, 14),
        },
        "figure > picture > *": {
          marginTop: "0",
          marginBottom: "0",
        },
        "h5, h6": {
          marginTop: em(20, 14),
          marginBottom: em(8, 14),
          lineHeight: round(20 / 14),
        },
        kbd: {
          borderRadius: rem(4),
          fontSize: em(12, 14),
          paddingTop: em(4, 12),
          paddingRight: em(6, 12),
          paddingBottom: em(4, 12),
          paddingLeft: em(6, 12),
        },
        pre: {
          borderRadius: "0",
        },
        samp: {
          fontSize: em(12, 14),
        },
        ".admonition": {
          padding: em(20, 18),
        },
        ".katex-display": {
          fontSize: em(12, 14),
          lineHeight: round(20 / 12),
          marginTop: `${em(20, 12)} !important`,
          marginBottom: `${em(20, 12)} !important`,
          borderRadius: "0",
          paddingTop: em(8, 12),
          paddingRight: em(12, 12),
          paddingBottom: em(8, 12),
          paddingLeft: em(12, 12),
        },
      },
    ],
  },
  base: {
    css: [
      {
        dl: {
          marginTop: em(20, 16),
          marginBottom: em(20, 16),
        },
        "dt, dd": {
          marginTop: em(8, 16),
          marginBottom: em(8, 16),
        },
        dd: {
          paddingLeft: em(32, 16),
        },
        "figure > picture > *": {
          marginTop: "0",
          marginBottom: "0",
        },
        "h5, h6": {
          marginTop: em(24, 16),
          marginBottom: em(8, 16),
          lineHeight: round(24 / 16),
        },
        kbd: {
          borderRadius: rem(6),
          fontSize: em(14, 16),
          paddingTop: em(6, 14),
          paddingRight: em(8, 14),
          paddingBottom: em(6, 14),
          paddingLeft: em(8, 14),
        },
        pre: {
          borderRadius: "0",
        },
        samp: {
          fontSize: em(14, 16),
        },
        ".admonition": {
          padding: em(20, 20),
        },
        ".katex-display": {
          fontSize: em(14, 16),
          lineHeight: round(24 / 14),
          marginTop: `${em(24, 14)} !important`,
          marginBottom: `${em(24, 14)} !important`,
          borderRadius: "0",
          paddingTop: em(12, 14),
          paddingRight: em(16, 14),
          paddingBottom: em(12, 14),
          paddingLeft: em(16, 14),
        },
      },
    ],
  },
  lg: {
    css: [
      {
        dl: {
          marginTop: em(24, 18),
          marginBottom: em(24, 18),
        },
        "dt, dd": {
          marginTop: em(12, 18),
          marginBottom: em(12, 18),
        },
        dd: {
          paddingLeft: em(36, 18),
        },
        "figure > picture > *": {
          marginTop: "0",
          marginBottom: "0",
        },
        "h5, h6": {
          marginTop: em(32, 18),
          marginBottom: em(8, 18),
          lineHeight: round(28 / 18),
        },
        kbd: {
          borderRadius: rem(6),
          fontSize: em(16, 18),
          paddingTop: em(8, 16),
          paddingRight: em(12, 16),
          paddingBottom: em(8, 16),
          paddingLeft: em(12, 16),
        },
        pre: {
          borderRadius: "0",
        },
        samp: {
          fontSize: em(16, 18),
        },
        ".admonition": {
          padding: em(24, 24),
        },
        ".katex-display": {
          fontSize: em(16, 18),
          lineHeight: round(28 / 16),
          marginTop: `${em(32, 16)} !important`,
          marginBottom: `${em(32, 16)} !important`,
          borderRadius: "0",
          paddingTop: em(16, 16),
          paddingRight: em(24, 16),
          paddingBottom: em(16, 16),
          paddingLeft: em(24, 16),
        },
      },
    ],
  },
  xl: {
    css: [
      {
        dl: {
          marginTop: em(24, 20),
          marginBottom: em(24, 20),
        },
        "dt, dd": {
          marginTop: em(12, 20),
          marginBottom: em(12, 20),
        },
        dd: {
          paddingLeft: em(40, 20),
        },
        "figure > picture > *": {
          marginTop: "0",
          marginBottom: "0",
        },
        "h5, h6": {
          marginTop: em(36, 20),
          marginBottom: em(12, 20),
          lineHeight: round(32 / 20),
        },
        kbd: {
          borderRadius: rem(8),
          fontSize: em(18, 20),
          paddingTop: em(10, 18),
          paddingRight: em(12, 18),
          paddingBottom: em(10, 18),
          paddingLeft: em(12, 18),
        },
        pre: {
          borderRadius: "0",
        },
        samp: {
          fontSize: em(18, 20),
        },
        ".admonition": {
          padding: em(32, 30),
        },
        ".katex-display": {
          fontSize: em(18, 20),
          lineHeight: round(32 / 18),
          marginTop: `${em(36, 18)} !important`,
          marginBottom: `${em(36, 18)} !important`,
          borderRadius: "0",
          paddingTop: em(20, 18),
          paddingRight: em(24, 18),
          paddingBottom: em(20, 18),
          paddingLeft: em(24, 18),
        },
      },
    ],
  },
  "2xl": {
    css: [
      {
        dl: {
          marginTop: em(32, 24),
          marginBottom: em(32, 24),
        },
        "dt, dd": {
          marginTop: em(12, 24),
          marginBottom: em(12, 24),
        },
        dd: {
          paddingLeft: em(48, 24),
        },
        "figure > picture > *": {
          marginTop: "0",
          marginBottom: "0",
        },
        "h5, h6": {
          marginTop: em(40, 24),
          marginBottom: em(16, 24),
          lineHeight: round(36 / 24),
        },
        kbd: {
          borderRadius: rem(8),
          fontSize: em(20, 24),
          paddingTop: em(12, 20),
          paddingRight: em(16, 20),
          paddingBottom: em(12, 20),
          paddingLeft: em(16, 20),
        },
        pre: {
          borderRadius: "0",
        },
        samp: {
          fontSize: em(20, 24),
        },
        ".admonition": {
          padding: em(40, 36),
        },
        ".katex-display": {
          fontSize: em(20, 24),
          lineHeight: round(36 / 20),
          marginTop: `${em(40, 20)} !important`,
          marginBottom: `${em(40, 20)} !important`,
          borderRadius: "0",
          paddingTop: em(24, 20),
          paddingRight: em(32, 20),
          paddingBottom: em(24, 20),
          paddingLeft: em(32, 20),
        },
      },
    ],
  },
};

const typographyDefault = {
  css: [
    {
      maxWidth: "none",
      "> *": {
        maxWidth,
      },
    },
    {
      dt: {
        color: "var(--tw-prose-bold)",
        fontWeight: "600",
      },
      "h5, h6": {
        color: "var(--tw-prose-headings)",
        fontWeight: "600",
      },
      "h5 strong, h6 strong": {
        fontWeight: "700",
        color: "inherit",
      },
      hr: {
        borderStyle: "dotted",
        borderTopWidth: "0.25rem",
      },
      kbd: {
        borderColor: "var(--tw-prose-hr)",
        borderWidth: "1px",
        color: "var(--tw-prose-code)",
        fontWeight: "600",
      },
      mark: {
        backgroundColor: customColors.blue[100],
      },
      samp: {
        color: "var(--tw-prose-code)",
        fontWeight: "600",
      },
      "samp::before": {
        content: '"`"',
      },
      "samp::after": {
        content: '"`"',
      },
      ".admonition": {
        borderLeftWidth: "0.25rem",
      },
      ".katex-display": {
        color: "var(--tw-prose-pre-code)",
        backgroundColor: "var(--tw-prose-pre-bg)",
        overflowX: "auto",
      },
    },
    typographyStyles[gray].css,
    ...typographyModifiers.base.css,
  ],
};

module.exports = {
  maxWidth,
  config: {
    DEFAULT: typographyDefault,
    ...typographyModifiers,
  },
};
