import type { Primitive } from "../primitive";

/**
 * Rend toutes les propriétés d'un type en lecture seule, récursivement (objets, tableaux,
 * tuples, `Map` et `Set`).
 *
 * À utiliser pour exposer un état ou une configuration qui ne doit jamais être modifié(e) par
 * l'appelant (constantes de référence, état d'un store).
 *
 * @remarks
 * - Les tableaux deviennent `readonly T[]`, les `Map` des `ReadonlyMap`, les `Set` des
 *   `ReadonlySet`.
 * - Les primitives, les fonctions, `Date`, `RegExp` et les promesses sont conservés tels
 *   quels (une `Date` reste modifiable par ses méthodes).
 * - Purement statique : utiliser `Object.freeze` en plus pour une garantie à l'exécution.
 *
 * @typeParam T - Type à rendre en lecture seule.
 * @example
 * ```ts
 * interface ICatalog {
 *   genres: string[];
 *   shelves: { code: string; capacity: number }[];
 * }
 * declare const catalog: DeepReadonly<ICatalog>;
 * catalog.genres.push("Polar"); // erreur : `push` n'existe pas sur readonly string[]
 * catalog.shelves[0].capacity = 10; // erreur : propriété en lecture seule
 * ```
 * @since 0.2.0
 */
export type DeepReadonly<T> = T extends
  Primitive | Date | RegExp | ((...args: never[]) => unknown) | PromiseLike<unknown>
  ? T
  : T extends ReadonlyMap<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends ReadonlySet<infer V>
      ? ReadonlySet<DeepReadonly<V>>
      : { readonly [K in keyof T]: DeepReadonly<T[K]> };
