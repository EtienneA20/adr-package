import { isSpreadsheetFormula } from "@etiennea20/adr-misc";
import { Zip, ZipDeflate, strToU8 } from "fflate";

import {
  DEFAULT_EXPORT_MAX_ROWS,
  type ExportCellValue,
  type IExportColumn,
  type IExportOptions,
  limitExportRows,
  readExportCell,
} from "../../export";
import { toExcelSerial } from "../excel-date";
import {
  XLSX_STYLE,
  columnName,
  escapeXml,
  sheetEnd,
  sheetStart,
  sheetName,
  xlsxStaticParts,
} from "../xlsx-parts";

/**
 * Options de l'export XLSX.
 *
 * @example
 * ```ts
 * const options: IXlsxExportOptions = { sheetName: "Catalogue", maxRows: 10_000 };
 * ```
 * @since 0.2.0
 */
export interface IXlsxExportOptions extends IExportOptions {
  /** Nom de l'onglet (assaini, 31 caractères au plus ; `Export` par défaut). */
  readonly sheetName?: string | undefined;
}

/** Taille (en caractères XML) à partir de laquelle les lignes sont compressées et envoyées. */
const FLUSH_SIZE = 64 * 1024;

const dateTextFormatter = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", dateStyle: "short" });

function textCell(ref: string, text: string, style: number): string {
  const attribute = style === XLSX_STYLE.DEFAULT ? "" : ` s="${style}"`;
  return `<c r="${ref}" t="inlineStr"${attribute}><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
}

function dateCell<T>(ref: string, value: Date, column: IExportColumn<T>, timeZone: string): string {
  const serial = toExcelSerial(value, timeZone);
  // Avant 1900, Excel ne sait pas représenter la date : texte au format français.
  if (serial === undefined)
    return textCell(ref, dateTextFormatter.format(value), XLSX_STYLE.DEFAULT);
  return column.type === "datetime"
    ? `<c r="${ref}" s="${XLSX_STYLE.DATETIME}"><v>${serial}</v></c>`
    : `<c r="${ref}" s="${XLSX_STYLE.DATE}"><v>${Math.floor(serial)}</v></c>`;
}

function cellXml<T>(
  ref: string,
  value: ExportCellValue,
  column: IExportColumn<T>,
  timeZone: string,
): string {
  if (value === null) return "";
  if (value instanceof Date) return dateCell(ref, value, column, timeZone);
  if (typeof value === "boolean") return `<c r="${ref}" t="b"><v>${value ? 1 : 0}</v></c>`;
  if (typeof value === "number") {
    const style = column.type === "currency" ? ` s="${XLSX_STYLE.CURRENCY}"` : "";
    return `<c r="${ref}"${style}><v>${value}</v></c>`;
  }
  // Une donnée n'est jamais écrite en formule (<f>) ; un texte qui y ressemble reçoit en plus le
  // style « préfixe de citation », qui le garde en texte même après modification de la cellule.
  const quoted = !column.trusted && isSpreadsheetFormula(value);
  return textCell(ref, value, quoted ? XLSX_STYLE.QUOTED_TEXT : XLSX_STYLE.DEFAULT);
}

function rowXml<T>(
  row: T,
  rowNumber: number,
  columns: readonly IExportColumn<T>[],
  timeZone: string,
): string {
  const cells = columns
    .map((column, index) =>
      cellXml(`${columnName(index)}${rowNumber}`, readExportCell(row, column), column, timeZone),
    )
    .join("");
  return `<row r="${rowNumber}">${cells}</row>`;
}

function headerXml<T>(columns: readonly IExportColumn<T>[]): string {
  const cells = columns.map((column, index) =>
    textCell(`${columnName(index)}1`, column.header, XLSX_STYLE.HEADER),
  );
  return `<row r="1">${cells.join("")}</row>`;
}

/**
 * Produit un classeur XLSX en flux (archive compressée au fil des lignes, avec fflate) :
 * cellules typées au format français, en-tête en gras, volet figé et filtre automatique.
 *
 * Types de colonnes : `number` (nombre), `currency` (`# ##0,00 €`), `date` (`jj/mm/aaaa`),
 * `datetime` (`jj/mm/aaaa hh:mm`, heure murale de `timeZone`), `boolean` (VRAI / FAUX), `text`.
 * Les dates antérieures au 1er mars 1900, qu'Excel ne sait pas représenter, sont écrites en
 * texte. **Injection de formules** : aucune donnée n'est écrite en formule (cellules texte
 * « inline ») ; un texte qui commence par un caractère de formule reçoit en plus le style
 * « préfixe de citation » (`quotePrefix`), sauf colonne `trusted`. Mémoire bornée : les lignes
 * sont compressées et envoyées par blocs de 64 Ko de XML.
 *
 * @typeParam T - Type d'une ligne.
 * @param rows - Lignes (tableau ou itérable asynchrone).
 * @param columns - Colonnes (`defineExportColumns` de `@etiennea20/adr-nest/export`).
 * @param options - Nom de l'onglet, fuseau horaire (`Europe/Paris`), limite de lignes.
 * @returns Les morceaux binaires du fichier `.xlsx`.
 * @throws {@link ExportLimitExceededException} Pendant le flux, au-delà de `maxRows` lignes.
 * @example
 * ```ts
 * return createExportFile(toXlsxExport(books, bookExportColumns, { sheetName: "Catalogue" }), {
 *   format: "xlsx",
 *   fileName: "Catalogue",
 * });
 * ```
 * @since 0.2.0
 */
export async function* toXlsxExport<T>(
  rows: Iterable<T> | AsyncIterable<T>,
  columns: readonly IExportColumn<T>[],
  options: IXlsxExportOptions = {},
): AsyncGenerator<Uint8Array> {
  const timeZone = options.timeZone ?? "Europe/Paris";
  const output: Uint8Array[] = [];
  const zip = new Zip((error, chunk) => {
    if (error) throw error;
    output.push(chunk);
  });
  for (const [path, content] of xlsxStaticParts(sheetName(options.sheetName))) {
    const file = new ZipDeflate(path, { level: 6 });
    zip.add(file);
    file.push(strToU8(content), true);
  }
  const sheet = new ZipDeflate("xl/worksheets/sheet1.xml", { level: 6 });
  zip.add(sheet);
  let buffer = sheetStart(columns.map((column) => column.width)) + headerXml(columns);
  let rowNumber = 1;
  for await (const row of limitExportRows(rows, options.maxRows ?? DEFAULT_EXPORT_MAX_ROWS)) {
    rowNumber += 1;
    buffer += rowXml(row, rowNumber, columns, timeZone);
    if (buffer.length >= FLUSH_SIZE) {
      sheet.push(strToU8(buffer));
      buffer = "";
      yield* output.splice(0);
    }
  }
  sheet.push(strToU8(buffer + sheetEnd(columns.length, rowNumber)), true);
  zip.end();
  yield* output.splice(0);
}
