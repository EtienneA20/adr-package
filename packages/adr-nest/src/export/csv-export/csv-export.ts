import { escapeSpreadsheetFormula, toCsv } from "@etiennea20/adr-misc";

import type { IExportColumn } from "../export-columns";
import { DEFAULT_EXPORT_MAX_ROWS, limitExportRows } from "../export-limit";
import { formatCsvCell } from "../format-csv-cell";
import type { IExportOptions } from "../json-export";
import { readExportCell } from "../read-export-cell";

/**
 * Options de l'export CSV.
 *
 * @example
 * ```ts
 * const options: ICsvExportOptions = { delimiter: ",", bom: false };
 * ```
 * @since 0.2.0
 */
export interface ICsvExportOptions extends IExportOptions {
  /** Séparateur de champs (`;` par défaut, pour Excel en français). */
  readonly delimiter?: string | undefined;
  /** Ajoute le BOM UTF-8, pour qu'Excel affiche les accents (`true` par défaut). */
  readonly bom?: boolean | undefined;
}

/** Nombre de lignes regroupées dans un même morceau du flux. */
const BATCH_SIZE = 500;

/**
 * Produit un export CSV pour Excel en français, en flux : BOM UTF-8, séparateur `;`, virgule
 * décimale, fins de ligne `\r\n`, dates `JJ/MM/AAAA` (et `HH:mm`) dans le fuseau demandé,
 * booléens `oui` / `non`.
 *
 * **Injection de formules** : chaque texte (en-têtes compris) qui commencerait par `=`, `+`,
 * `-`, `@`, une tabulation, un retour chariot ou une variante pleine chasse est préfixé d'une
 * apostrophe (`escapeSpreadsheetFormula`), sauf colonne `trusted`. Les nombres ne sont pas
 * modifiés.
 *
 * @typeParam T - Type d'une ligne.
 * @param rows - Lignes (tableau ou itérable asynchrone).
 * @param columns - Colonnes (`defineExportColumns`).
 * @param options - Séparateur, BOM, fuseau, limite de lignes.
 * @returns Les morceaux de texte du fichier.
 * @throws {@link ExportLimitExceededException} Pendant le flux, au-delà de `maxRows` lignes.
 * @throws {@link RangeError} Si `delimiter` n'est pas un caractère unique valide (voir `toCsv`).
 * @example
 * ```ts
 * return createExportFile(toCsvExport(books, bookExportColumns), { format: "csv", fileName: "catalogue" });
 * ```
 * @since 0.2.0
 */
export async function* toCsvExport<T>(
  rows: Iterable<T> | AsyncIterable<T>,
  columns: readonly IExportColumn<T>[],
  options: ICsvExportOptions = {},
): AsyncGenerator<string> {
  const csvOptions = { delimiter: options.delimiter ?? ";" };
  const timeZone = options.timeZone ?? "Europe/Paris";
  const header = toCsv(
    [columns.map((column) => escapeSpreadsheetFormula(column.header))],
    csvOptions,
  );
  let batch = `${options.bom === false ? "" : "﻿"}${header}`;
  let count = 0;
  for await (const row of limitExportRows(rows, options.maxRows ?? DEFAULT_EXPORT_MAX_ROWS)) {
    const cells = columns.map((column) =>
      formatCsvCell(readExportCell(row, column), column, timeZone),
    );
    batch += `\r\n${toCsv([cells], csvOptions)}`;
    count += 1;
    if (count % BATCH_SIZE === 0) {
      yield batch;
      batch = "";
    }
  }
  if (batch) yield batch;
}
