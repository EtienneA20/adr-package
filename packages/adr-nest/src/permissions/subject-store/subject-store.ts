// Sujet résolu par le guard, rangé par requête pour `CurrentSubject` (décorateur de paramètre,
// sans accès à l'injection de dépendances). Une WeakMap n'ajoute aucune propriété à l'objet
// requête et le sujet disparaît avec elle.
const subjects = new WeakMap<object, unknown>();

/**
 * Associe le sujet résolu à la requête.
 *
 * @param request - Objet requête.
 * @param subject - Sujet résolu (`null` si anonyme).
 * @example
 * ```ts
 * storeSubject(request, member);
 * ```
 * @internal
 */
export function storeSubject(request: object, subject: unknown): void {
  subjects.set(request, subject);
}

/**
 * Sujet associé à la requête.
 *
 * @param request - Objet requête.
 * @returns Le sujet, ou `null` si aucun.
 * @example
 * ```ts
 * readSubject(request); // member
 * ```
 * @internal
 */
export function readSubject(request: object): unknown {
  return subjects.get(request) ?? null;
}
