import { getMimeType } from "../get-mime-type";

/**
 * Indique si un fichier est une image, d'après son extension.
 *
 * À utiliser pour décider d'afficher un aperçu ou une icône générique dans une liste de
 * pièces jointes. Reconnaît les extensions d'image connues de `getMimeType` (`jpg`, `jpeg`,
 * `png`, `gif`, `webp`, `avif`, `svg`, `bmp`, `ico`, `tif`, `tiff`, `heic`), sans tenir compte de
 * la casse. Le contenu du fichier n'est pas examiné.
 *
 * @param fileName - Nom ou chemin du fichier.
 * @returns `true` si l'extension correspond à un type MIME `image/*`, `false` sinon.
 * @example
 * ```ts
 * isImageFile("couverture.WEBP"); // true
 * isImageFile("notice.pdf"); // false
 * ```
 * @since 0.2.0
 */
export function isImageFile(fileName: string): boolean {
  return getMimeType(fileName).startsWith("image/");
}
