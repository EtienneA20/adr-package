import type { Primitive } from "../primitive";

/**
 * Rend facultatives toutes les propriétés d'un type objet, récursivement.
 *
 * À utiliser pour un patch partiel d'un objet imbriqué (configuration, données de test,
 * formulaire en cours de saisie) avant de le fusionner avec des valeurs par défaut.
 *
 * @remarks
 * - Les éléments des tableaux et des tuples deviennent eux-mêmes partiels, sans devenir
 *   facultatifs (`DeepPartial<IBook[]>` donne `DeepPartial<IBook>[]`).
 * - Les primitives, les fonctions, `Date`, `RegExp`, `Map`, `Set` et les promesses sont
 *   conservés tels quels.
 *
 * @typeParam T - Type à rendre partiel.
 * @example
 * ```ts
 * interface ILibrarySettings {
 *   loans: { maxDays: number; maxRenewals: number };
 *   opening: { days: number[]; from: string; to: string };
 * }
 * const override: DeepPartial<ILibrarySettings> = { loans: { maxDays: 28 } };
 * ```
 * @since 0.2.0
 */
export type DeepPartial<T> = T extends
  | Primitive
  | Date
  | RegExp
  | ((...args: never[]) => unknown)
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>
  | PromiseLike<unknown>
  ? T
  : T extends readonly unknown[]
    ? { [K in keyof T]: DeepPartial<T[K]> }
    : { [K in keyof T]?: DeepPartial<T[K]> };
