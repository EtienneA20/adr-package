/**
 * Promesse dont la résolution et le rejet sont pilotés de l'extérieur, renvoyée par
 * {@link createDeferred}.
 *
 * @typeParam T - Type de la valeur de résolution.
 * @example
 * ```ts
 * const confirmation: IDeferred<boolean> = createDeferred<boolean>();
 * confirmation.resolve(true);
 * await confirmation.promise; // true
 * ```
 * @since 0.2.0
 */
export interface IDeferred<T> {
  /** Promesse réglée par `resolve` ou `reject`. */
  readonly promise: Promise<T>;
  /** Résout la promesse avec une valeur (sans effet si elle est déjà réglée). */
  readonly resolve: (value: T | PromiseLike<T>) => void;
  /** Rejette la promesse avec une raison (sans effet si elle est déjà réglée). */
  readonly reject: (reason?: unknown) => void;
}

/**
 * Crée une promesse avec ses fonctions `resolve` et `reject` exposées.
 *
 * À utiliser quand la promesse est réglée par un code distinct de celui qui la crée : réponse
 * attendue d'une fenêtre de confirmation, événement d'un autre composant, file d'attente,
 * synchronisation dans un test. Pour envelopper une API à rappel, préférer `new Promise`.
 *
 * @typeParam T - Type de la valeur de résolution.
 * @returns Un objet `{ promise, resolve, reject }`.
 * @example
 * ```ts
 * function askConfirmation(message: string): Promise<boolean> {
 *   const deferred = createDeferred<boolean>();
 *   openDialog({
 *     message,
 *     onConfirm: () => deferred.resolve(true),
 *     onCancel: () => deferred.resolve(false),
 *   });
 *   return deferred.promise;
 * }
 *
 * if (await askConfirmation("Prolonger l'emprunt de 15 jours ?")) {
 *   await extendLoan(loanId);
 * }
 * ```
 * @since 0.2.0
 */
export function createDeferred<T>(): IDeferred<T> {
  // L'exécuteur de `new Promise` est appelé de façon synchrone : les deux champs sont remplis
  // avant le `return`.
  const settlers = {} as { -readonly [K in "resolve" | "reject"]: IDeferred<T>[K] };
  const promise = new Promise<T>((resolve, reject) => {
    settlers.resolve = resolve;
    settlers.reject = reject;
  });
  return { promise, resolve: settlers.resolve, reject: settlers.reject };
}
