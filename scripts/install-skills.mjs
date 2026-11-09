// @ts-check
/**
 * `pnpm run install:skills` : génère les skills Claude Code de chaque package publié à partir
 * de son SKILLS.md (source de vérité) :
 *   .claude/skills/<skill>/SKILL.md      frontmatter + résumé court (rôle, catégories)
 *   .claude/skills/<skill>/reference.md  copie fidèle de l'inventaire complet
 * plus un skill par fichier `packages/<pkg>/skills-src/<skill>.md` (skill de conventions, sans
 * inventaire : son corps devient SKILL.md tel quel).
 *
 * En mode dépôt, recopie aussi scripts/templates/install-skills-bin.mjs dans packages/<pkg>/bin/ :
 * une commande par skill, publiée pour les projets consommateurs. `bin/install-skills.mjs`
 * (commande `<pkg>-skills`) installe le skill du SKILLS.md ; `bin/install-<skill>.mjs`
 * (commande `<skill>-skills`) installe un skill de skills-src. Le champ `bin` de package.json
 * doit déclarer chacune de ces commandes.
 *
 * Options :
 *   --check              n'écrit rien ; code de sortie 1 si les skills sont désynchronisés
 *   --global             installe dans ~/.claude/skills
 *   --target <projet>    installe dans <projet>/.claude/skills
 *   --package <nom>      un seul package (`adr-react` ou `@etiennea20/adr-react`)
 *   --skills-dir <dir>   écrit directement dans <dir> (utilisé par le build des packages)
 *
 * Copie de fichiers uniquement (pas de lien symbolique). Un dossier existant n'est remplacé que
 * s'il porte le marqueur de génération ; sinon le script s'arrête sans rien modifier.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

import { assertBinCommands, findExtraBins, renderBins, staleBins } from "./lib/skill-bins.mjs";
import { parseSkillsMd } from "./lib/skills-md.mjs";
import { listPublishedPackages, readText, ROOT_DIR } from "./lib/workspace.mjs";

/** @typedef {import("./lib/workspace.mjs").PublishedPackage} PublishedPackage */
/** @typedef {import("./lib/skill-bins.mjs").RenderedSkill} RenderedSkill */
/** @typedef {import("./lib/skill-bins.mjs").RenderedPackage} RenderedPackage */
/**
 * @typedef {object} InstallPlan
 * @property {string} skillsDir - Dossier des skills de destination.
 * @property {RenderedSkill[]} rendered - Skills attendus.
 * @property {string[]} stale - Skills générés dont le package n'existe plus.
 * @property {Map<string, string>} bins - Script bin attendu de chaque commande (mode dépôt).
 * @property {string[]} extraBins - Scripts présents dans bin/ sans commande associée.
 */

const MARKER = "generated-by: adr-package/install-skills";
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_DESCRIPTION = 1024;
const MAX_SKILL_LINES = 150;
const MAX_EXTRA_SKILL_LINES = 500;
const EXTRA_SKILLS_DIR = "skills-src";

/**
 * Lit et valide le frontmatter (`skill`, `description`) d'une source de skill.
 *
 * @param {string} file - Chemin absolu du fichier source.
 * @param {string} source - Chemin relatif à la racine (pour les messages).
 * @returns {import("./lib/skills-md.mjs").SkillsDocument & { skill: string; description: string }}
 *   Le document analysé, avec le nom et la description du skill.
 * @throws {Error} Si le fichier est absent ou si son frontmatter est invalide.
 */
function readSkillsSource(file, source) {
  if (!existsSync(file)) throw new Error(`${source} est absent`);
  const document = parseSkillsMd(readText(file));
  const skill = document.frontmatter.skill ?? "";
  const description = document.frontmatter.description ?? "";
  if (!SKILL_NAME.test(skill) || skill.length > 64) {
    throw new Error(`${source} : « skill » doit être en minuscules et tirets (64 caractères max)`);
  }
  if (!description || description.length > MAX_DESCRIPTION) {
    throw new Error(`${source} : « description » vide ou trop longue (${MAX_DESCRIPTION} max)`);
  }
  return { ...document, skill, description };
}

/**
 * Construit le contenu des fichiers du skill d'un package.
 *
 * @param {PublishedPackage} pkg - Package source.
 * @returns {RenderedSkill} Le skill rendu.
 * @throws {Error} Si SKILLS.md est absent, incomplet, ou produirait un SKILL.md trop long.
 */
function renderSkill(pkg) {
  const source = `packages/${pkg.dirName}/SKILLS.md`;
  const { skill, description, body, sections } = readSkillsSource(
    path.join(pkg.dir, "SKILLS.md"),
    source,
  );
  const header = `<!-- Généré par \`pnpm run install:skills\` à partir de ${source}, ne pas modifier à la main. -->`;
  const toc = (sections.get("Table des matières") ?? "").replace(/\]\(#/g, "](reference.md#");
  const skillMd = [
    "---",
    `name: ${skill}`,
    `description: ${JSON.stringify(description)}`,
    "metadata:",
    `  ${MARKER}`,
    `  source: ${source}`,
    "---",
    "",
    header,
    "",
    `# ${pkg.name}`,
    "",
    sections.get("Introduction") ?? "",
    "",
    "## Catégories",
    "",
    toc,
    "",
    "## Retrouver un élément",
    "",
    "- L'inventaire complet est dans [reference.md](reference.md) : une entrée",
    "  `` ### `NomExporté` `` par élément public (signature, paramètres, retour, erreurs, exemple,",
    "  point d'entrée, statut, version d'introduction, fichiers source et test).",
    "- Importer uniquement depuis le « Point d'entrée » indiqué, jamais depuis un chemin interne.",
    `- Les chemins « Source » et « Tests » sont relatifs au package (\`packages/${pkg.dirName}/\``,
    "  dans le monorepo adr-package).",
    `- Pour modifier le package : lire d'abord \`packages/${pkg.dirName}/CLAUDE.md\` et le`,
    "  `CLAUDE.md` racine du monorepo.",
    "",
  ].join("\n");
  if (skillMd.split("\n").length > MAX_SKILL_LINES) {
    throw new Error(
      `${source} : SKILL.md dépasserait ${MAX_SKILL_LINES} lignes (introduction trop longue)`,
    );
  }
  const files = new Map([
    ["SKILL.md", skillMd],
    ["reference.md", `${header}\n\n${body.trim()}\n`],
  ]);
  return { skill, source, files };
}

/**
 * Construit un skill additionnel depuis `skills-src/<skill>.md` : frontmatter de skill, puis le
 * corps du fichier tel quel (pas d'inventaire, donc pas de reference.md).
 *
 * @param {PublishedPackage} pkg - Package source.
 * @param {string} fileName - Nom du fichier dans skills-src/.
 * @returns {RenderedSkill} Le skill rendu.
 * @throws {Error} Si le frontmatter est invalide, si `skill` diffère du nom du fichier ou si
 *   SKILL.md serait trop long.
 */
function renderExtraSkill(pkg, fileName) {
  const source = `packages/${pkg.dirName}/${EXTRA_SKILLS_DIR}/${fileName}`;
  const { skill, description, body } = readSkillsSource(
    path.join(pkg.dir, EXTRA_SKILLS_DIR, fileName),
    source,
  );
  if (`${skill}.md` !== fileName) {
    throw new Error(`${source} : « skill » doit être identique au nom du fichier (${skill}.md)`);
  }
  const header = `<!-- Généré par \`pnpm run install:skills\` à partir de ${source}, ne pas modifier à la main. -->`;
  const skillMd = [
    "---",
    `name: ${skill}`,
    `description: ${JSON.stringify(description)}`,
    "metadata:",
    `  ${MARKER}`,
    `  source: ${source}`,
    "---",
    "",
    header,
    "",
    body.trim(),
    "",
  ].join("\n");
  if (skillMd.split("\n").length > MAX_EXTRA_SKILL_LINES) {
    throw new Error(`${source} : SKILL.md dépasserait ${MAX_EXTRA_SKILL_LINES} lignes`);
  }
  return { skill, source, files: new Map([["SKILL.md", skillMd]]) };
}

/**
 * Construit tous les skills d'un package : celui de SKILLS.md, puis ceux de skills-src/.
 *
 * @param {PublishedPackage} pkg - Package source.
 * @returns {RenderedPackage} Les skills du package.
 */
function renderPackage(pkg) {
  const dir = path.join(pkg.dir, EXTRA_SKILLS_DIR);
  const extraFiles = existsSync(dir)
    ? readdirSync(dir)
        .filter((name) => name.endsWith(".md"))
        .sort()
    : [];
  return {
    pkg,
    main: renderSkill(pkg),
    extras: extraFiles.map((fileName) => renderExtraSkill(pkg, fileName)),
  };
}

/**
 * Refuse deux skills de même nom (ils s'écraseraient dans le dossier de destination).
 *
 * @param {RenderedSkill[]} rendered - Skills attendus.
 * @throws {Error} Si un nom de skill est utilisé deux fois.
 */
function assertUniqueSkills(rendered) {
  const seen = new Map();
  for (const { skill, source } of rendered) {
    if (seen.has(skill)) {
      throw new Error(
        `skill « ${skill} » défini deux fois (${String(seen.get(skill))}, ${source})`,
      );
    }
    seen.set(skill, source);
  }
}

/**
 * Indique si un dossier de skill a été généré par ce script.
 *
 * @param {string} dir - Dossier du skill.
 * @returns {boolean} `true` si SKILL.md porte le marqueur de génération.
 */
function isGenerated(dir) {
  const file = path.join(dir, "SKILL.md");
  return existsSync(file) && readFileSync(file, "utf8").includes(MARKER);
}

/**
 * Compare le contenu attendu d'un skill avec le disque.
 *
 * @param {string} dir - Dossier du skill.
 * @param {RenderedSkill} rendered - Skill attendu.
 * @returns {string[]} Les différences (vide si synchronisé).
 */
function diffSkill(dir, rendered) {
  if (!existsSync(dir)) return [`${dir} : absent`];
  const differences = [];
  for (const [name, expected] of rendered.files) {
    const file = path.join(dir, name);
    const actual = existsSync(file) ? readText(file) : undefined;
    if (actual === undefined) differences.push(`${file} : absent`);
    else if (actual !== expected) {
      const expectedLines = expected.split("\n");
      const line = actual.split("\n").findIndex((text, index) => text !== expectedLines[index]);
      differences.push(`${file} : différent à partir de la ligne ${line + 1}`);
    }
  }
  for (const name of readdirSync(dir).filter((entry) => !rendered.files.has(entry))) {
    differences.push(`${path.join(dir, name)} : fichier en trop`);
  }
  return differences;
}

/**
 * Écrit un skill sur le disque, sans toucher aux fichiers déjà à jour.
 *
 * @param {string} dir - Dossier du skill.
 * @param {RenderedSkill} rendered - Skill à écrire.
 * @returns {boolean} `true` si au moins un fichier a changé.
 */
function writeSkill(dir, rendered) {
  const differences = diffSkill(dir, rendered);
  if (differences.length === 0) return false;
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir).filter((entry) => !rendered.files.has(entry))) {
    rmSync(path.join(dir, name), { recursive: true, force: true });
  }
  for (const [name, content] of rendered.files) writeFileSync(path.join(dir, name), content);
  return true;
}

/**
 * Lit les options de la ligne de commande et en déduit le dossier de destination.
 *
 * @returns {{ check: boolean; packageFilter: string | undefined; skillsDir: string; isRepo: boolean }}
 *   Les options résolues.
 */
function readOptions() {
  const { values } = parseArgs({
    options: {
      check: { type: "boolean", default: false },
      global: { type: "boolean", default: false },
      target: { type: "string" },
      package: { type: "string" },
      "skills-dir": { type: "string" },
    },
  });
  const projectDir = values.global ? os.homedir() : path.resolve(values.target ?? ROOT_DIR);
  const skillsDir = values["skills-dir"]
    ? path.resolve(values["skills-dir"])
    : path.join(projectDir, ".claude", "skills");
  const isRepo = !values.global && !values.target && !values["skills-dir"];
  return { check: values.check, packageFilter: values.package, skillsDir, isRepo };
}

/**
 * Refuse de continuer si un dossier de destination existe sans le marqueur de génération.
 *
 * @param {string} skillsDir - Dossier des skills.
 * @param {RenderedSkill[]} rendered - Skills à écrire.
 * @throws {Error} Si un dossier de skill n'appartient pas à ce script.
 */
function assertOwnership(skillsDir, rendered) {
  for (const { skill } of rendered) {
    const dir = path.join(skillsDir, skill);
    if (existsSync(dir) && !isGenerated(dir)) {
      throw new Error(
        `${dir} existe mais n'a pas été généré par install-skills : rien n'a été modifié`,
      );
    }
  }
}

/**
 * Liste les skills générés par ce script dont le package n'existe plus.
 *
 * @param {string} skillsDir - Dossier des skills.
 * @param {RenderedSkill[]} rendered - Skills attendus.
 * @returns {string[]} Les noms des dossiers orphelins.
 */
function findStaleSkills(skillsDir, rendered) {
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir)
    .filter((name) => !rendered.some(({ skill }) => skill === name))
    .filter((name) => isGenerated(path.join(skillsDir, name)));
}

/**
 * Point d'entrée : rend tous les skills, vérifie la propriété des dossiers, puis écrit ou compare.
 *
 * @returns {number} Le code de sortie.
 */
function main() {
  const { check, packageFilter, skillsDir, isRepo } = readOptions();
  const packages = listPublishedPackages().filter(
    (pkg) => !packageFilter || packageFilter === pkg.dirName || packageFilter === pkg.name,
  );
  if (packages.length === 0)
    throw new Error(`aucun package publié ne correspond à « ${packageFilter ?? ""} »`);
  const renderedPackages = packages.map(renderPackage);
  const rendered = renderedPackages.flatMap(({ main, extras }) => [main, ...extras]);
  assertUniqueSkills(rendered);
  assertOwnership(skillsDir, rendered);
  if (isRepo) assertBinCommands(renderedPackages);
  // Les orphelins ne sont recherchés que dans le dépôt, avec la liste complète des packages.
  const stale = isRepo && !packageFilter ? findStaleSkills(skillsDir, rendered) : [];
  const bins = isRepo ? renderBins(renderedPackages) : new Map();
  const extraBins = isRepo ? findExtraBins(renderedPackages, bins) : [];
  /** @type {InstallPlan} */
  const plan = { skillsDir, rendered, stale, bins, extraBins };
  return check ? reportCheck(plan) : install(plan);
}

/**
 * Mode `--check` : affiche les différences sans rien écrire.
 *
 * @param {InstallPlan} plan - Skills et scripts attendus.
 * @returns {number} 0 si synchronisé, 1 sinon.
 */
function reportCheck({ skillsDir, rendered, stale, bins, extraBins }) {
  const differences = [
    ...rendered.flatMap((item) => diffSkill(path.join(skillsDir, item.skill), item)),
    ...stale.map((name) => `${path.join(skillsDir, name)} : skill généré orphelin`),
    ...staleBins(bins).map((file) => `${file} : différent du modèle`),
    ...extraBins.map((file) => `${file} : script bin sans skill associé`),
  ];
  if (differences.length === 0) {
    console.log(`✔ skills synchronisés (${rendered.map((item) => item.skill).join(", ")})`);
    return 0;
  }
  console.error("✖ skills désynchronisés, lancer `pnpm run install:skills` :");
  for (const difference of differences)
    console.error(`  - ${path.relative(ROOT_DIR, difference).replaceAll("\\", "/")}`);
  return 1;
}

/**
 * Mode normal : écrit les skills (et les scripts bin en mode dépôt), supprime les orphelins.
 *
 * @param {InstallPlan} plan - Skills et scripts à écrire.
 * @returns {number} Toujours 0.
 */
function install({ skillsDir, rendered, stale, bins, extraBins }) {
  for (const file of staleBins(bins)) {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, bins.get(file) ?? "");
    console.log(`✔ mis à jour ${file}`);
  }
  for (const file of extraBins) {
    rmSync(file, { force: true });
    console.log(`✔ supprimé   ${file} (aucun skill associé)`);
  }
  for (const item of rendered) {
    const changed = writeSkill(path.join(skillsDir, item.skill), item);
    console.log(`${changed ? "✔ mis à jour" : "= inchangé "} ${path.join(skillsDir, item.skill)}`);
  }
  for (const name of stale) {
    rmSync(path.join(skillsDir, name), { recursive: true, force: true });
    console.log(`✔ supprimé   ${path.join(skillsDir, name)} (package disparu)`);
  }
  return 0;
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`✖ install-skills : ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
