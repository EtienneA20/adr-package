import type { Prettify } from "../prettify";

/**
 * Rend facultatives certaines propriétés d'un type objet, les autres restant inchangées.
 *
 * À utiliser pour le type d'entrée d'une fonction de création, quand certains champs ont une
 * valeur par défaut (identifiant généré, date du jour…).
 *
 * @remarks
 * Ne se distribue pas sur une union : appliquer le type à chaque membre si besoin.
 *
 * @typeParam T - Type objet de départ.
 * @typeParam K - Clés de `T` à rendre facultatives.
 * @example
 * ```ts
 * interface ILoan {
 *   id: string;
 *   bookId: string;
 *   borrowedAt: Date;
 * }
 * type LoanInput = PartialBy<ILoan, "id" | "borrowedAt">;
 * // { bookId: string; id?: string; borrowedAt?: Date }
 * ```
 * @since 0.2.0
 */
export type PartialBy<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>;
