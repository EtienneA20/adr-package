import { assertCsvDelimiter } from "../csv-delimiter";

/**
 * Options de {@link parseCsv}.
 *
 * @example
 * ```ts
 * const options: IParseCsvOptions = { delimiter: ",", headers: true };
 * parseCsv("titre,auteur\nGerminal,Zola", options); // [{ titre: "Germinal", auteur: "Zola" }]
 * ```
 * @since 0.2.0
 */
export interface IParseCsvOptions {
  /**
   * Séparateur de champs (un seul caractère). Sans cette option, il est détecté sur la
   * première ligne parmi `;`, `,`, tabulation et `|` (le plus fréquent ; `;` en cas d'égalité
   * ou si aucun n'apparaît, comme dans les exports Excel français).
   *
   * @defaultValue détection automatique
   */
  readonly delimiter?: string;
  /**
   * Utilise la première ligne comme en-têtes et renvoie un objet par ligne suivante.
   *
   * @defaultValue `false`
   */
  readonly headers?: boolean;
  /**
   * Ignore les lignes vides (aucun caractère entre deux retours à la ligne).
   *
   * @defaultValue `true`
   */
  readonly skipEmptyLines?: boolean;
}

/** Valeur d'un champ et position du caractère qui le suit. */
interface IFieldRead {
  /** Valeur du champ, guillemets retirés. */
  readonly value: string;
  /** Position du caractère qui suit le champ (séparateur, retour à la ligne ou fin). */
  readonly end: number;
}

/** Séparateurs candidats de la détection automatique, par ordre de priorité. */
const DELIMITER_CANDIDATES = [";", ",", "\t", "|"] as const;

/** Champ entre guillemets (guillemets doublés compris), à ignorer lors de la détection. */
const QUOTED_FIELD_PATTERN = /"(?:[^"]|"")*"/g;

/**
 * Détecte le séparateur le plus fréquent de la première ligne, hors champs entre guillemets.
 *
 * @param text - Contenu CSV.
 * @returns Le séparateur détecté, `;` par défaut.
 */
function detectDelimiter(text: string): string {
  const firstLine = text.replace(QUOTED_FIELD_PATTERN, "").split(/\r?\n|\r/, 1)[0] ?? "";
  let best: string = DELIMITER_CANDIDATES[0];
  let bestCount = 0;
  for (const candidate of DELIMITER_CANDIDATES) {
    const count = firstLine.split(candidate).length - 1;
    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  }
  return best;
}

/**
 * Lit un champ sans guillemets jusqu'au séparateur, au retour à la ligne ou à la fin.
 *
 * @param text - Contenu CSV.
 * @param start - Position du premier caractère du champ.
 * @param delimiter - Séparateur de champs.
 * @returns Le champ lu.
 */
function readUnquotedField(text: string, start: number, delimiter: string): IFieldRead {
  let end = start;
  while (end < text.length && text[end] !== delimiter && text[end] !== "\n" && text[end] !== "\r") {
    end += 1;
  }
  return { value: text.slice(start, end), end };
}

/**
 * Lit un champ entre guillemets (RFC 4180) : `""` représente un guillemet, et le champ peut
 * contenir le séparateur et des retours à la ligne. Un guillemet non fermé englobe la fin du
 * texte, pour ne perdre aucune donnée.
 *
 * @param text - Contenu CSV.
 * @param start - Position du guillemet ouvrant.
 * @returns Le champ lu, `end` pointant après le guillemet fermant.
 */
function readQuotedField(text: string, start: number): IFieldRead {
  let value = "";
  let index = start + 1;
  let quoteIndex = text.indexOf('"', index);
  while (quoteIndex >= 0 && text[quoteIndex + 1] === '"') {
    value += text.slice(index, quoteIndex + 1);
    index = quoteIndex + 2;
    quoteIndex = text.indexOf('"', index);
  }
  if (quoteIndex < 0) {
    return { value: value + text.slice(index), end: text.length };
  }
  return { value: value + text.slice(index, quoteIndex), end: quoteIndex + 1 };
}

/**
 * Lit un champ, entre guillemets ou non. Les caractères qui suivent un guillemet fermant sont
 * conservés (tolérance pour les fichiers mal formés).
 *
 * @param text - Contenu CSV.
 * @param start - Position du premier caractère du champ.
 * @param delimiter - Séparateur de champs.
 * @returns Le champ lu.
 */
function readField(text: string, start: number, delimiter: string): IFieldRead {
  if (text[start] !== '"') {
    return readUnquotedField(text, start, delimiter);
  }
  const quoted = readQuotedField(text, start);
  const rest = readUnquotedField(text, quoted.end, delimiter);
  return { value: quoted.value + rest.value, end: rest.end };
}

/**
 * Découpe un contenu CSV en lignes de champs. Un retour à la ligne final ne crée pas de ligne
 * vide supplémentaire.
 *
 * @param text - Contenu CSV, non vide.
 * @param delimiter - Séparateur de champs.
 * @returns Les lignes, chacune étant la liste de ses champs.
 */
function readRows(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let index = 0;
  while (index < text.length) {
    const row: string[] = [];
    let field = readField(text, index, delimiter);
    row.push(field.value);
    while (text[field.end] === delimiter) {
      field = readField(text, field.end + 1, delimiter);
      row.push(field.value);
    }
    rows.push(row);
    index = field.end + (text.startsWith("\r\n", field.end) ? 2 : 1);
  }
  return rows;
}

/**
 * Transforme des lignes en objets indexés par les en-têtes de la première ligne.
 *
 * @param rows - Lignes lues (la première contient les en-têtes).
 * @returns Un objet par ligne de données ; un champ manquant vaut `""`, un champ en trop est
 *   ignoré.
 */
function toRecords(rows: readonly (readonly string[])[]): Record<string, string>[] {
  const [headers = [], ...dataRows] = rows;
  return dataRows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
}

/**
 * Analyse un contenu CSV (RFC 4180) et renvoie un tableau d'objets indexés par les en-têtes.
 *
 * À utiliser pour importer un fichier CSV ou un export Excel (liste d'adhérents, catalogue de
 * livres…) : champs entre guillemets, guillemets doublés (`""`), retours à la ligne et
 * séparateurs dans les champs, fins de ligne `\r\n`, `\n` ou `\r`, BOM UTF-8 retiré. Le
 * séparateur est détecté automatiquement (`;` pour les exports Excel français) ou imposé.
 *
 * @remarks
 * Les valeurs restent des chaînes : les convertir avec `parseNumber`, `parseDate` ou
 * `parseBoolean`. Un fichier mal formé (guillemet non fermé) est lu sans erreur, au mieux.
 *
 * @param text - Contenu CSV.
 * @param options - Options de lecture avec `headers: true` (voir {@link IParseCsvOptions}).
 * @returns Un objet par ligne de données, indexé par les en-têtes de la première ligne.
 * @throws {@link RangeError} Si `options.delimiter` n'est pas un caractère unique, ou s'il
 *   s'agit du guillemet ou d'un retour à la ligne.
 * @example
 * ```ts
 * parseCsv('titre;auteur\n"Germinal";"Zola, Émile"', { headers: true });
 * // [{ titre: "Germinal", auteur: "Zola, Émile" }]
 * ```
 * @since 0.2.0
 */
export function parseCsv(
  text: string,
  options: IParseCsvOptions & { readonly headers: true },
): Record<string, string>[];
/**
 * Analyse un contenu CSV (RFC 4180) et renvoie la liste des lignes, chacune étant la liste de
 * ses champs.
 *
 * À utiliser pour importer un fichier CSV ou un export Excel : champs entre guillemets,
 * guillemets doublés (`""`), retours à la ligne et séparateurs dans les champs, fins de ligne
 * `\r\n`, `\n` ou `\r`, BOM UTF-8 retiré. Le séparateur est détecté automatiquement (`;` pour
 * les exports Excel français) ou imposé.
 *
 * @remarks
 * Les valeurs restent des chaînes : les convertir avec `parseNumber`, `parseDate` ou
 * `parseBoolean`. Un fichier mal formé (guillemet non fermé) est lu sans erreur, au mieux.
 *
 * @param text - Contenu CSV.
 * @param options - Options de lecture (voir {@link IParseCsvOptions}).
 * @returns Les lignes (sans les lignes vides par défaut), chacune étant la liste de ses champs.
 * @throws {@link RangeError} Si `options.delimiter` n'est pas un caractère unique, ou s'il
 *   s'agit du guillemet ou d'un retour à la ligne.
 * @example
 * ```ts
 * parseCsv("titre;auteur\nGerminal;Zola"); // [["titre", "auteur"], ["Germinal", "Zola"]]
 * parseCsv("a,b\n1,2", { delimiter: "," }); // [["a", "b"], ["1", "2"]]
 * ```
 * @since 0.2.0
 */
export function parseCsv(
  text: string,
  options?: IParseCsvOptions & { readonly headers?: false },
): string[][];
export function parseCsv(
  text: string,
  options: IParseCsvOptions = {},
): string[][] | Record<string, string>[] {
  if (options.delimiter !== undefined) {
    assertCsvDelimiter(options.delimiter);
  }
  const content = text.startsWith("\ufeff") ? text.slice(1) : text;
  const delimiter = options.delimiter ?? detectDelimiter(content);
  const skipEmptyLines = options.skipEmptyLines ?? true;
  const rows = readRows(content, delimiter).filter(
    (row) => !skipEmptyLines || row.length > 1 || row[0] !== "",
  );
  return options.headers === true ? toRecords(rows) : rows;
}
