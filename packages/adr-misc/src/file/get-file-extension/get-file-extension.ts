import { splitFilePath } from "../split-file-path";

/**
 * Renvoie l'extension d'un fichier, en minuscules et sans le point.
 *
 * À utiliser pour choisir une icône, filtrer des fichiers par type ou contrôler l'extension
 * d'un fichier téléversé. Seule la dernière extension est renvoyée (`archive.tar.gz` donne
 * `gz`) ; un fichier caché sans autre point (`.env`) n'a pas d'extension. Accepte un chemin
 * complet (barre oblique ou barre oblique inverse).
 *
 * @param fileName - Nom ou chemin du fichier.
 * @returns L'extension en minuscules sans point, ou `""` si le fichier n'en a pas.
 * @example
 * ```ts
 * getFileExtension("Couverture.JPG"); // "jpg"
 * getFileExtension("archive.tar.gz"); // "gz"
 * getFileExtension(".env"); // ""
 * ```
 * @since 0.2.0
 */
export function getFileExtension(fileName: string): string {
  return (splitFilePath(fileName).extension ?? "").toLowerCase();
}
