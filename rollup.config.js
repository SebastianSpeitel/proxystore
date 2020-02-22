import ts from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    format: "cjs",
    file: "dist/index.js"
  },
  plugins: [ts()]
};
