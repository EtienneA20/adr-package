/**
 * Union des types des valeurs d'un objet, ou des éléments d'un tableau ou d'un tuple.
 *
 * À utiliser pour dériver le type des valeurs d'un objet `as const` (pendant de `keyof`) : par
 * exemple les valeurs d'une énumération `E…` ou d'une table de libellés.
 *
 * @typeParam T - Objet, tableau ou tuple dont on veut les valeurs.
 * @example
 * ```ts
 * const LOAN_STATUS = { BORROWED: "borrowed", RETURNED: "returned" } as const;
 * type LoanStatus = ValueOf<typeof LOAN_STATUS>; // "borrowed" | "returned"
 * type Title = ValueOf<readonly ["Dune", "Fondation"]>; // "Dune" | "Fondation"
 * ```
 * @since 0.2.0
 */
export type ValueOf<T> = T extends readonly unknown[] ? T[number] : T[keyof T];
