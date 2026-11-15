import { escapeSpreadsheetFormula } from "@etiennea20/adr-misc";

import type { IExportColumn } from "../export-columns";
import type { ExportCellValue } from "../read-export-cell";

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string, withTime: boolean): Intl.DateTimeFormat {
  const key = `${timeZone}|${String(withTime)}`;
  let cached = formatters.get(key);
  if (!cached) {
    cached = new Intl.DateTimeFormat("fr-FR", {
      timeZone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
    formatters.set(key, cached);
  }
  return cached;
}

/**
 * Prépare une cellule pour le CSV : dates au format français dans le fuseau donné (`31/01/2026`,
 * `31/01/2026 10:00`), booléens en `oui` / `non`, nombres laissés tels quels (virgule décimale
 * posée par `toCsv`), textes neutralisés contre l'injection de formules sauf colonne `trusted`.
 *
 * @param value - Valeur convertie de la cellule.
 * @param column - Colonne de la cellule.
 * @param timeZone - Fuseau horaire des dates.
 * @returns La valeur à écrire, ou `null` pour une cellule vide.
 * @example
 * ```ts
 * formatCsvCell(new Date("2026-01-31T10:00:00Z"), { key: "at", header: "À", type: "datetime" }, "Europe/Paris");
 * // "31/01/2026 11:00"
 * ```
 * @internal
 */
export function formatCsvCell<T>(
  value: ExportCellValue,
  column: IExportColumn<T>,
  timeZone: string,
): string | number | null {
  if (value instanceof Date) return formatter(timeZone, column.type === "datetime").format(value);
  if (typeof value === "boolean") return value ? "oui" : "non";
  if (typeof value === "string" && !column.trusted) return escapeSpreadsheetFormula(value);
  return value;
}
