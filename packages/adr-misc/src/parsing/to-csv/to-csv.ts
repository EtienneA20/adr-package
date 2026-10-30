import { assertCsvDelimiter } from "../csv-delimiter";

/**
 * Options de {@link toCsv}.
 *
 * @example
 * ```ts
 * const options: IToCsvOptions = { delimiter: ",", decimalSeparator: ".", bom: false };
 * toCsv([{ titre: "Germinal", prix: 8.5 }], options); // "titre,prix\r\nGerminal,8.5"
 * ```
 * @since 0.2.0
 */
export interface IToCsvOptions {
  /**
   * Séparateur de champs (un seul caractère). `;` convient à Excel en français.
   *
   * @defaultValue `";"`
   */
  readonly delimiter?: string;
  /**
   * Colonnes à écrire, dans l'ordre. Pour des lignes objets, ce sont les clés lues (par défaut :
   * toutes les clés rencontrées, dans l'ordre d'apparition) ; pour des lignes tableaux, la
   * ligne d'en-têtes (par défaut : aucune).
   */
  readonly columns?: readonly string[];
  /**
   * Écrit la ligne d'en-têtes (les colonnes) en premier.
   *
   * @defaultValue `true`
   */
  readonly includeHeader?: boolean;
  /**
   * Ajoute le BOM UTF-8 en tête : nécessaire pour qu'Excel affiche correctement les accents
   * d'un fichier ouvert par double-clic.
   *
   * @defaultValue `false`
   */
  readonly bom?: boolean;
  /**
   * Fin de ligne. La RFC 4180 et Excel utilisent `\r\n`.
   *
   * @defaultValue `"\r\n"`
   */
  readonly lineSeparator?: "\r\n" | "\n";
  /**
   * Séparateur décimal des nombres. `,` convient à Excel en français.
   *
   * @defaultValue `","`
   */
  readonly decimalSeparator?: "," | ".";
  /**
   * Préfixe d'une apostrophe les textes qui commencent par `=`, `+`, `-`, `@`, une tabulation
   * ou un retour chariot, pour qu'Excel ne les exécute pas comme des formules (injection CSV).
   * À activer pour exporter des données saisies par des utilisateurs.
   *
   * @defaultValue `false`
   */
  readonly escapeFormulas?: boolean;
}

/** Une ligne à écrire : liste de valeurs ou objet indexé par les colonnes. */
type CsvRow = readonly unknown[] | Readonly<Record<string, unknown>>;

/** Options résolues utiles à l'écriture d'une cellule. */
interface ICellOptions {
  /** Séparateur de champs. */
  readonly delimiter: string;
  /** Séparateur décimal des nombres. */
  readonly decimalSeparator: "," | ".";
  /** Neutralise les formules. */
  readonly escapeFormulas: boolean;
}

/** Début de texte interprété comme une formule par les tableurs. */
const FORMULA_PATTERN = /^[=+\-@\t\r]/;

/**
 * Indique si une ligne est un tableau de valeurs (`Array.isArray` n'affine pas les tableaux
 * en lecture seule).
 *
 * @param row - Ligne à tester.
 * @returns `true` si la ligne est un tableau.
 */
function isArrayRow(row: CsvRow): row is readonly unknown[] {
  return Array.isArray(row);
}

/**
 * Convertit une valeur en texte de cellule.
 *
 * @param value - Valeur de la cellule.
 * @param options - Options résolues.
 * @returns Le texte, avant échappement CSV.
 */
function stringifyValue(value: unknown, options: ICellOptions): string {
  switch (typeof value) {
    case "string":
      return options.escapeFormulas && FORMULA_PATTERN.test(value) ? `'${value}` : value;
    case "number":
      return Number.isFinite(value) ? String(value).replace(".", options.decimalSeparator) : "";
    case "boolean":
    case "bigint":
      return String(value);
    case "object":
      return stringifyObject(value);
    default:
      return "";
  }
}

/**
 * Convertit une valeur objet en texte de cellule.
 *
 * @param value - Objet, tableau, `Date` ou `null`.
 * @returns L'ISO 8601 d'une date valide, le JSON d'un autre objet, ou `""`.
 */
function stringifyObject(value: object | null): string {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString();
  }
  return value === null ? "" : JSON.stringify(value);
}

/**
 * Écrit une cellule, entre guillemets si elle contient le séparateur, un guillemet ou un
 * retour à la ligne (guillemets doublés à l'intérieur).
 *
 * @param value - Valeur de la cellule.
 * @param options - Options résolues.
 * @returns La cellule échappée.
 */
function formatCell(value: unknown, options: ICellOptions): string {
  const text = stringifyValue(value, options);
  const needsQuotes = /["\r\n]/.test(text) || text.includes(options.delimiter);
  return needsQuotes ? `"${text.replaceAll('"', '""')}"` : text;
}

/**
 * Résout les options utiles à l'écriture des cellules et vérifie le séparateur.
 *
 * @param options - Options de {@link toCsv}.
 * @returns Les options résolues (valeurs par défaut appliquées).
 * @throws {@link RangeError} Si le séparateur est invalide.
 */
function resolveCellOptions(options: IToCsvOptions): ICellOptions {
  const delimiter = options.delimiter ?? ";";
  assertCsvDelimiter(delimiter);
  return {
    delimiter,
    decimalSeparator: options.decimalSeparator ?? ",",
    escapeFormulas: options.escapeFormulas ?? false,
  };
}

/**
 * Liste les clés de toutes les lignes objets, dans l'ordre d'apparition.
 *
 * @param rows - Lignes à écrire.
 * @returns Les clés, sans doublon.
 */
function collectColumns(rows: readonly CsvRow[]): string[] {
  const columns = new Set<string>();
  for (const row of rows) {
    if (!isArrayRow(row)) {
      Object.keys(row).forEach((key) => columns.add(key));
    }
  }
  return [...columns];
}

/**
 * Convertit des lignes en contenu CSV (RFC 4180), l'inverse de `parseCsv`.
 *
 * À utiliser pour exporter des données vers un tableur (liste des emprunts en retard,
 * catalogue…). Les lignes sont des tableaux de valeurs ou des objets ; les cellules contenant
 * le séparateur, un guillemet ou un retour à la ligne sont mises entre guillemets. Les valeurs
 * par défaut visent Excel en français : séparateur `;`, virgule décimale, fin de ligne `\r\n`.
 *
 * @remarks
 * Conversion des valeurs : `null`, `undefined`, `NaN` et les dates invalides donnent une
 * cellule vide, une `Date` son ISO 8601 (`toISOString`), un objet son JSON. Pour un format
 * français, formater les valeurs avant l'appel (`formatDate`…). Le résultat ne se termine pas
 * par une fin de ligne.
 *
 * @param rows - Lignes à écrire : tableaux de valeurs ou objets indexés par les colonnes.
 * @param options - Options d'écriture (voir {@link IToCsvOptions}).
 * @returns Le contenu CSV.
 * @throws {@link RangeError} Si `options.delimiter` n'est pas un caractère unique, ou s'il
 *   s'agit du guillemet ou d'un retour à la ligne.
 * @example
 * ```ts
 * toCsv([
 *   { titre: "Germinal", auteur: "Zola, Émile", prix: 8.5 },
 *   { titre: 'Le "Horla"', auteur: "Maupassant", prix: 4 },
 * ]);
 * // 'titre;auteur;prix\r\nGerminal;Zola, Émile;8,5\r\n"Le ""Horla""";Maupassant;4'
 *
 * toCsv([["a", 1]], { columns: ["lettre", "nombre"], delimiter: ",", bom: true });
 * // "\ufefflettre,nombre\r\na,1"
 * ```
 * @since 0.2.0
 */
export function toCsv(
  rows: readonly (readonly unknown[] | Readonly<Record<string, unknown>>)[],
  options: IToCsvOptions = {},
): string {
  const cellOptions = resolveCellOptions(options);
  const columns = options.columns ?? collectColumns(rows);
  const lines = rows.map((row) => (isArrayRow(row) ? row : columns.map((column) => row[column])));
  if (options.includeHeader !== false && columns.length > 0) {
    lines.unshift(columns);
  }
  const content = lines
    .map((cells) => cells.map((cell) => formatCell(cell, cellOptions)).join(cellOptions.delimiter))
    .join(options.lineSeparator ?? "\r\n");
  return options.bom === true ? `\ufeff${content}` : content;
}
