import path from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

/**
 * Garde-fou de configuration : le build (tsc + tsconfig.build.json) doit émettre les
 * métadonnées de type des décorateurs, sans lesquelles l'injection de dépendances de NestJS
 * échoue chez le consommateur. Vitest est lancé depuis le dossier du package.
 */
function readBuildOptions(): ts.CompilerOptions {
  const configPath = path.resolve(process.cwd(), "tsconfig.build.json");
  const config: unknown = ts.readConfigFile(configPath, (file) => ts.sys.readFile(file)).config;
  return ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configPath)).options;
}

describe("configuration de build", () => {
  it("émet les métadonnées design:paramtypes des constructeurs décorés", () => {
    const source = [
      "function Injectable(): ClassDecorator { return () => undefined; }",
      "class Dependency {}",
      "@Injectable()",
      "export class Service { constructor(readonly dependency: Dependency) {} }",
    ].join("\n");

    const { outputText } = ts.transpileModule(source, { compilerOptions: readBuildOptions() });

    expect(outputText).toContain('"design:paramtypes"');
  });

  it("produit du CommonJS", () => {
    const { outputText } = ts.transpileModule("export const value = 1;", {
      compilerOptions: readBuildOptions(),
    });

    expect(outputText).toContain("exports.value");
  });
});
