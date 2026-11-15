/**
 * Formats d'export : tableau JSON, JSON par ligne (NDJSON), CSV (Excel en français) et XLSX.
 *
 * La valeur sert aussi d'extension de fichier. `xlsx` est produit par
 * `@etiennea20/adr-nest/excel` (peerDependency optionnelle `fflate`).
 *
 * @example
 * ```ts
 * @Get("export")
 * export(@ValidQuery(z.object({ format: z.enum(EExportFormat) })) query: { format: EExportFormat }) {}
 * ```
 * @since 0.2.0
 */
export const EExportFormat = {
  JSON: "json",
  NDJSON: "ndjson",
  CSV: "csv",
  XLSX: "xlsx",
} as const;

/** Valeur possible de {@link EExportFormat}. */
export type EExportFormat = (typeof EExportFormat)[keyof typeof EExportFormat];

/**
 * Type de média (`Content-Type`) de chaque format d'export.
 *
 * @example
 * ```ts
 * EXPORT_CONTENT_TYPES.csv; // "text/csv; charset=utf-8"
 * ```
 * @since 0.2.0
 */
export const EXPORT_CONTENT_TYPES: Readonly<Record<EExportFormat, string>> = Object.freeze({
  json: "application/json; charset=utf-8",
  ndjson: "application/x-ndjson; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});
