import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "contrib/auto-render.mjs",
    output: {
      file: "katex.min.mjs",
      format: "esm",
    },
    plugins: [nodeResolve(), terser()],
  },
];
