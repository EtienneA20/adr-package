import { splitWords } from "../split-words";

/**
 * Convertit un texte en `kebab-case` (`nom-du-champ`).
 *
 * À utiliser pour un nom de fichier, une classe CSS, un attribut `data-*` ou un segment d'URL
 * dérivé d'un identifiant. Les mots sont découpés comme pour `toCamelCase` puis mis en
 * minuscules et reliés par des tirets. Les accents sont conservés : pour une URL lisible à
 * partir d'un texte libre, préférer `slugify`.
 *
 * @param value - Texte à convertir.
 * @returns Le texte en `kebab-case`, ou une chaîne vide s'il ne contient aucun mot.
 * @example
 * ```ts
 * toKebabCase("BookCard"); // "book-card"
 * toKebabCase("XMLHttpRequest"); // "xml-http-request"
 * ```
 * @since 0.2.0
 */
export function toKebabCase(value: string): string {
  return splitWords(value)
    .map((word) => word.toLowerCase())
    .join("-");
}
