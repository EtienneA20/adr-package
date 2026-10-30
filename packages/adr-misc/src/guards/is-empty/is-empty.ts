import { isPlainObject } from "../is-plain-object";

/**
 * Indique si une valeur est « vide » : `null`, `undefined`, chaîne vide, tableau vide, `Map`
 * ou `Set` vide, ou objet simple sans clé.
 *
 * À utiliser pour savoir s'il y a quelque chose à afficher ou à traiter (liste de résultats,
 * filtres saisis…), quel que soit le type de conteneur.
 *
 * @remarks
 * - Une chaîne composée d'espaces n'est **pas** vide (utiliser `isNonEmptyString`).
 * - Seuls les objets simples (voir `isPlainObject`) sont inspectés, avec `Object.keys` :
 *   une instance de classe (`Date`, entité…) n'est jamais vide.
 * - Les nombres et les booléens (`0`, `false`) ne sont jamais vides.
 *
 * @param value - Valeur à tester.
 * @returns `true` si `value` est vide au sens ci-dessus.
 * @example
 * ```ts
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty(new Map()); // true
 * isEmpty(""); // true
 * isEmpty(" "); // false
 * isEmpty(0); // false
 * ```
 * @since 0.2.0
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  return isPlainObject(value) && Object.keys(value).length === 0;
}
