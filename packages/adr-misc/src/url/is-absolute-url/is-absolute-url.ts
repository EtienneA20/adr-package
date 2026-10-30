// Protocole d'au moins deux caractères suivi de `:` (RFC 3986). Exiger deux caractères écarte
// les chemins Windows (`C:\…`, `C:/…`), aucun protocole réel n'ayant une seule lettre.
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+.-]+:/i;

/**
 * Indique si une chaîne est une URL absolue, c'est-à-dire qui commence par un protocole
 * (`https:`, `mailto:`, `data:`…).
 *
 * À utiliser pour décider s'il faut préfixer un lien par l'URL de base de l'application ou
 * de l'API. Une URL relative au protocole (`//cdn.fr/x.js`), un chemin (`/livres`, `livres`)
 * ou un chemin Windows (`C:\…`) n'est pas absolu. Attention : `localhost:3000` est vu comme
 * une URL absolue de protocole `localhost`, comme le ferait un navigateur.
 *
 * @param value - Chaîne à tester.
 * @returns `true` si `value` commence par un protocole, `false` sinon.
 * @example
 * ```ts
 * isAbsoluteUrl("https://bibliotheque.fr/livres"); // true
 * isAbsoluteUrl("mailto:contact@bibliotheque.fr"); // true
 * isAbsoluteUrl("/livres/42"); // false
 * isAbsoluteUrl("//cdn.bibliotheque.fr/logo.svg"); // false
 * ```
 * @since 0.2.0
 */
export function isAbsoluteUrl(value: string): boolean {
  return ABSOLUTE_URL_PATTERN.test(value);
}
