import { splitWords } from "../split-words";

/**
 * Convertit un texte en `snake_case` (`nom_du_champ`).
 *
 * À utiliser pour produire une clé attendue par une API ou une base de données en
 * `snake_case` à partir d'une propriété `camelCase`. Les mots sont découpés comme pour
 * `toCamelCase` puis mis en minuscules et reliés par des underscores. Les accents sont
 * conservés.
 *
 * @param value - Texte à convertir.
 * @returns Le texte en `snake_case`, ou une chaîne vide s'il ne contient aucun mot.
 * @example
 * ```ts
 * toSnakeCase("dateDeRetour"); // "date_de_retour"
 * toSnakeCase("userID"); // "user_id"
 * ```
 * @since 0.2.0
 */
export function toSnakeCase(value: string): string {
  return splitWords(value)
    .map((word) => word.toLowerCase())
    .join("_");
}
