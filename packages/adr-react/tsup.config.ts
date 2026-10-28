import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "fetch/index": "src/fetch/index.ts",
    "routing/index": "src/routing/index.ts",
  },
  format: ["esm", "cjs"],
  target: "es2022",
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "axios", "@tanstack/react-query", "react-router"],
  banner: { js: '"use client";' },
});
