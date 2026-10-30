/**
 * Valeur disponible immédiatement ou de façon asynchrone : `T | PromiseLike<T>`.
 *
 * À utiliser pour le type de retour d'un rappel qui peut être synchrone ou asynchrone (hook de
 * validation, chargeur de données) : l'appelant fait `await callback()` dans les deux cas, ou
 * teste le résultat avec `isPromiseLike`.
 *
 * @typeParam T - Type de la valeur produite.
 * @example
 * ```ts
 * type LoanValidator = (loan: ILoan) => MaybePromise<boolean>;
 * const validators: LoanValidator[] = [
 *   (loan) => loan.days <= 21,
 *   async (loan) => isMemberActive(loan.memberId),
 * ];
 * ```
 * @since 0.2.0
 */
export type MaybePromise<T> = T | PromiseLike<T>;
