import { defineConfig } from "tsup";

// Aucune API spécifique à un environnement : la même sortie sert au navigateur et à Node.
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  platform: "neutral",
  target: "es2022",
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["dayjs"],
});
