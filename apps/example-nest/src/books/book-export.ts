import { toXlsxExport } from "@etiennea20/adr-nest/excel";
import {
  EExportFormat,
  type IExportColumn,
  defineExportColumns,
  toCsvExport,
  toJsonExport,
  toNdjsonExport,
} from "@etiennea20/adr-nest/export";
import { z } from "zod";

import type { IBook } from "./book";

// #region columns
// Liste blanche de ce qui sort de l'application : jamais l'emprunteur ni les notes internes.
export const bookExportColumns = defineExportColumns<IBook>([
  { key: "title", header: "Titre", width: 40 },
  { key: "authorName", header: "Auteur", width: 25 },
  {
    key: "status",
    header: "Statut",
    value: (book) => (book.status === "available" ? "Disponible" : "Emprunté"),
  },
  { key: "publishedAt", header: "Publication", type: "date" },
  { key: "id", header: "Identifiant", trusted: true },
]);
// #endregion columns

export const exportQuerySchema = z.object({ format: z.enum(EExportFormat).default("xlsx") });
export type ExportQuery = z.output<typeof exportQuerySchema>;

// #region stream
export function bookExportStream(
  format: EExportFormat,
  books: readonly IBook[],
  columns: readonly IExportColumn<IBook>[],
): AsyncIterable<string | Uint8Array> {
  switch (format) {
    case "xlsx":
      return toXlsxExport(books, columns, { sheetName: "Catalogue" });
    case "csv":
      return toCsvExport(books, columns);
    case "ndjson":
      return toNdjsonExport(books, columns);
    default:
      return toJsonExport(books, columns);
  }
}
// #endregion stream
