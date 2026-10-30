// Premier caractère alphanumérique : la ponctuation d'ouverture (« ¿ ( ") est ignorée.
const FIRST_ALPHANUMERIC = /[\p{L}\p{N}]/u;

/**
 * Met en minuscule la première lettre d'un texte, sans toucher au reste.
 *
 * À utiliser pour insérer un libellé au milieu d'une phrase (« Supprimer le livre » →
 * « Voulez-vous supprimer le livre ? ») ou pour dériver un identifiant `camelCase` d'un nom
 * `PascalCase`. La ponctuation et les espaces de tête sont ignorés, comme pour
 * {@link capitalize}.
 *
 * @param value - Texte à transformer.
 * @returns Le texte avec sa première lettre en minuscule.
 * @example
 * ```ts
 * uncapitalize("Supprimer le livre"); // "supprimer le livre"
 * uncapitalize("ÉLÈVE"); // "éLÈVE"
 * ```
 * @since 0.2.0
 */
export function uncapitalize(value: string): string {
  const index = value.search(FIRST_ALPHANUMERIC);
  if (index === -1) {
    return value;
  }
  return value.slice(0, index) + value.charAt(index).toLowerCase() + value.slice(index + 1);
}
