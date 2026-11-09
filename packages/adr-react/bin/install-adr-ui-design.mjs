#!/usr/bin/env node
// Généré par `pnpm run install:skills` depuis scripts/templates/install-skills-bin.mjs : ne pas modifier.
// @ts-check
/**
 * Installe des skills Claude Code embarqués dans ce package (dossier `skills/`) dans le projet
 * consommateur. Aucune installation automatique : ce script ne s'exécute que sur commande.
 *
 * Un package publie une commande par skill (`<skill>-skills`) : chaque copie générée de ce
 * modèle n'installe que les skills listés dans `SKILLS`.
 *
 * Usage (depuis la racine du projet consommateur) :
 *   pnpm exec <skill>-skills              → ./.claude/skills/
 *   pnpm exec <skill>-skills --global     → ~/.claude/skills/ (toute la machine)
 *   pnpm exec <skill>-skills --target dir → dir/.claude/skills/
 *
 * Copie de fichiers uniquement (pas de lien symbolique). Un dossier existant n'est remplacé que
 * s'il a été généré par adr-package (marqueur dans SKILL.md).
 */
import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const MARKER = "generated-by: adr-package/install-skills";
const PACKAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/**
 * Skills installés par cette commande, renseignés à la génération par `install:skills`
 * (dans le modèle, la liste vide signifie « tous les skills embarqués »).
 *
 * @type {readonly string[]}
 */
const SKILLS = ["adr-ui-design"];

/**
 * Indique si un dossier de skill a été généré par adr-package.
 *
 * @param {string} dir - Dossier du skill.
 * @returns {boolean} `true` si SKILL.md porte le marqueur de génération.
 */
function isGenerated(dir) {
  const file = path.join(dir, "SKILL.md");
  return existsSync(file) && readFileSync(file, "utf8").includes(MARKER);
}

/**
 * Détermine les skills à installer et vérifie qu'ils sont tous embarqués.
 *
 * @param {string} sourceRoot - Dossier `skills/` du package.
 * @returns {readonly string[]} Les noms des skills à installer.
 * @throws {Error} Si aucun skill n'est embarqué ou si un skill attendu manque.
 */
function resolveSkills(sourceRoot) {
  const embedded = existsSync(sourceRoot) ? readdirSync(sourceRoot) : [];
  const skills = SKILLS.length > 0 ? SKILLS : embedded;
  if (skills.length === 0) throw new Error(`aucun skill embarqué dans ${sourceRoot}`);
  const missing = skills.filter((skill) => !embedded.includes(skill));
  if (missing.length > 0) {
    throw new Error(`skill absent de ${sourceRoot} : ${missing.join(", ")}`);
  }
  return skills;
}

/**
 * Point d'entrée : copie chaque skill de la commande vers le dossier de destination.
 *
 * @returns {number} Le code de sortie.
 */
function main() {
  const { values } = parseArgs({
    options: {
      global: { type: "boolean", default: false },
      target: { type: "string" },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  if (values.help) {
    console.log(
      `Installe le(s) skill(s) ${SKILLS.join(", ") || "embarqués"}.\n` +
        "Options : --global (~/.claude/skills), --target <projet>, --help",
    );
    return 0;
  }
  const projectDir = values.global ? os.homedir() : path.resolve(values.target ?? process.cwd());
  const destinationRoot = path.join(projectDir, ".claude", "skills");
  const sourceRoot = path.join(PACKAGE_DIR, "skills");
  const skills = resolveSkills(sourceRoot);
  for (const skill of skills) {
    const destination = path.join(destinationRoot, skill);
    if (existsSync(destination) && !isGenerated(destination)) {
      throw new Error(`${destination} existe et n'a pas été généré par adr-package : non modifié`);
    }
  }
  for (const skill of skills) {
    const destination = path.join(destinationRoot, skill);
    rmSync(destination, { recursive: true, force: true });
    cpSync(path.join(sourceRoot, skill), destination, { recursive: true });
    console.log(`✔ skill « ${skill} » installé dans ${destination}`);
  }
  return 0;
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`✖ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
