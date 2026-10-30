import { splitFilePath } from "../split-file-path";

/**
 * Renvoie le nom d'un fichier sans son dossier ni sa dernière extension.
 *
 * À utiliser pour proposer un titre par défaut à partir d'un fichier téléversé
 * (`rapport-2026.pdf` donne `rapport-2026`) ou pour construire un nom dérivé. Accepte les barres
 * obliques et obliques inverses comme séparateurs. Seule la dernière extension est retirée (`archive.tar.gz` donne
 * `archive.tar`) ; un fichier caché (`.env`) est renvoyé tel quel.
 *
 * @param path - Chemin ou nom du fichier.
 * @returns Le nom sans dossier ni extension, ou `""` si le chemin est vide.
 * @example
 * ```ts
 * getFileBaseName("/uploads/2026/couverture.jpg"); // "couverture"
 * getFileBaseName("C:\\Documents\\archive.tar.gz"); // "archive.tar"
 * getFileBaseName(".env"); // ".env"
 * ```
 * @since 0.2.0
 */
export function getFileBaseName(path: string): string {
  return splitFilePath(path).stem;
}
