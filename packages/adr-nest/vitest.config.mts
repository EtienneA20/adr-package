import { baseTestConfig } from "@etiennea20/config/vitest";
import swc from "unplugin-swc";
import { defineConfig, mergeConfig } from "vitest/config";

// esbuild (transformeur par défaut de Vitest) n'émet pas les métadonnées de décorateurs :
// SWC les émet (`decoratorMetadata`), ce qui fait fonctionner l'injection de dépendances.
export default mergeConfig(
  baseTestConfig,
  defineConfig({
    plugins: [swc.vite({ module: { type: "es6" } })],
    test: { environment: "node", setupFiles: ["./vitest.setup.ts"] },
  }),
);
