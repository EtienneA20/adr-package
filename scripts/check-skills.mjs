// @ts-check
/**
 * `pnpm check:skills` : vérifie, pour chaque package publié, que chaque export public
 * (racine et sous-chemins du champ `exports`) :
 * - a un TSDoc complet (description, @param, @typeParam, @returns, @throws, @example, @since) ;
 * - a une entrée cohérente dans SKILLS.md (point d'entrée, version, statut, fichiers existants) ;
 * et qu'aucune entrée de SKILLS.md ne décrit un élément qui n'est plus exporté.
 *
 * Ne vérifie pas la synchronisation de `.claude/skills/` : c'est le rôle de
 * `pnpm run install:skills --check`.
 */
import { existsSync } from "node:fs";
import path from "node:path";

import ts from "typescript";

import { parseSkillsMd } from "./lib/skills-md.mjs";
import { listPublishedPackages, readText, ROOT_DIR } from "./lib/workspace.mjs";

/** @typedef {import("./lib/workspace.mjs").PublishedPackage} PublishedPackage */
/** @typedef {import("./lib/skills-md.mjs").SkillsEntry} SkillsEntry */
/** @typedef {{ name: string; specifier: string; symbol: ts.Symbol }} PublicExport */
/** @typedef {{ checker: ts.TypeChecker; symbol: ts.Symbol; tags: ts.JSDocTagInfo[] }} DocContext */

const REQUIRED_FIELDS = ["Catégorie", "Point d'entrée", "Statut", "Depuis", "Source", "Tests"];
const STATUSES = ["stable", "expérimental", "déprécié"];
const SEMVER = /^\d+\.\d+\.\d+$/;
const NO_RETURN = ts.TypeFlags.Void | ts.TypeFlags.Undefined | ts.TypeFlags.Never;

/**
 * Trouve le fichier source correspondant à une cible du champ `exports` (`./dist/x/index.js`).
 *
 * @param {string} dir - Dossier du package.
 * @param {unknown} target - Cible (chaîne ou objet de conditions).
 * @returns {string | undefined} Le chemin absolu du fichier source, s'il existe.
 */
function sourceOf(dir, target) {
  if (target && typeof target === "object") {
    return Object.values(target)
      .map((value) => sourceOf(dir, value))
      .find(Boolean);
  }
  if (typeof target !== "string" || !target.startsWith("./dist/")) return undefined;
  const base = target.replace(/^\.\/dist\//, "src/").replace(/\.(d\.c?ts|c?js|mjs)$/, "");
  return [".ts", ".tsx"].map((ext) => path.join(dir, base + ext)).find((file) => existsSync(file));
}

/**
 * Associe chaque fichier source de point d'entrée à son spécificateur d'import public.
 *
 * @param {PublishedPackage} pkg - Package analysé.
 * @param {string[]} errors - Liste d'erreurs à compléter.
 * @returns {Map<string, string>} Fichier source → spécificateur (`@etiennea20/adr-react/fetch`).
 */
function resolveEntries(pkg, errors) {
  const exportsField = /** @type {Record<string, unknown>} */ (pkg.manifest.exports ?? {});
  /** @type {Map<string, string>} */
  const entries = new Map();
  for (const [subpath, target] of Object.entries(exportsField)) {
    if (subpath === "./package.json") continue;
    const source = sourceOf(pkg.dir, target);
    if (source) entries.set(source, path.posix.join(pkg.name, subpath));
    else errors.push(`exports["${subpath}"] : fichier source introuvable dans src/`);
  }
  return entries;
}

/**
 * Crée un programme TypeScript avec le tsconfig du package.
 *
 * @param {string} dir - Dossier du package.
 * @param {string[]} rootNames - Fichiers d'entrée.
 * @returns {ts.Program} Le programme.
 */
function createProgram(dir, rootNames) {
  const host = {
    ...ts.sys,
    /** @param {ts.Diagnostic} diagnostic - Erreur de lecture du tsconfig. */
    onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
      throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    },
  };
  const parsed = ts.getParsedCommandLineOfConfigFile(path.join(dir, "tsconfig.json"), {}, host);
  return ts.createProgram(rootNames, parsed?.options ?? {});
}

/**
 * Collecte les exports publics de tous les points d'entrée d'un package.
 *
 * @param {PublishedPackage} pkg - Package analysé.
 * @param {string[]} errors - Liste d'erreurs à compléter.
 * @returns {{ checker: ts.TypeChecker; exports: PublicExport[] }} Le checker et les exports.
 */
function collectExports(pkg, errors) {
  const entries = resolveEntries(pkg, errors);
  const program = createProgram(pkg.dir, [...entries.keys()]);
  const checker = program.getTypeChecker();
  /** @type {PublicExport[]} */
  const exports = [];
  for (const [file, specifier] of entries) {
    const sourceFile = program.getSourceFile(file);
    const moduleSymbol = sourceFile ? checker.getSymbolAtLocation(sourceFile) : undefined;
    for (const symbol of moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : []) {
      const isAlias = (symbol.flags & ts.SymbolFlags.Alias) !== 0;
      const target = isAlias ? checker.getAliasedSymbol(symbol) : symbol;
      exports.push({ name: symbol.name, specifier, symbol: target });
    }
  }
  return { checker, exports };
}

/**
 * Renvoie le texte de chaque occurrence d'un tag JSDoc.
 *
 * @param {ts.JSDocTagInfo[]} tags - Tags du symbole.
 * @param {string} name - Nom du tag sans `@`.
 * @returns {string[]} Le texte de chaque occurrence.
 */
function tagTexts(tags, name) {
  return tags.filter((tag) => tag.name === name).map((tag) => ts.displayPartsToString(tag.text));
}

/**
 * Indique si un nœud contient une instruction `throw`.
 *
 * @param {ts.Node | undefined} node - Nœud à parcourir.
 * @returns {boolean} `true` si une instruction `throw` est trouvée.
 */
function containsThrow(node) {
  if (!node) return false;
  if (ts.isThrowStatement(node)) return true;
  return ts.forEachChild(node, (child) => (containsThrow(child) ? true : undefined)) ?? false;
}

/**
 * Vérifie les tags d'une signature d'appel (fonction, hook, composant, décorateur).
 *
 * @param {ts.Signature} signature - Signature analysée.
 * @param {ts.JSDocTagInfo[]} tags - Tags du symbole.
 * @returns {string[]} Les problèmes trouvés.
 */
function checkSignature(signature, tags) {
  const params = tagTexts(tags, "param");
  const typeParams = tagTexts(tags, "typeParam");
  const parameters = signature.getParameters();
  const missingParams = parameters.filter((param) =>
    // Paramètre déstructuré (`__0`) : un @param au nom libre (`props`) suffit.
    param.name.startsWith("__")
      ? params.length < parameters.length
      : !params.some((text) => text.startsWith(`${param.name} `)),
  );
  const missingTypeParams = (signature.getTypeParameters() ?? [])
    .map((typeParam) => typeParam.symbol.name)
    .filter((name) => !typeParams.some((text) => text.startsWith(name)));
  const needsReturns = (signature.getReturnType().flags & NO_RETURN) === 0;
  return [
    ...missingParams.map((param) => `@param manquant pour « ${param.name} »`),
    ...missingTypeParams.map((name) => `@typeParam manquant pour « ${name} »`),
    ...(needsReturns && tagTexts(tags, "returns").length === 0 ? ["@returns manquant"] : []),
  ];
}

/**
 * Vérifie les tags liés aux signatures d'appel d'un export.
 *
 * @param {DocContext} context - Symbole, checker et tags.
 * @returns {string[]} Les problèmes trouvés (sans doublon).
 */
function checkSignatures({ checker, symbol, tags }) {
  if (!(symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable))) return [];
  const signatures = checker.getTypeOfSymbol(symbol).getCallSignatures();
  return [...new Set(signatures.flatMap((signature) => checkSignature(signature, tags)))];
}

/**
 * Renvoie les membres d'une interface ou d'un alias de type objet.
 *
 * @param {ts.Declaration | undefined} declaration - Déclaration principale.
 * @returns {readonly ts.TypeElement[]} Les membres (vide pour les autres déclarations).
 */
function membersOf(declaration) {
  if (!declaration) return [];
  if (ts.isInterfaceDeclaration(declaration)) return declaration.members;
  if (ts.isTypeAliasDeclaration(declaration) && ts.isTypeLiteralNode(declaration.type)) {
    return declaration.type.members;
  }
  return [];
}

/**
 * Vérifie que chaque membre d'une interface ou d'un type objet exporté est documenté
 * (props des composants React notamment).
 *
 * @param {ts.TypeChecker} checker - Checker TypeScript.
 * @param {ts.Declaration | undefined} declaration - Déclaration principale.
 * @returns {string[]} Les problèmes trouvés.
 */
function checkMembers(checker, declaration) {
  return membersOf(declaration)
    .map((member) => member.name)
    .filter((name) => name !== undefined && ts.isIdentifier(name))
    .filter((name) => {
      const memberSymbol = checker.getSymbolAtLocation(name);
      return !memberSymbol || memberSymbol.getDocumentationComment(checker).length === 0;
    })
    .map((name) => `membre « ${name.getText()} » sans TSDoc`);
}

/**
 * Vérifie le TSDoc d'un export public.
 *
 * @param {ts.TypeChecker} checker - Checker TypeScript.
 * @param {ts.Symbol} symbol - Symbole exporté (alias résolu).
 * @returns {string[]} Les problèmes trouvés.
 */
function checkTsdoc(checker, symbol) {
  const tags = symbol.getJsDocTags(checker);
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  const description = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  const since = tagTexts(tags, "since")[0]?.trim() ?? "";
  const rules = [
    [!description, "description TSDoc manquante"],
    [tagTexts(tags, "example").length === 0, "@example manquant"],
    [!SEMVER.test(since), "@since manquant ou invalide (x.y.z attendu)"],
    [tagTexts(tags, "internal").length > 0, "élément public marqué @internal"],
    [
      containsThrow(declaration) && tagTexts(tags, "throws").length === 0,
      "@throws manquant alors que le code lève une erreur",
    ],
  ];
  return [
    ...rules.filter(([failed]) => failed).map(([, message]) => String(message)),
    ...checkSignatures({ checker, symbol, tags }),
    ...checkMembers(checker, declaration),
  ];
}

/**
 * Vérifie la cohérence d'une entrée SKILLS.md avec l'export qu'elle décrit.
 *
 * @param {PublishedPackage} pkg - Package analysé.
 * @param {SkillsEntry} entry - Entrée de SKILLS.md.
 * @param {PublicExport} item - Export correspondant.
 * @param {ts.TypeChecker} checker - Checker TypeScript.
 * @returns {string[]} Les problèmes trouvés.
 */
function checkEntry(pkg, entry, item, checker) {
  const { fields } = entry;
  const tags = item.symbol.getJsDocTags(checker);
  const since = tagTexts(tags, "since")[0]?.trim();
  const deprecated = tagTexts(tags, "deprecated").length > 0;
  const missingFiles = ["Source", "Tests"].filter((field) => {
    const file = fields[field];
    return file && !existsSync(path.join(pkg.dir, file));
  });
  const rules = [
    ...REQUIRED_FIELDS.map((field) => [!fields[field], `champ « ${field} » manquant`]),
    [fields["Point d'entrée"] !== item.specifier, `point d'entrée attendu « ${item.specifier} »`],
    [fields.Depuis !== since, `« Depuis » (${fields.Depuis ?? "?"}) ≠ @since (${since ?? "?"})`],
    [!STATUSES.includes(fields.Statut ?? ""), `statut attendu : ${STATUSES.join(", ")}`],
    [deprecated !== (fields.Statut === "déprécié"), "statut « déprécié » ⇔ tag @deprecated"],
    ...missingFiles.map((field) => [true, `fichier « ${field} » introuvable : ${fields[field]}`]),
  ];
  return rules
    .filter(([failed]) => failed)
    .map(([, message]) => `SKILLS.md:${entry.line} : ${String(message)}`);
}

/**
 * Vérifie un package publié et renvoie la liste de ses erreurs.
 *
 * @param {PublishedPackage} pkg - Package analysé.
 * @returns {{ errors: string[]; count: number }} Les erreurs et le nombre d'exports vérifiés.
 */
function checkPackage(pkg) {
  const skillsPath = path.join(pkg.dir, "SKILLS.md");
  if (!existsSync(skillsPath)) return { errors: ["SKILLS.md absent"], count: 0 };
  const document = parseSkillsMd(readText(skillsPath));
  const entries = new Map(document.entries.map((entry) => [entry.name, entry]));
  /** @type {string[]} */
  const errors = [];
  if (entries.size !== document.entries.length) errors.push("SKILLS.md : entrées en double");
  const { checker, exports } = collectExports(pkg, errors);
  for (const item of exports) {
    const entry = entries.get(item.name);
    const problems = [
      ...checkTsdoc(checker, item.symbol),
      ...(entry
        ? checkEntry(pkg, entry, item, checker)
        : [`aucune entrée « ### \`${item.name}\` » dans SKILLS.md`]),
    ];
    errors.push(...problems.map((problem) => `\`${item.name}\` (${item.specifier}) : ${problem}`));
  }
  const exported = new Set(exports.map((item) => item.name));
  for (const entry of document.entries.filter((candidate) => !exported.has(candidate.name))) {
    errors.push(
      `SKILLS.md:${entry.line} : \`${entry.name}\` n'est exporté par aucun point d'entrée`,
    );
  }
  return { errors, count: exports.length };
}

let failed = false;
for (const pkg of listPublishedPackages()) {
  const { errors, count } = checkPackage(pkg);
  const label = path.relative(ROOT_DIR, pkg.dir).replaceAll("\\", "/");
  if (errors.length === 0) {
    console.log(`✔ ${label} : ${count} export(s) public(s) vérifié(s)`);
    continue;
  }
  failed = true;
  console.error(`✖ ${label} : ${errors.length} problème(s)`);
  for (const error of errors) console.error(`  - ${error}`);
}
process.exitCode = failed ? 1 : 0;
