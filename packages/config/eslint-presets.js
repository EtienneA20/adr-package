// @ts-check
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

/**
 * Préréglages ajoutés par `defineAdrConfig` selon le type de projet (voir eslint.js).
 */

/** @typedef {import("eslint").Linter.Config} Config */
/** @typedef {"library" | "react" | "nest" | "docs" | "node"} Preset */

/** @type {Config[]} */
const reactConfigs = [
  {
    files: ["**/*.{ts,tsx}"],
    ...react.configs.flat.recommended,
    settings: { react: { version: "detect" } },
    languageOptions: {
      ...react.configs.flat.recommended?.languageOptions,
      globals: globals.browser,
    },
  },
  { files: ["**/*.{ts,tsx}"], ...react.configs.flat["jsx-runtime"] },
  { files: ["**/*.{ts,tsx}"], ...reactHooks.configs.flat.recommended },
  { files: ["**/*.{ts,tsx}"], ...jsxA11y.flatConfigs.strict },
];

/** @type {Config[]} */
const nestConfigs = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: { emitDecoratorMetadata: true, experimentalDecorators: true },
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-extraneous-class": ["error", { allowWithDecorator: true }],
      // L'injection de dépendances de Nest passe par les constructeurs.
      "max-params": ["error", 6],
    },
  },
];

/** @type {Config[]} */
const docsConfigs = [
  {
    files: ["src/pages/**", "src/theme/**", "docusaurus.config.ts", "sidebars.ts"],
    rules: { "import-x/no-default-export": "off" },
  },
];

/** @type {Record<Preset, Config[]>} */
export const presetConfigs = {
  library: [],
  node: [{ languageOptions: { globals: globals.node } }],
  react: reactConfigs,
  nest: nestConfigs,
  docs: [...reactConfigs, ...docsConfigs],
};
