// @ts-check
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Racine du monorepo (deux niveaux au-dessus de scripts/lib). */
export const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * @typedef {object} PublishedPackage
 * @property {string} name - Nom npm complet (`@etiennea20/adr-react`).
 * @property {string} dirName - Nom du dossier (`adr-react`).
 * @property {string} dir - Chemin absolu du package.
 * @property {Record<string, unknown>} manifest - Contenu du package.json.
 */

/**
 * Liste les packages publiés (non privés) du dossier `packages/`, triés par nom de dossier.
 *
 * @returns {PublishedPackage[]} Les packages publiés.
 */
export function listPublishedPackages() {
  const packagesDir = path.join(ROOT_DIR, "packages");
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDir, entry.name))
    .filter((dir) => existsSync(path.join(dir, "package.json")))
    .map((dir) => {
      /** @type {Record<string, unknown>} */
      const manifest = JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8"));
      return { name: String(manifest.name), dirName: path.basename(dir), dir, manifest };
    })
    .filter((pkg) => pkg.manifest.private !== true)
    .sort((a, b) => a.dirName.localeCompare(b.dirName));
}

/**
 * Lit un fichier texte en normalisant les fins de ligne en LF.
 *
 * @param {string} file - Chemin du fichier.
 * @returns {string} Le contenu avec des fins de ligne LF.
 */
export function readText(file) {
  return readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}
