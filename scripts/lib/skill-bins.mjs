// @ts-check
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import { readText, ROOT_DIR } from "./workspace.mjs";

/**
 * Scripts `bin/` des packages publiés : une commande `<skill>-skills` par skill, chacune copie
 * générée de scripts/templates/install-skills-bin.mjs (voir install-skills.mjs).
 */

/** @typedef {import("./workspace.mjs").PublishedPackage} PublishedPackage */
/** @typedef {{ skill: string; source: string; files: Map<string, string> }} RenderedSkill */
/**
 * @typedef {object} RenderedPackage
 * @property {PublishedPackage} pkg - Package source.
 * @property {RenderedSkill} main - Skill dérivé de SKILLS.md.
 * @property {RenderedSkill[]} extras - Skills dérivés de skills-src/.
 */

const MAIN_BIN_FILE = "install-skills.mjs";
const BIN_TEMPLATE = path.join(ROOT_DIR, "scripts", "templates", "install-skills-bin.mjs");
const BIN_PLACEHOLDER = "const SKILLS = [];";
const BIN_HEADER =
  "// Généré par `pnpm run install:skills` depuis scripts/templates/install-skills-bin.mjs : ne pas modifier.";

/**
 * Nom du fichier bin qui installe un skill : `install-skills.mjs` pour le skill principal du
 * package (compatibilité avec la commande `<pkg>-skills`), `install-<skill>.mjs` sinon.
 *
 * @param {RenderedPackage} rendered - Skills du package.
 * @param {RenderedSkill} skill - Skill installé par la commande.
 * @returns {string} Le nom du fichier dans bin/.
 */
function binFileName(rendered, skill) {
  return skill === rendered.main ? MAIN_BIN_FILE : `install-${skill.skill}.mjs`;
}

/**
 * Contenu attendu des scripts bin de chaque package : une copie du modèle par skill, avec un
 * en-tête et la liste des skills que la commande installe.
 *
 * @param {RenderedPackage[]} packages - Skills des packages concernés.
 * @returns {Map<string, string>} Chemin du script → contenu attendu.
 * @throws {Error} Si le modèle ne contient plus la ligne à remplacer.
 */
export function renderBins(packages) {
  const [shebang = "", ...rest] = readText(BIN_TEMPLATE).split("\n");
  const template = [shebang, BIN_HEADER, ...rest].join("\n");
  if (!template.includes(BIN_PLACEHOLDER)) {
    throw new Error(`${BIN_TEMPLATE} : ligne « ${BIN_PLACEHOLDER} » introuvable`);
  }
  /** @type {Map<string, string>} */
  const bins = new Map();
  for (const rendered of packages) {
    for (const skill of [rendered.main, ...rendered.extras]) {
      const file = path.join(rendered.pkg.dir, "bin", binFileName(rendered, skill));
      const list = `const SKILLS = ${JSON.stringify([skill.skill])};`;
      bins.set(file, template.replace(BIN_PLACEHOLDER, list));
    }
  }
  return bins;
}

/**
 * Vérifie que le champ `bin` de package.json déclare une commande `<skill>-skills` par skill.
 *
 * @param {RenderedPackage[]} packages - Skills des packages concernés.
 * @throws {Error} Si une commande manque ou ne pointe pas vers le bon script.
 */
export function assertBinCommands(packages) {
  const errors = [];
  for (const rendered of packages) {
    const declared = /** @type {Record<string, string>} */ (rendered.pkg.manifest.bin ?? {});
    for (const skill of [rendered.main, ...rendered.extras]) {
      const command = `${skill.skill}-skills`;
      const expected = `./bin/${binFileName(rendered, skill)}`;
      if (declared[command] !== expected) {
        errors.push(
          `packages/${rendered.pkg.dirName}/package.json : "bin": { "${command}": "${expected}" }`,
        );
      }
    }
  }
  if (errors.length > 0) {
    throw new Error(`commandes bin manquantes ou incorrectes :\n  - ${errors.join("\n  - ")}`);
  }
}

/**
 * Liste les scripts bin absents ou différents du modèle.
 *
 * @param {Map<string, string>} bins - Chemin du script → contenu attendu.
 * @returns {string[]} Les chemins désynchronisés.
 */
export function staleBins(bins) {
  return [...bins]
    .filter(([file, content]) => !existsSync(file) || readText(file) !== content)
    .map(([file]) => file);
}

/**
 * Liste les scripts présents dans bin/ qui ne correspondent plus à aucun skill.
 *
 * @param {RenderedPackage[]} packages - Skills des packages concernés.
 * @param {Map<string, string>} bins - Chemin du script → contenu attendu.
 * @returns {string[]} Les chemins en trop.
 */
export function findExtraBins(packages, bins) {
  return packages.flatMap(({ pkg }) => {
    const dir = path.join(pkg.dir, "bin");
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .map((name) => path.join(dir, name))
      .filter((file) => !bins.has(file));
  });
}
