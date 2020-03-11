import ts from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    format: "cjs",
    dir: "dist",
    exports: "named",
    hoistTransitiveImports: false
  },
  preserveModules: true,
  context: "this",
  plugins: [ts({ tsconfigOverride: { compilerOptions: { rootDir: "src" } } })],
  external: ["fs"]
};
