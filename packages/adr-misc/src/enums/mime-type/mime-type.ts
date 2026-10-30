/**
 * Types MIME courants (en-têtes `Content-Type` et `Accept`, attribut `accept` d'un champ
 * fichier, exports).
 *
 * À utiliser à la place des chaînes longues et faciles à mal recopier (XLSX, DOCX…).
 *
 * @example
 * ```ts
 * headers["Content-Type"] = EMimeType.JSON; // "application/json"
 * new Blob([buffer], { type: EMimeType.XLSX });
 * ```
 * @since 0.2.0
 */
export const EMimeType = {
  JSON: "application/json",
  XML: "application/xml",
  PDF: "application/pdf",
  ZIP: "application/zip",
  OCTET_STREAM: "application/octet-stream",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  FORM_DATA: "multipart/form-data",
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ODS: "application/vnd.oasis.opendocument.spreadsheet",
  ODT: "application/vnd.oasis.opendocument.text",
  CSV: "text/csv",
  TEXT: "text/plain",
  HTML: "text/html",
  PNG: "image/png",
  JPEG: "image/jpeg",
  GIF: "image/gif",
  WEBP: "image/webp",
  SVG: "image/svg+xml",
} as const;

/** Valeur possible de {@link EMimeType}. */
export type EMimeType = (typeof EMimeType)[keyof typeof EMimeType];
