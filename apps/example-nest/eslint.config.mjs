import { defineAdrConfig } from "@etiennea20/config/eslint";

// Application d'exemple : pas d'API publique, donc pas de TSDoc exigé.
export default defineAdrConfig({
  tsconfigRootDir: import.meta.dirname,
  preset: "nest",
  documentation: false,
});
