// @ts-check

/**
 * Lecture du format SKILLS.md (voir CLAUDE.md racine, section « SKILLS.md »).
 *
 * Le format est volontairement strict pour rester analysable sans dépendance :
 * - un frontmatter YAML limité aux clés `skill` et `description` (valeur simple ou bloc `>-`) ;
 * - des sections `## ` (dont « Introduction » et « Table des matières ») ;
 * - une entrée par élément public, titrée `### \`NomExporté\``, suivie d'un tableau
 *   `| Champ | Valeur |` (Catégorie, Point d'entrée, Statut, Depuis, Source, Tests).
 */

/**
 * @typedef {object} SkillsEntry
 * @property {string} name - Nom exporté de l'élément.
 * @property {number} line - Ligne du titre dans SKILLS.md (1-indexée).
 * @property {Record<string, string>} fields - Champs du tableau de métadonnées.
 */

/**
 * @typedef {object} SkillsDocument
 * @property {Record<string, string>} frontmatter - Clés du frontmatter.
 * @property {string} body - Contenu sans le frontmatter.
 * @property {Map<string, string>} sections - Contenu de chaque section `## `, par titre.
 * @property {SkillsEntry[]} entries - Entrées `### \`Nom\``.
 */

const ENTRY_HEADING = /^### `([^`]+)`\s*$/;
const TABLE_ROW = /^\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|\s*$/;

/**
 * Analyse le frontmatter YAML minimal de SKILLS.md.
 *
 * @param {string} text - Contenu complet du fichier (fins de ligne LF).
 * @returns {{ frontmatter: Record<string, string>; body: string }} Frontmatter et corps.
 * @throws {Error} Si le frontmatter est absent ou mal formé.
 */
function parseFrontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match?.[1]) throw new Error("frontmatter YAML absent (bloc `---` en tête du fichier)");
  /** @type {Record<string, string>} */
  const frontmatter = {};
  let currentKey = "";
  for (const line of match[1].split("\n")) {
    currentKey = readFrontmatterLine(frontmatter, currentKey, line);
  }
  return { frontmatter, body: text.slice(match[0].length) };
}

/**
 * Interprète une ligne du frontmatter : `clé: valeur`, `clé: >-`, ou suite indentée d'un bloc.
 *
 * @param {Record<string, string>} frontmatter - Clés déjà lues (complétées sur place).
 * @param {string} currentKey - Clé du bloc en cours.
 * @param {string} line - Ligne à interpréter.
 * @returns {string} La clé du bloc en cours après cette ligne.
 * @throws {Error} Si la ligne n'est pas reconnue.
 */
function readFrontmatterLine(frontmatter, currentKey, line) {
  const keyMatch = /^([a-z-]+):\s*(.*)$/.exec(line);
  if (keyMatch?.[1] !== undefined) {
    const value = keyMatch[2] ?? "";
    frontmatter[keyMatch[1]] = value === ">-" ? "" : value.replace(/^"(.*)"$/, "$1");
    return keyMatch[1];
  }
  if (currentKey && /^\s+\S/.test(line)) {
    frontmatter[currentKey] = `${frontmatter[currentKey] ?? ""} ${line.trim()}`.trim();
    return currentKey;
  }
  if (line.trim()) throw new Error(`ligne de frontmatter non reconnue : « ${line} »`);
  return currentKey;
}

/**
 * Découpe le corps en sections `## Titre`.
 *
 * @param {string} body - Corps du fichier.
 * @returns {Map<string, string>} Contenu de chaque section (sans son titre), par titre.
 */
function parseSections(body) {
  /** @type {Map<string, string>} */
  const sections = new Map();
  let title = "";
  /** @type {string[]} */
  let lines = [];
  const flush = () => {
    if (title) sections.set(title, lines.join("\n").trim());
  };
  for (const line of body.split("\n")) {
    const heading = /^## (.+)$/.exec(line);
    if (heading?.[1]) {
      flush();
      title = heading[1].trim();
      lines = [];
    } else {
      lines.push(line);
    }
  }
  flush();
  return sections;
}

/**
 * Extrait les entrées `### \`Nom\`` et leur tableau de métadonnées.
 *
 * @param {string} body - Corps du fichier.
 * @param {number} lineOffset - Nombre de lignes du frontmatter (pour les numéros de ligne).
 * @returns {SkillsEntry[]} Les entrées, dans l'ordre du fichier.
 */
function parseEntries(body, lineOffset) {
  /** @type {SkillsEntry[]} */
  const entries = [];
  /** @type {SkillsEntry | undefined} */
  let current;
  body.split("\n").forEach((line, index) => {
    const heading = ENTRY_HEADING.exec(line);
    if (heading?.[1]) {
      current = { name: heading[1], line: index + 1 + lineOffset, fields: {} };
      entries.push(current);
      return;
    }
    if (/^#{1,3} /.test(line)) current = undefined;
    const row = current ? TABLE_ROW.exec(line) : null;
    if (current && row?.[1] && row[2] !== undefined && !/^-+$/.test(row[1])) {
      current.fields[row[1]] = row[2].replace(/^`(.*)`$/, "$1");
    }
  });
  return entries;
}

/**
 * Analyse un fichier SKILLS.md.
 *
 * @param {string} text - Contenu du fichier (fins de ligne LF).
 * @returns {SkillsDocument} Le document analysé.
 * @throws {Error} Si le frontmatter est absent ou mal formé.
 */
export function parseSkillsMd(text) {
  const { frontmatter, body } = parseFrontmatter(text);
  const lineOffset = text.slice(0, text.length - body.length).split("\n").length - 1;
  return {
    frontmatter,
    body,
    sections: parseSections(body),
    entries: parseEntries(body, lineOffset),
  };
}
