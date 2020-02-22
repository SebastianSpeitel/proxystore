import ts from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    format: "cjs",
    file: "dist/index.js"
  },
  context: "globalThis",
  plugins: [ts()]
};
