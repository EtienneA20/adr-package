const REG_EXP_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

/**
 * Échappe les caractères spéciaux des expressions régulières (`. * + ? ^ $ { } ( ) | [ ] \`).
 *
 * À utiliser avant d'insérer un texte non maîtrisé (saisie de recherche, nom de fichier) dans
 * une `RegExp` construite dynamiquement : le texte est alors recherché littéralement
 * (« 3.5 » ne correspond plus à « 345 ») et ne peut pas provoquer d'erreur de syntaxe.
 *
 * @remarks
 * Le résultat est valide avec ou sans l'option `u`. Les tirets ne sont pas échappés : ne pas
 * insérer le résultat à l'intérieur d'une classe de caractères (`[...]`).
 *
 * @param value - Texte à échapper.
 * @returns Le texte avec chaque caractère spécial précédé d'une barre oblique inverse.
 * @example
 * ```ts
 * const pattern = new RegExp(escapeRegExp("Tome 2 (poche)"), "i");
 * pattern.test("tome 2 (poche)"); // true
 * escapeRegExp("1+1=2?"); // "1\\+1=2\\?"
 * ```
 * @since 0.2.0
 */
export function escapeRegExp(value: string): string {
  return value.replace(REG_EXP_SPECIAL_CHARS, "\\$&");
}
