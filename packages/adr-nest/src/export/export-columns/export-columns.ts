import { ExportConfigError } from "../export-config-error";

/**
 * Type d'une colonne d'export : fixe la conversion de la valeur et son format (texte, nombre,
 * montant en euros, date, date et heure, booléen).
 *
 * En XLSX, chaque type donne une cellule typée (vrai nombre, vraie date) au format français ;
 * en CSV, une valeur formatée en français (`31/01/2026`, `12,5`, `oui`) ; en JSON, la valeur
 * brute (dates en ISO 8601).
 *
 * @example
 * ```ts
 * const column = { key: "price", header: "Prix", type: EExportColumnType.CURRENCY };
 * ```
 * @since 0.2.0
 */
export const EExportColumnType = {
  TEXT: "text",
  NUMBER: "number",
  CURRENCY: "currency",
  DATE: "date",
  DATETIME: "datetime",
  BOOLEAN: "boolean",
} as const;

/** Valeur possible de {@link EExportColumnType}. */
export type EExportColumnType = (typeof EExportColumnType)[keyof typeof EExportColumnType];

/**
 * Colonne d'export : seule une colonne déclarée est écrite (liste blanche).
 *
 * @typeParam T - Type d'une ligne.
 * @example
 * ```ts
 * const column: IExportColumn<IBook> = { key: "author", header: "Auteur", value: (book) => book.author.name };
 * ```
 * @since 0.2.0
 */
export interface IExportColumn<T> {
  /** Identifiant unique : clé en JSON, chemin lu par défaut (`author.name`). */
  readonly key: string;
  /** En-tête (CSV, XLSX), en français. */
  readonly header: string;
  /** Type de la valeur (`text` par défaut). */
  readonly type?: EExportColumnType | undefined;
  /** Calcule la valeur à partir de la ligne (par défaut : lecture du chemin `key`). */
  readonly value?: ((row: T) => unknown) | undefined;
  /** Largeur de la colonne en XLSX, en caractères. */
  readonly width?: number | undefined;
  /**
   * Contenu maîtrisé par le serveur (identifiant, code) : pas de neutralisation des formules.
   * À ne jamais activer pour une donnée saisie par un utilisateur.
   */
  readonly trusted?: boolean | undefined;
}

const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/;
const TYPES = new Set<string>(Object.values(EExportColumnType));

function checkColumn<T>(column: IExportColumn<T>, keys: Set<string>): void {
  const problems = [
    [!KEY_PATTERN.test(column.key), "clé invalide (identifiants séparés par des points)"],
    [keys.has(column.key), "clé en double"],
    [!column.header.trim(), "en-tête vide"],
    [
      column.type !== undefined && !TYPES.has(column.type),
      `type inconnu « ${String(column.type)} »`,
    ],
    [column.width !== undefined && !(column.width > 0), "largeur strictement positive attendue"],
  ] as const;
  const problem = problems.find(([failed]) => failed);
  if (problem) throw new ExportConfigError(`Colonne « ${column.key} » : ${problem[1]}.`);
  keys.add(column.key);
}

/**
 * Définit les colonnes d'un export : liste blanche de ce qui est écrit, avec l'en-tête, le type
 * et la façon de lire chaque valeur.
 *
 * À déclarer une fois par export (constante de module) : les erreurs de définition apparaissent
 * au démarrage. Le client ne peut que choisir parmi ces colonnes (voir `selectExportColumns`).
 *
 * @typeParam T - Type d'une ligne.
 * @param columns - Colonnes, dans l'ordre d'écriture.
 * @returns Les colonnes vérifiées (tableau figé).
 * @throws {@link ExportConfigError} Si la liste est vide, ou si une colonne a une clé invalide ou
 * en double, un en-tête vide, un type inconnu ou une largeur non positive.
 * @example
 * ```ts
 * export const bookExportColumns = defineExportColumns<IBook>([
 *   { key: "title", header: "Titre", width: 40 },
 *   { key: "author", header: "Auteur", value: (book) => book.author.name },
 *   { key: "publishedAt", header: "Publication", type: "date" },
 *   { key: "price", header: "Prix", type: "currency" },
 * ]);
 * ```
 * @since 0.2.0
 */
export function defineExportColumns<T>(
  columns: readonly IExportColumn<T>[],
): readonly IExportColumn<T>[] {
  if (!columns.length) throw new ExportConfigError("Un export doit définir au moins une colonne.");
  const keys = new Set<string>();
  for (const column of columns) checkColumn(column, keys);
  return Object.freeze(columns.map((column) => Object.freeze({ ...column })));
}

/**
 * Garde, parmi les colonnes définies, celles que le client a demandées (dans l'ordre de la
 * définition) ; sans demande, toutes.
 *
 * À utiliser avec la sélection de champs d'une requête de liste (`fields`) : le client choisit,
 * mais seulement dans la liste blanche ; une clé inconnue est ignorée.
 *
 * @typeParam T - Type d'une ligne.
 * @param columns - Colonnes définies.
 * @param keys - Clés demandées, ou `undefined` pour toutes.
 * @returns Les colonnes retenues (toutes si aucune clé demandée ne correspond).
 * @example
 * ```ts
 * selectExportColumns(bookExportColumns, ["title", "isbn"]); // colonne « title » seulement
 * ```
 * @since 0.2.0
 */
export function selectExportColumns<T>(
  columns: readonly IExportColumn<T>[],
  keys: readonly string[] | undefined,
): readonly IExportColumn<T>[] {
  if (!keys?.length) return columns;
  const selected = columns.filter((column) => keys.includes(column.key));
  return selected.length ? selected : columns;
}
