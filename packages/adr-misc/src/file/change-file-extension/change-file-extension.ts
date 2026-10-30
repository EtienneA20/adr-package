import { splitFilePath } from "../split-file-path";

/**
 * Remplace (ou ajoute) l'extension d'un nom ou d'un chemin de fichier.
 *
 * À utiliser pour nommer un fichier converti (export PDF d'un document, miniature WebP d'une
 * image). Le dossier est conservé ; seule la dernière extension est remplacée
 * (`archive.tar.gz` devient `archive.tar.zip`). L'extension peut être donnée avec ou sans
 * point ; une extension vide retire l'extension existante. La casse fournie est conservée.
 *
 * @param fileName - Nom ou chemin du fichier.
 * @param extension - Nouvelle extension (`"pdf"` ou `".pdf"`), ou `""` pour la retirer.
 * @returns Le nom ou chemin avec la nouvelle extension.
 * @example
 * ```ts
 * changeFileExtension("exports/catalogue.docx", "pdf"); // "exports/catalogue.pdf"
 * changeFileExtension("couverture.png", ".webp"); // "couverture.webp"
 * changeFileExtension("LISEZMOI", "md"); // "LISEZMOI.md"
 * changeFileExtension("notes.txt", ""); // "notes"
 * ```
 * @since 0.2.0
 */
export function changeFileExtension(fileName: string, extension: string): string {
  const { directory, stem } = splitFilePath(fileName);
  const normalized = extension.replace(/^\.+/, "");
  return normalized === "" ? `${directory}${stem}` : `${directory}${stem}.${normalized}`;
}
