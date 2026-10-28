import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "fetch/index": "src/fetch/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "axios", "@tanstack/react-query", "react-router"],
  banner: { js: '"use client";' },
});
