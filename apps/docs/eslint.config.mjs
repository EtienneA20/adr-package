import { defineAdrConfig } from "@etiennea20/config/eslint";

// Application privée : pas d'exigence de TSDoc ; les composants d'exemple vivent dans les .mdx.
export default defineAdrConfig({
  tsconfigRootDir: import.meta.dirname,
  preset: "docs",
  documentation: false,
});
