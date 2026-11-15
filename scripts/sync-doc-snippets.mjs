// @ts-check
/**
 * `pnpm run sync:snippets` : recopie dans les pages de documentation (`apps/docs/docs/**`) les
 * extraits de code des applications d'exemple compilées et testées (`apps/example-nest`).
 *
 * Dans une page `.mdx`, un marqueur précède le bloc de code à synchroniser :
 *
 *   {/* snippet: apps/example-nest/src/books/books.controller.ts#public-routes *\/}
 *
 *   ```ts title="src/books/books.controller.ts"
 *   … remplacé par le script …
 *   ```
 *
 * `#public-routes` désigne la région délimitée dans le fichier source par `// #region
 * public-routes` et `// #endregion public-routes` ; sans `#région`, tout le fichier est copié.
 * Les lignes de marqueurs de région sont retirées, l'indentation commune aussi ; le titre du
 * bloc est le chemin du fichier dans son application. La page est ensuite formatée par
 * Prettier, pour que `format:check` et `--check` s'accordent.
 *
 * Les pages sont commitées : le build de la doc (local, Docker) n'a besoin ni du script ni des
 * applications d'exemple.
 *
 * Options :
 *   --check   n'écrit rien ; code de sortie 1 si une page n'est pas à jour
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import * as prettier from "prettier";

import { ROOT_DIR } from "./lib/workspace.mjs";

const DOCS_DIR = path.join(ROOT_DIR, "apps", "docs", "docs");
const MARKER = /^\{\/\* snippet: (?<source>[^#\s]+)(?:#(?<region>[\w-]+))? \*\/\}$/;
const REGION_LINE = /^\s*\/\/ #(?:end)?region\b/;
const FENCE = /^```/;
const LANGUAGES = /** @type {Record<string, string>} */ ({
  ".ts": "ts",
  ".tsx": "tsx",
  ".json": "json",
});

/**
 * Liste récursivement les pages de documentation, sans la référence API générée.
 *
 * @param {string} dir - Dossier à parcourir.
 * @returns {string[]} Les chemins absolus des pages `.md` et `.mdx`.
 */
function listPages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "api" ? [] : listPages(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

/**
 * Retire l'indentation commune et les lignes vides de début et de fin.
 *
 * @param {string[]} lines - Lignes de l'extrait.
 * @returns {string[]} Les lignes sans indentation commune.
 */
function dedent(lines) {
  const content = lines
    .join("\n")
    .replace(/^\s*\n|\n\s*$/g, "")
    .split("\n");
  const indents = content
    .filter((line) => line.trim())
    .map((line) => /^ */.exec(line)?.[0].length ?? 0);
  const indent = Math.min(...indents);
  return content.map((line) => line.slice(indent));
}

/**
 * Extrait une région (ou tout le fichier) d'un fichier source.
 *
 * @param {string} source - Chemin du fichier, relatif à la racine du dépôt.
 * @param {string | undefined} region - Nom de la région, ou `undefined` pour tout le fichier.
 * @returns {string[]} Les lignes de l'extrait.
 */
function extract(source, region) {
  const file = path.join(ROOT_DIR, source);
  if (!existsSync(file)) throw new Error(`fichier source introuvable : ${source}`);
  const lines = readFileSync(file, "utf8").replaceAll("\r\n", "\n").split("\n");
  let selected = lines;
  if (region) {
    const start = lines.findIndex((line) => line.trim() === `// #region ${region}`);
    const end = lines.findIndex((line) => line.trim() === `// #endregion ${region}`);
    if (start === -1 || end <= start)
      throw new Error(`région « ${region} » introuvable dans ${source}`);
    selected = lines.slice(start + 1, end);
  }
  return dedent(selected.filter((line) => !REGION_LINE.test(line)));
}

/**
 * Construit le bloc de code d'un extrait.
 *
 * @param {string} source - Chemin du fichier, relatif à la racine du dépôt.
 * @param {string | undefined} region - Nom de la région.
 * @returns {string[]} Les lignes du bloc, clôtures comprises.
 */
function renderBlock(source, region) {
  const language = LANGUAGES[path.extname(source)] ?? "text";
  const title = source.replace(/^apps\/[^/]+\//, "");
  return [`\`\`\`${language} title="${title}"`, ...extract(source, region), "```"];
}

/**
 * Trouve le bloc de code qui suit un marqueur (lignes vides ignorées).
 *
 * @param {string[]} lines - Lignes de la page.
 * @param {number} marker - Index de la ligne du marqueur.
 * @param {string} page - Chemin de la page (pour les messages).
 * @returns {{ open: number; close: number }} Les index des clôtures ouvrante et fermante.
 */
function findBlock(lines, marker, page) {
  let open = marker + 1;
  while (open < lines.length && !lines[open]?.trim()) open += 1;
  const close = lines.findIndex((line, position) => position > open && FENCE.test(line));
  if (!FENCE.test(lines[open] ?? "") || close === -1) {
    throw new Error(`${page}:${marker + 1} : bloc de code attendu après le marqueur`);
  }
  return { open, close };
}

/**
 * Remplace le bloc de code qui suit chaque marqueur d'une page.
 *
 * @param {string} text - Contenu de la page.
 * @param {string} page - Chemin de la page (pour les messages).
 * @returns {string} Le contenu mis à jour (non formaté).
 */
function syncPage(text, page) {
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  // Un marqueur cité dans un bloc de code (documentation du mécanisme) n'est pas un marqueur.
  let inFence = false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (FENCE.test(line)) inFence = !inFence;
    const groups = inFence ? undefined : MARKER.exec(line.trim())?.groups;
    if (!groups) continue;
    const { open, close } = findBlock(lines, index, page);
    const block = renderBlock(groups.source ?? "", groups.region);
    lines.splice(open, close - open + 1, ...block);
    index = open + block.length - 1;
  }
  return lines.join("\n");
}

const { values } = parseArgs({ options: { check: { type: "boolean", default: false } } });
const outdated = [];
for (const page of listPages(DOCS_DIR)) {
  const current = readFileSync(page, "utf8");
  if (!current.includes("{/* snippet: ")) continue;
  const relative = path.relative(ROOT_DIR, page).replaceAll("\\", "/");
  const options = (await prettier.resolveConfig(page)) ?? {};
  const expected = await prettier.format(syncPage(current, relative), {
    ...options,
    filepath: page,
  });
  if (expected === current.replaceAll("\r\n", "\n")) continue;
  outdated.push(relative);
  if (!values.check) writeFileSync(page, expected);
}

if (values.check && outdated.length) {
  console.error(
    `✖ extraits désynchronisés (lancer pnpm run sync:snippets) :\n  ${outdated.join("\n  ")}`,
  );
  process.exit(1);
}
console.log(
  outdated.length ? `✔ extraits mis à jour : ${outdated.join(", ")}` : "✔ extraits synchronisés",
);
