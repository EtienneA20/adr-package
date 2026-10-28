/**
 * Vérifie qu'une condition est vraie et lève une erreur sinon.
 *
 * À utiliser pour garantir une hypothèse dont dépend la suite du code (valeur présente,
 * état cohérent…). TypeScript affine ensuite le type de la condition (`asserts condition`).
 * Ne pas l'utiliser pour valider une saisie utilisateur : l'erreur levée est générique.
 *
 * @param condition - Valeur qui doit être vraie (au sens JavaScript, « truthy »).
 * @param message - Message de l'erreur levée si la condition est fausse, en français.
 * @throws {@link Error} Si `condition` est fausse (`false`, `0`, `""`, `null`, `undefined`, `NaN`).
 * @example
 * ```ts
 * const user = users.find((candidate) => candidate.id === id);
 * invariant(user, `Utilisateur ${id} introuvable`);
 * user.name; // `user` n'est plus `undefined`
 * ```
 * @since 0.1.0
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
