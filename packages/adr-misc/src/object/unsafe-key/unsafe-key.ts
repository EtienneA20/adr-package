/**
 * Clés qui permettent d'atteindre ou de remplacer un prototype : les écrire à partir de données
 * externes (JSON, formulaire) ouvre la porte à la pollution de prototype.
 */
const UNSAFE_KEYS: ReadonlySet<string> = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Indique si une clé est dangereuse à écrire (`__proto__`, `constructor`, `prototype`).
 *
 * @param key - Clé ou segment de chemin.
 * @returns `true` si la clé doit être refusée ou ignorée.
 * @internal
 */
export function isUnsafeKey(key: string): boolean {
  return UNSAFE_KEYS.has(key);
}
