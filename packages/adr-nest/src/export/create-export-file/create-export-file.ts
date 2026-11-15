import { Readable } from "node:stream";

import { sanitizeFileName } from "@etiennea20/adr-misc";
import { Header, StreamableFile, applyDecorators } from "@nestjs/common";

import { EXPORT_CONTENT_TYPES, type EExportFormat } from "../export-format";

/**
 * Options de `createExportFile`.
 *
 * @example
 * ```ts
 * const options: IExportFileOptions = { format: "xlsx", fileName: "Catalogue 2026" };
 * ```
 * @since 0.2.0
 */
export interface IExportFileOptions {
  /** Format du fichier : fixe le `Content-Type` et l'extension. */
  readonly format: EExportFormat;
  /** Nom du fichier proposé au téléchargement (texte libre, assaini ; extension ajoutée). */
  readonly fileName: string;
}

function encodeRfc5987(value: string): string {
  return encodeURIComponent(value).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/**
 * Construit l'en-tête `Content-Disposition` d'un téléchargement à partir d'un nom libre.
 *
 * Le nom est assaini (`sanitizeFileName` : caractères interdits, retours à la ligne et
 * guillemets remplacés, noms réservés Windows), puis écrit deux fois : `filename` en ASCII
 * (accents retirés, pour les anciens clients) et `filename*` en UTF-8 encodé (RFC 6266 et
 * 5987). Aucun texte saisi ne peut donc injecter un en-tête ou un chemin.
 *
 * @param fileName - Nom du fichier, extension comprise.
 * @returns La valeur de l'en-tête (`attachment; filename="…"; filename*=UTF-8''…`).
 * @example
 * ```ts
 * contentDisposition("Prêts \"en retard\".csv");
 * // `attachment; filename="Prets _en retard_.csv"; filename*=UTF-8''Pr%C3%AAts%20_en%20retard_.csv`
 * ```
 * @since 0.2.0
 */
export function contentDisposition(fileName: string): string {
  const safe = sanitizeFileName(fileName) || "export";
  const ascii = safe
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, "_")
    .replace(/["\\]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeRfc5987(safe)}`;
}

/**
 * Crée la réponse NestJS d'un export : `StreamableFile` en flux, avec `Content-Type` et
 * `Content-Disposition` (nom assaini, extension du format ajoutée si absente).
 *
 * À renvoyer depuis la route (Express et Fastify). Les données passent en flux, sans être
 * chargées en mémoire. Une erreur pendant le flux (limite dépassée, base indisponible)
 * interrompt le téléchargement : vérifier la taille avant (`assertExportSize`). Ajouter
 * `@ExportHeaders()` sur la route pour `nosniff` et `no-store`.
 *
 * @param stream - Contenu du fichier (`toJsonExport`, `toCsvExport`, `toXlsxExport`…).
 * @param options - Format et nom du fichier.
 * @returns Le fichier à renvoyer par la route.
 * @example
 * ```ts
 * @Get("export.csv")
 * @ExportHeaders()
 * export(): StreamableFile {
 *   return createExportFile(toCsvExport(this.books.findAll(), bookExportColumns), {
 *     format: "csv",
 *     fileName: "Catalogue",
 *   });
 * }
 * ```
 * @since 0.2.0
 */
export function createExportFile(
  stream: AsyncIterable<string | Uint8Array>,
  options: IExportFileOptions,
): StreamableFile {
  const extension = `.${options.format}`;
  const fileName = options.fileName.toLowerCase().endsWith(extension)
    ? options.fileName
    : `${options.fileName}${extension}`;
  return new StreamableFile(Readable.from(stream), {
    type: EXPORT_CONTENT_TYPES[options.format],
    disposition: contentDisposition(fileName),
  });
}

/**
 * Décorateur de route d'export : en-têtes `X-Content-Type-Options: nosniff` (le navigateur
 * n'interprète pas le fichier autrement que son type) et `Cache-Control: no-store` (données
 * personnelles non conservées par les caches).
 *
 * @returns Un décorateur de méthode.
 * @example
 * ```ts
 * @Get("export")
 * @ExportHeaders()
 * export() {
 *   return createExportFile(stream, { format: "xlsx", fileName: "Catalogue" });
 * }
 * ```
 * @since 0.2.0
 */
export function ExportHeaders(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    Header("X-Content-Type-Options", "nosniff"),
    Header("Cache-Control", "no-store"),
  );
}
