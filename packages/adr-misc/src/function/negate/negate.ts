/**
 * Crée un prédicat qui renvoie l'inverse de `predicate`.
 *
 * À utiliser pour réutiliser un prédicat existant dans un `filter`, `some` ou `every` sans
 * écrire de fonction fléchée (`books.filter(negate(isAvailable))`). Attention : une garde de
 * type (`value is X`) devient un simple prédicat booléen, TypeScript n'affine plus le type.
 *
 * @typeParam TArgs - Types des arguments du prédicat.
 * @param predicate - Prédicat à inverser.
 * @returns Un prédicat de même signature qui renvoie `!predicate(...args)`.
 * @example
 * ```ts
 * const isReturned = (loan: ILoan): boolean => loan.returnedAt !== undefined;
 *
 * const ongoingLoans = loans.filter(negate(isReturned));
 * ```
 * @since 0.2.0
 */
export function negate<TArgs extends unknown[]>(
  predicate: (...args: TArgs) => boolean,
): (...args: TArgs) => boolean {
  return (...args) => !predicate(...args);
}
