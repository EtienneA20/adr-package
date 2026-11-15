import type { IExportColumn } from "../export-columns";
import { DEFAULT_EXPORT_MAX_ROWS, limitExportRows } from "../export-limit";
import { readExportCell } from "../read-export-cell";

/**
 * Options communes des formats d'export.
 *
 * @example
 * ```ts
 * const options: IExportOptions = { maxRows: 10_000, timeZone: "Europe/Paris" };
 * ```
 * @since 0.2.0
 */
export interface IExportOptions {
  /** Nombre maximal de lignes (`DEFAULT_EXPORT_MAX_ROWS` par défaut). */
  readonly maxRows?: number | undefined;
  /** Fuseau horaire des dates en CSV et XLSX (`"Europe/Paris"` par défaut). */
  readonly timeZone?: string | undefined;
}

function toRecord<T>(row: T, columns: readonly IExportColumn<T>[]): Record<string, unknown> {
  return Object.fromEntries(columns.map((column) => [column.key, readExportCell(row, column)]));
}

/**
 * Produit un export en tableau JSON, en flux : `[`, un objet par ligne, `]`.
 *
 * Chaque objet ne contient que les colonnes déclarées (clé = `column.key`), valeurs converties
 * selon le type (dates en ISO 8601). Les lignes sont lues une à une : l'export n'est jamais
 * entièrement en mémoire.
 *
 * @typeParam T - Type d'une ligne.
 * @param rows - Lignes (tableau ou itérable asynchrone).
 * @param columns - Colonnes (`defineExportColumns`).
 * @param options - Limite de lignes.
 * @returns Les morceaux de texte du fichier.
 * @throws {@link ExportLimitExceededException} Pendant le flux, au-delà de `maxRows` lignes.
 * @example
 * ```ts
 * return createExportFile(toJsonExport(books, bookExportColumns), { format: "json", fileName: "catalogue" });
 * ```
 * @since 0.2.0
 */
export async function* toJsonExport<T>(
  rows: Iterable<T> | AsyncIterable<T>,
  columns: readonly IExportColumn<T>[],
  options: IExportOptions = {},
): AsyncGenerator<string> {
  let separator = "[";
  for await (const row of limitExportRows(rows, options.maxRows ?? DEFAULT_EXPORT_MAX_ROWS)) {
    yield `${separator}${JSON.stringify(toRecord(row, columns))}`;
    separator = ",";
  }
  yield separator === "[" ? "[]" : "]";
}

/**
 * Produit un export NDJSON (un objet JSON par ligne, séparés par `\n`), en flux.
 *
 * Même contenu que `toJsonExport`, mais lisible ligne à ligne par le client (traitement au fil
 * de l'eau, gros volumes).
 *
 * @typeParam T - Type d'une ligne.
 * @param rows - Lignes (tableau ou itérable asynchrone).
 * @param columns - Colonnes (`defineExportColumns`).
 * @param options - Limite de lignes.
 * @returns Les lignes du fichier, chacune terminée par `\n`.
 * @throws {@link ExportLimitExceededException} Pendant le flux, au-delà de `maxRows` lignes.
 * @example
 * ```ts
 * return createExportFile(toNdjsonExport(books, bookExportColumns), { format: "ndjson", fileName: "catalogue" });
 * ```
 * @since 0.2.0
 */
export async function* toNdjsonExport<T>(
  rows: Iterable<T> | AsyncIterable<T>,
  columns: readonly IExportColumn<T>[],
  options: IExportOptions = {},
): AsyncGenerator<string> {
  for await (const row of limitExportRows(rows, options.maxRows ?? DEFAULT_EXPORT_MAX_ROWS)) {
    yield `${JSON.stringify(toRecord(row, columns))}\n`;
  }
}
