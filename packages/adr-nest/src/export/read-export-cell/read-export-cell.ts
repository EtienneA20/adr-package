import type { IExportColumn } from "../export-columns";

/**
 * Valeur d'une cellule d'export après conversion selon le type de la colonne ; `null` pour une
 * cellule vide.
 *
 * @example
 * ```ts
 * const value: ExportCellValue = new Date("2026-01-31");
 * ```
 * @since 0.2.0
 */
export type ExportCellValue = string | number | boolean | Date | null;

function readPath(row: unknown, path: string): unknown {
  let current = row;
  for (const segment of path.split(".")) {
    if (typeof current !== "object" || current === null || !Object.hasOwn(current, segment)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function toText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "string") return value;
  const isPrimitive =
    typeof value === "number" || typeof value === "boolean" || typeof value === "bigint";
  // Symbole ou fonction : rien d'exportable.
  return isPrimitive ? String(value) : null;
}

function toNumber(value: unknown): number | null {
  const number = typeof value === "string" && value.trim() ? Number(value) : value;
  return typeof number === "number" && Number.isFinite(number) ? number : null;
}

function toDate(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date)) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Lit la valeur d'une colonne pour une ligne et la convertit selon le type de la colonne.
 *
 * Utilisé par les formats d'export du package ; à utiliser pour écrire un format personnalisé
 * (PDF…) avec les mêmes conversions. Valeur lue : `column.value(row)`, sinon le chemin
 * `column.key`. Conversions : `text` → texte (dates en ISO 8601, objets en JSON) ; `number` et
 * `currency` → nombre fini (texte numérique accepté) ; `date` et `datetime` → `Date` valide
 * (texte ISO ou horodatage accepté) ; `boolean` → booléen. Une valeur absente ou non
 * convertible donne `null` (cellule vide).
 *
 * @typeParam T - Type d'une ligne.
 * @param row - Ligne exportée.
 * @param column - Colonne à lire.
 * @returns La valeur convertie, ou `null`.
 * @example
 * ```ts
 * readExportCell(book, { key: "publishedAt", header: "Publication", type: "date" }); // Date
 * ```
 * @since 0.2.0
 */
export function readExportCell<T>(row: T, column: IExportColumn<T>): ExportCellValue {
  const value = column.value ? column.value(row) : readPath(row, column.key);
  switch (column.type) {
    case "number":
    case "currency":
      return toNumber(value);
    case "date":
    case "datetime":
      return toDate(value);
    case "boolean":
      return typeof value === "boolean" ? value : null;
    default:
      return toText(value);
  }
}
