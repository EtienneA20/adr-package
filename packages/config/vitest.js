// @ts-check

/**
 * Seuil de couverture minimal (en %) appliqué à tous les packages, en local comme en CI.
 */
export const COVERAGE_THRESHOLD = 90;

/**
 * Options Vitest communes à tous les packages, à fusionner avec `mergeConfig`.
 * Chaque test repart d'un état propre : mocks, globales et variables d'environnement
 * sont restaurés automatiquement.
 */
export const baseTestConfig = {
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    coverage: {
      provider: /** @type {const} */ ("v8"),
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/**/index.ts"],
      reporter: ["text", "json-summary"],
      thresholds: {
        lines: COVERAGE_THRESHOLD,
        functions: COVERAGE_THRESHOLD,
        branches: COVERAGE_THRESHOLD,
        statements: COVERAGE_THRESHOLD,
      },
    },
  },
};
