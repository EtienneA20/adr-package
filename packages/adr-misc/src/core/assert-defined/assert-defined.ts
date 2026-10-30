/**
 * Vérifie qu'une valeur n'est ni `null` ni `undefined` et lève une erreur sinon.
 *
 * À utiliser à la place de `invariant` quand la valeur peut légitimement être « falsy » :
 * `0`, `""`, `false` et `NaN` sont acceptés. TypeScript affine ensuite le type de la valeur
 * (`NonNullable<T>`). Comme `invariant`, réservé aux hypothèses internes, pas à la validation
 * d'une saisie utilisateur.
 *
 * @typeParam T - Type de la valeur vérifiée.
 * @param value - Valeur qui doit être définie.
 * @param message - Message de l'erreur levée si la valeur est absente, en français.
 * @throws {@link Error} Si `value` vaut `null` ou `undefined`.
 * @example
 * ```ts
 * const lateFee = feesByBookId.get(bookId); // number | undefined
 * assertDefined(lateFee, `Pénalité du livre ${bookId} introuvable`);
 * lateFee.toFixed(2); // `lateFee` est un `number`, même s'il vaut 0
 * ```
 * @since 0.2.0
 */
export function assertDefined<T>(value: T, message: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}
