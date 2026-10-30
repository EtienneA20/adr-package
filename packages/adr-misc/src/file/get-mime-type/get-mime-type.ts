import { splitFilePath } from "../split-file-path";

/** Type MIME renvoyé pour une extension inconnue ou absente. */
const DEFAULT_MIME_TYPE = "application/octet-stream";

// Extensions courantes d'une application de gestion (documents, images, audio, vidéo,
// archives, web). Volontairement limitée : ce n'est pas un registre IANA complet.
const MIME_TYPES: Readonly<Record<string, string>> = {
  "7z": "application/x-7z-compressed",
  aac: "audio/aac",
  avif: "image/avif",
  bmp: "image/bmp",
  css: "text/css",
  csv: "text/csv",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  epub: "application/epub+zip",
  gif: "image/gif",
  gz: "application/gzip",
  heic: "image/heic",
  htm: "text/html",
  html: "text/html",
  ico: "image/vnd.microsoft.icon",
  ics: "text/calendar",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  md: "text/markdown",
  mjs: "text/javascript",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mpeg: "video/mpeg",
  odp: "application/vnd.oasis.opendocument.presentation",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odt: "application/vnd.oasis.opendocument.text",
  oga: "audio/ogg",
  ogg: "audio/ogg",
  ogv: "video/ogg",
  otf: "font/otf",
  pdf: "application/pdf",
  png: "image/png",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  rar: "application/vnd.rar",
  rtf: "application/rtf",
  svg: "image/svg+xml",
  tar: "application/x-tar",
  tif: "image/tiff",
  tiff: "image/tiff",
  ttf: "font/ttf",
  txt: "text/plain",
  wav: "audio/wav",
  weba: "audio/webm",
  webm: "video/webm",
  webp: "image/webp",
  woff: "font/woff",
  woff2: "font/woff2",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xml: "application/xml",
  zip: "application/zip",
};

/**
 * Renvoie le type MIME correspondant à l'extension d'un fichier.
 *
 * À utiliser pour renseigner l'en-tête `Content-Type` d'un téléchargement ou le type d'un
 * `Blob` quand seul le nom du fichier est connu. Couvre les extensions courantes (documents
 * bureautiques et OpenDocument, PDF, images, audio, vidéo, polices, archives, web) ; la
 * casse de l'extension est indifférente. Le type est déduit du nom, pas du contenu : ne pas
 * s'en servir comme contrôle de sécurité d'un fichier téléversé.
 *
 * @param fileName - Nom ou chemin du fichier.
 * @returns Le type MIME, ou `"application/octet-stream"` si l'extension est inconnue ou absente.
 * @example
 * ```ts
 * getMimeType("notice.pdf"); // "application/pdf"
 * getMimeType("Couverture.JPG"); // "image/jpeg"
 * getMimeType("donnees.bin"); // "application/octet-stream"
 * ```
 * @since 0.2.0
 */
export function getMimeType(fileName: string): string {
  const extension = (splitFilePath(fileName).extension ?? "").toLowerCase();
  // `Object.hasOwn` écarte les clés héritées (`constructor`, `__proto__`…).
  const mimeType = Object.hasOwn(MIME_TYPES, extension) ? MIME_TYPES[extension] : undefined;
  return mimeType ?? DEFAULT_MIME_TYPE;
}
