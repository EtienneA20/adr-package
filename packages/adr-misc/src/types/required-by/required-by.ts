import type { Prettify } from "../prettify";

/**
 * Rend obligatoires certaines propriétés facultatives d'un type objet, les autres restant
 * inchangées.
 *
 * À utiliser après une étape qui garantit la présence de champs facultatifs (valeurs par
 * défaut appliquées, relation chargée depuis la base).
 *
 * @remarks
 * `undefined` est retiré du type des propriétés concernées (comme avec `Required`). Ne se
 * distribue pas sur une union.
 *
 * @typeParam T - Type objet de départ.
 * @typeParam K - Clés de `T` à rendre obligatoires.
 * @example
 * ```ts
 * interface IMember {
 *   id: string;
 *   email?: string;
 *   phone?: string;
 * }
 * type ContactableMember = RequiredBy<IMember, "email">;
 * // { id: string; phone?: string; email: string }
 * ```
 * @since 0.2.0
 */
export type RequiredBy<T, K extends keyof T> = Prettify<Omit<T, K> & Required<Pick<T, K>>>;
