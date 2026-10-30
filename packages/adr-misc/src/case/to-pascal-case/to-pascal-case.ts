import { splitWords } from "../split-words";

/**
 * Convertit un texte en `PascalCase` (`NomDuChamp`).
 *
 * À utiliser pour dériver un nom de composant, de classe ou de type d'un libellé ou d'une clé.
 * Les mots sont découpés comme pour `toCamelCase` (espaces, tirets, underscores, changements de
 * casse, sigles) ; chaque mot commence par une majuscule, le reste est en minuscules. Les
 * accents sont conservés.
 *
 * @param value - Texte à convertir.
 * @returns Le texte en `PascalCase`, ou une chaîne vide s'il ne contient aucun mot.
 * @example
 * ```ts
 * toPascalCase("book-card"); // "BookCard"
 * toPascalCase("XMLHttpRequest"); // "XmlHttpRequest"
 * ```
 * @since 0.2.0
 */
export function toPascalCase(value: string): string {
  return splitWords(value)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}
