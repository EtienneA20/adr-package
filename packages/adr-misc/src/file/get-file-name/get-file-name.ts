import { splitFilePath } from "../split-file-path";

/**
 * Renvoie le nom d'un fichier (avec son extension) à partir d'un chemin, sans le dossier.
 *
 * À utiliser pour afficher le nom d'une pièce jointe ou d'un fichier téléversé dont on ne
 * connaît que le chemin. Accepte les barres obliques et obliques inverses comme séparateurs (chemins Unix et Windows) et
 * ignore les séparateurs finaux. N'accède jamais au système de fichiers.
 *
 * @param path - Chemin ou nom de fichier.
 * @returns Le nom du fichier, ou `""` si le chemin est vide.
 * @example
 * ```ts
 * getFileName("/uploads/2026/couverture.jpg"); // "couverture.jpg"
 * getFileName("C:\\Users\\lecteur\\liste.pdf"); // "liste.pdf"
 * ```
 * @since 0.2.0
 */
export function getFileName(path: string): string {
  return splitFilePath(path).name;
}
