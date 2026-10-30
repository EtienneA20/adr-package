/**
 * Retire le modificateur `readonly` des propriétés d'un type objet (sur un seul niveau).
 * Inverse de `Readonly`.
 *
 * À utiliser ponctuellement pour construire une valeur étape par étape avant de l'exposer en
 * lecture seule (builder, réducteur local), ou pour obtenir un tableau modifiable à partir
 * d'un tuple `as const`.
 *
 * @typeParam T - Type objet, tableau ou tuple dont on retire `readonly`.
 * @example
 * ```ts
 * const DEFAULT_LOAN = { days: 21, renewals: 1 } as const;
 * const loan: Mutable<typeof DEFAULT_LOAN> = { ...DEFAULT_LOAN };
 * loan.days = 21; // autorisé
 * type Titles = Mutable<readonly string[]>; // string[]
 * ```
 * @since 0.2.0
 */
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };
