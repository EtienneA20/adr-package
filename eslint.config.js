import { defineAdrConfig } from "@etiennea20/config/eslint";

// Fichiers de la racine (scripts, configurations) ; chaque package a sa propre configuration.
export default [
  { ignores: ["packages/**", "apps/**"] },
  ...defineAdrConfig({ tsconfigRootDir: import.meta.dirname, preset: "node" }),
];
