// @ts-check
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import checkFile from "eslint-plugin-check-file";
import { importX } from "eslint-plugin-import-x";
import jsdocPlugin from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsdoc from "eslint-plugin-tsdoc";
import globals from "globals";
import { configs as tsConfigs } from "typescript-eslint";

/** @typedef {import("eslint").Linter.Config} Config */
/** @typedef {"library" | "react" | "nest" | "docs" | "node"} Preset */

const SOURCE_FILES = ["src/**/*.{ts,tsx}"];
const TEST_FILES = ["**/*.test.{ts,tsx}"];
const JS_FILES = ["**/*.{js,mjs,cjs}"];
const CONFIG_FILES = ["*.config.{ts,js,mjs,cjs}", "eslint.config.js"];

/**
 * Un import relatif qui descend de plus d'un niveau dans un dossier (`./a/b`, `../../a/b`)
 * contourne l'`index.ts` d'un élément ou d'une catégorie : c'est un import profond.
 */
const DEEP_RELATIVE_IMPORT = String.raw`^\.{1,2}/(?:\.\./)*[^./][^/]*/.+`;

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
          projectService: { allowDefaultProject: ["*.config.ts"] },
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
    settings: { jsdoc: { mode: "typescript" } },
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
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: DEEP_RELATIVE_IMPORT,
              message:
                "Import profond interdit : importer via l'index.ts de l'élément ou de la catégorie.",
            },
          ],
        },
      ],
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
const presetConfigs = {
  library: [],
  node: [{ languageOptions: { globals: globals.node } }],
  react: reactConfigs,
  nest: nestConfigs,
  docs: [...reactConfigs, ...docsConfigs],
};

/**
 * Construit la configuration ESLint d'un projet du monorepo. Prettier est toujours appliqué en
 * dernier pour neutraliser les règles de mise en forme.
 *
 * @param {{ tsconfigRootDir: string; preset?: Preset; documentation?: boolean }} options -
 *   Dossier racine du projet, préréglage, et exigence de TSDoc (désactivée pour les apps).
 * @returns {Config[]} La configuration ESLint complète (flat config).
 */
export function defineAdrConfig({ tsconfigRootDir, preset = "library", documentation = true }) {
  return [
    ...ignores,
    ...typescriptConfigs(tsconfigRootDir),
    ...importConfigs,
    ...fileNamingConfigs,
    ...(documentation ? documentationConfigs : []),
    ...sourceConfigs,
    ...presetConfigs[preset],
    ...testConfigs,
    ...toolingConfigs,
    prettier,
  ];
}
