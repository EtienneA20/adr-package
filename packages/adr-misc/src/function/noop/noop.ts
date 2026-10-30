/**
 * Fonction qui ne fait rien et renvoie `undefined`.
 *
 * À utiliser comme valeur par défaut d'un rappel facultatif (`onChange = noop`), pour éviter
 * un test `if (callback)` à chaque appel, ou pour ignorer volontairement le rejet d'une
 * promesse (`promise.catch(noop)`). Les arguments éventuels sont ignorés.
 *
 * @example
 * ```ts
 * function notifyLate(loans: ILoan[], onNotified: (loan: ILoan) => void = noop): void {
 *   for (const loan of loans) {
 *     sendReminder(loan);
 *     onNotified(loan);
 *   }
 * }
 * ```
 * @since 0.2.0
 */
export function noop(): void {
  // Volontairement vide.
}
