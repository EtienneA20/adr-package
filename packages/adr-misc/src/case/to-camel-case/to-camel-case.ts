import { splitWords } from "../split-words";

/**
 * Convertit un texte en `camelCase` (`nomDuChamp`).
 *
 * À utiliser pour dériver un nom de propriété ou de variable d'un libellé, d'une clé
 * `snake_case` (API, base de données) ou `kebab-case`. Les mots sont découpés sur les espaces,
 * tirets, underscores, ponctuation et changements de casse ; les sigles sont traités comme des
 * mots (`XMLHttpRequest` → `xmlHttpRequest`). Les accents sont conservés : appliquer
 * `removeAccents` avant si l'identifiant doit être en ASCII.
 *
 * @param value - Texte à convertir.
 * @returns Le texte en `camelCase`, ou une chaîne vide s'il ne contient aucun mot.
 * @example
 * ```ts
 * toCamelCase("date_de_retour"); // "dateDeRetour"
 * toCamelCase("XMLHttpRequest"); // "xmlHttpRequest"
 * toCamelCase("Nombre d’emprunts"); // "nombreDEmprunts"
 * ```
 * @since 0.2.0
 */
export function toCamelCase(value: string): string {
  return splitWords(value)
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}
