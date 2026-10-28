/** Seuil de couverture minimal (en %) appliqué à tous les packages. */
export declare const COVERAGE_THRESHOLD: number;

/** Options Vitest communes à tous les packages, à fusionner avec `mergeConfig`. */
export declare const baseTestConfig: {
  test: {
    include: string[];
    restoreMocks: boolean;
    unstubGlobals: boolean;
    unstubEnvs: boolean;
    coverage: {
      provider: "v8";
      include: string[];
      exclude: string[];
      reporter: string[];
      thresholds: { lines: number; functions: number; branches: number; statements: number };
    };
  };
};
