/**
 * Indique si une clé est une propriété **propre** d'un objet, et affine son type en
 * `keyof T`.
 *
 * À utiliser pour indexer un objet avec une clé venue de l'extérieur (paramètre d'URL, saisie)
 * sans conversion de type : après le test, `object[key]` est typé correctement.
 *
 * @remarks
 * Le test utilise `Object.hasOwn` : les propriétés héritées (`toString`, `constructor`…) sont
 * exclues, ce qui évite qu'une clé comme `"__proto__"` soit acceptée par erreur.
 *
 * @typeParam T - Type de l'objet.
 * @param object - Objet dans lequel chercher la clé.
 * @param key - Clé à tester.
 * @returns `true` si `object` possède en propre la propriété `key`.
 * @example
 * ```ts
 * const LABELS = { borrowed: "Emprunté", available: "Disponible" };
 * const status: string = request.query.status;
 * if (isKeyOf(LABELS, status)) {
 *   LABELS[status]; // string, sans erreur de typage
 * }
 * isKeyOf(LABELS, "toString"); // false
 * ```
 * @since 0.2.0
 */
export function isKeyOf<T extends object>(object: T, key: PropertyKey): key is keyof T {
  return Object.hasOwn(object, key);
}
