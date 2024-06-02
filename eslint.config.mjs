import globals from "globals";
import js from "@eslint/js";

export default [
  {
    ignores: ["public/**", "resources/**", "static/js/*/*", "**/lit-html/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        p5: "readonly",
      },
    },
  },
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
];
