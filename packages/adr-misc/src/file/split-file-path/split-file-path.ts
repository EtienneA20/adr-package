/**
 * Parties d'un chemin de fichier découpé par {@link splitFilePath}.
 *
 * @internal
 */
export interface IFilePathParts {
  /** Dossier, séparateur final compris (`"docs/"`), ou `""`. */
  directory: string;
  /** Nom du fichier avec son extension (`"rapport.pdf"`). */
  name: string;
  /** Nom du fichier sans la dernière extension (`"rapport"`, `".env"`). */
  stem: string;
  /** Dernière extension sans le point, casse d'origine ; `undefined` si le nom n'en a pas. */
  extension: string | undefined;
}

/**
 * Découpe un chemin en dossier, nom, radical et extension, avec la barre oblique ou la barre oblique inverse comme séparateur.
 *
 * Partagé par les fonctions de la catégorie `file` pour qu'elles appliquent toutes les mêmes
 * règles : séparateurs finaux ignorés, fichier caché (`.env`) sans extension, nom composé
 * uniquement de points (`..`) sans extension.
 *
 * @param path - Chemin ou nom de fichier.
 * @returns Les parties du chemin.
 * @internal
 */
export function splitFilePath(path: string): IFilePathParts {
  const trimmed = path.replace(/[/\\]+$/, "");
  const separatorIndex = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
  const directory = trimmed.slice(0, separatorIndex + 1);
  const name = trimmed.slice(separatorIndex + 1);
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex <= 0 || /^\.+$/.test(name)) {
    return { directory, name, stem: name, extension: undefined };
  }
  return { directory, name, stem: name.slice(0, dotIndex), extension: name.slice(dotIndex + 1) };
}
