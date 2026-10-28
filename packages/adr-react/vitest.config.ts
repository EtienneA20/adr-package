import { baseTestConfig } from "@etiennea20/config/vitest";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  baseTestConfig,
  defineConfig({ test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"] } }),
);
