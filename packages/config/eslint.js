// @ts-check
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import checkFile from "eslint-plugin-check-file";
import { importX } from "eslint-plugin-import-x";
import jsdocPlugin from "eslint-plugin-jsdoc";
import tsdoc from "eslint-plugin-tsdoc";
import globals from "globals";
import { configs as tsConfigs } from "typescript-eslint";

import { importBoundaryConfigs } from "./eslint-imports.js";
import { presetConfigs } from "./eslint-presets.js";

/** @typedef {import("eslint").Linter.Config} Config */
/** @typedef {import("./eslint-presets.js").Preset} Preset */

const SOURCE_FILES = ["src/**/*.{ts,tsx}"];
const TEST_FILES = ["**/*.test.{ts,tsx}"];
const JS_FILES = ["**/*.{js,mjs,cjs}"];
const CONFIG_FILES = ["*.config.{ts,mts,js,mjs,cjs}", "eslint.config.{js,mjs}"];

/** @type {Config[]} */
const ignores = [
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/skills/**",
      "**/.docusaurus/**",
      "**/.turbo/**",
      "**/node_modules/**",
    ],
  },
];

/** @type {Config["rules"]} */
const namingRules = {
  "@typescript-eslint/naming-convention": [
    "error",
    { selector: "default", format: ["camelCase"], leadingUnderscore: "allow" },
    { selector: "import", format: null },
    { selector: "variable", format: ["camelCase", "UPPER_CASE", "PascalCase"] },
    { selector: "function", format: ["camelCase", "PascalCase"] },
    { selector: "parameter", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow" },
    { selector: "typeLike", format: ["PascalCase"] },
    { selector: "interface", format: ["PascalCase"], prefix: ["I"] },
    { selector: "enum", format: ["PascalCase"], prefix: ["E"] },
    { selector: "enumMember", format: ["UPPER_CASE"] },
    {
      selector: ["objectLiteralProperty", "objectLiteralMethod", "typeProperty", "typeMethod"],
      format: null,
    },
    { selector: "classProperty", modifiers: ["static", "readonly"], format: ["UPPER_CASE"] },
  ],
};

/** @type {Config["rules"]} */
const readabilityRules = {
  complexity: ["error", 10],
  "max-depth": ["error", 4],
  "max-params": ["error", 4],
  "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": ["error", { max: 60, skipBlankLines: true, skipComments: true }],
  "no-console": "error",
  eqeqeq: ["error", "always"],
  "no-nested-ternary": "error",
};

/**
 * Règles TypeScript : mode strict typé, plus quelques ajustements de lisibilité.
 *
 * @param {string} tsconfigRootDir - Dossier du `tsconfig.json` du projet linté.
 * @returns {Config[]} Les configurations TypeScript.
 */
function typescriptConfigs(tsconfigRootDir) {
  return [
    js.configs.recommended,
    ...tsConfigs.strictTypeChecked,
    ...tsConfigs.stylisticTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          projectService: { allowDefaultProject: ["*.config.ts", "*.config.mts"] },
          tsconfigRootDir,
        },
      },
      rules: {
        ...namingRules,
        ...readabilityRules,
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { prefer: "type-imports", fixStyle: "separate-type-imports" },
        ],
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      },
    },
  ];
}

/** @type {Config[]} */
const importConfigs = [
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver({ alwaysTryTypes: true })],
    },
    rules: {
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import-x/no-cycle": "error",
      "import-x/no-default-export": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-self-import": "error",
      "import-x/no-useless-path-segments": "error",
      // Bruit sur les modules CommonJS (ex. typescript) ; TypeScript vérifie déjà les membres.
      "import-x/no-named-as-default-member": "off",
    },
  },
];

/** @type {Config[]} */
const fileNamingConfigs = [
  {
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        { "**/*.{ts,tsx,js,mjs,cjs}": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": ["error", { "src/**/": "KEBAB_CASE" }],
    },
  },
];

/**
 * Exige un TSDoc complet sur tout ce qu'un fichier source exporte. Le contrôle exact de l'API
 * publique (`@since`, présence dans SKILLS.md) est fait par `pnpm check:skills`.
 *
 * @type {Config[]}
 */
const documentationConfigs = [
  {
    files: SOURCE_FILES,
    ignores: TEST_FILES,
    plugins: { jsdoc: jsdocPlugin, tsdoc },
    // En mode typescript, jsdoc impose `@template` ; TSDoc et `pnpm check:skills` exigent `@typeParam`.
    settings: { jsdoc: { mode: "typescript", tagNamePreference: { typeParam: "typeParam" } } },
    rules: {
      "tsdoc/syntax": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
          contexts: [
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "ExportNamedDeclaration > VariableDeclaration",
          ],
        },
      ],
      "jsdoc/require-description": ["error", { contexts: ["any"] }],
      "jsdoc/require-param": [
        "error",
        { checkDestructured: false, unnamedRootBase: ["props"], exemptedBy: ["inheritDoc"] },
      ],
      "jsdoc/require-param-description": "error",
      "jsdoc/check-param-names": ["error", { checkDestructured: false }],
      "jsdoc/require-hyphen-before-param-description": ["error", "always"],
      "jsdoc/require-returns": ["error", { exemptedBy: ["inheritDoc"] }],
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-throws": "error",
      "jsdoc/require-example": [
        "error",
        {
          exemptedBy: ["internal", "inheritDoc"],
          contexts: [
            "ExportNamedDeclaration > FunctionDeclaration",
            "ExportNamedDeclaration > ClassDeclaration",
            "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression",
            "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > CallExpression",
          ],
        },
      ],
      "jsdoc/no-types": "error",
      "jsdoc/check-tag-names": [
        "error",
        { definedTags: ["since", "typeParam", "remarks", "internal", "defaultValue"] },
      ],
    },
  },
];

/** @type {Config[]} */
const sourceConfigs = [
  {
    files: SOURCE_FILES,
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message:
            "Pas d'enum TypeScript : utiliser un objet `as const` préfixé par E (voir CLAUDE.md).",
        },
      ],
    },
  },
];

/** @type {Config[]} */
const testConfigs = [
  {
    files: TEST_FILES,
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/consistent-test-it": ["error", { fn: "it" }],
      "vitest/require-top-level-describe": "error",
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "error",
      "vitest/no-standalone-expect": "error",
      "vitest/valid-title": "error",
      "vitest/expect-expect": ["error", { assertFunctionNames: ["expect", "expectTypeOf"] }],
      "max-lines-per-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];

/** @type {Config[]} */
const toolingConfigs = [
  {
    files: JS_FILES,
    ...tsConfigs.disableTypeChecked,
    languageOptions: {
      ...tsConfigs.disableTypeChecked.languageOptions,
      globals: globals.node,
    },
    rules: {
      ...tsConfigs.disableTypeChecked.rules,
      // Faux positifs sur les modules CommonJS importés depuis l'ESM (ex. typescript).
      "import-x/default": "off",
      "import-x/no-named-as-default-member": "off",
    },
  },
  {
    files: CONFIG_FILES,
    rules: { "import-x/no-default-export": "off" },
  },
  {
    files: ["scripts/**", "bin/**"],
    languageOptions: { globals: globals.node },
    rules: { "no-console": "off" },
  },
];

/**
 * Construit la configuration ESLint d'un projet du monorepo. Prettier est toujours appliqué en
 * dernier pour neutraliser les règles de mise en forme.
 *
 * @param {object} options - Options du projet.
 * @param {string} options.tsconfigRootDir - Dossier racine du projet (`import.meta.dirname`).
 * @param {Preset} [options.preset] - Préréglage : library, react, nest, docs ou node.
 * @param {boolean} [options.documentation] - Exiger le TSDoc (désactivé pour les apps).
 * @param {import("./eslint-imports.js").OptionalPeer[]} [options.optionalPeers] -
 *   PeerDependencies optionnelles et la seule zone de `src` autorisée à les importer.
 * @returns {Config[]} La configuration ESLint complète (flat config).
 */
export function defineAdrConfig({
  tsconfigRootDir,
  preset = "library",
  documentation = true,
  optionalPeers = [],
}) {
  return [
    ...ignores,
    ...typescriptConfigs(tsconfigRootDir),
    ...importConfigs,
    ...fileNamingConfigs,
    ...(documentation ? documentationConfigs : []),
    ...sourceConfigs,
    ...importBoundaryConfigs(optionalPeers),
    ...presetConfigs[preset],
    ...testConfigs,
    ...toolingConfigs,
    prettier,
  ];
}
