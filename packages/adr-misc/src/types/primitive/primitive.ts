/**
 * Union de tous les types primitifs de JavaScript : `string`, `number`, `bigint`, `boolean`,
 * `symbol`, `null` et `undefined`.
 *
 * À utiliser pour accepter n'importe quelle valeur « scalaire » (clé de cache, valeur de
 * filtre, cellule de tableau) ou comme condition d'arrêt dans un type récursif.
 *
 * @example
 * ```ts
 * type FilterValue = Primitive | Date;
 * const filters: Record<string, FilterValue> = { author: "Herbert", available: true };
 * ```
 * @since 0.2.0
 */
export type Primitive = string | number | bigint | boolean | symbol | null | undefined;
