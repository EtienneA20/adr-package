import { splitWords } from "../split-words";

/**
 * Convertit un texte en `CONSTANT_CASE` (`UPPER_SNAKE_CASE` : `NOM_DU_CHAMP`).
 *
 * À utiliser pour dériver un nom de constante, une clé d'énumération (`EWeekDay.MONDAY`) ou
 * une variable d'environnement. Les mots sont découpés comme pour `toCamelCase` puis mis en
 * majuscules et reliés par des underscores. Les accents sont conservés.
 *
 * @param value - Texte à convertir.
 * @returns Le texte en `CONSTANT_CASE`, ou une chaîne vide s'il ne contient aucun mot.
 * @example
 * ```ts
 * toConstantCase("maxLoanCount"); // "MAX_LOAN_COUNT"
 * toConstantCase("en retard"); // "EN_RETARD"
 * ```
 * @since 0.2.0
 */
export function toConstantCase(value: string): string {
  return splitWords(value)
    .map((word) => word.toUpperCase())
    .join("_");
}
