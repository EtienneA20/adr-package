// Premier caractère alphanumérique : la ponctuation d'ouverture (« ¿ ( ") est ignorée.
const FIRST_ALPHANUMERIC = /[\p{L}\p{N}]/u;

/**
 * Options de {@link capitalize}.
 *
 * @example
 * ```ts
 * const options: ICapitalizeOptions = { lowerRest: true };
 * capitalize("DUPONT", options); // "Dupont"
 * ```
 * @since 0.2.0
 */
export interface ICapitalizeOptions {
  /**
   * Met aussi le reste du texte en minuscules (utile pour un nom saisi en majuscules).
   *
   * @defaultValue `false`
   */
  lowerRest?: boolean;
}

/**
 * Met en majuscule la première lettre d'un texte, sans toucher au reste (sauf option).
 *
 * À utiliser pour afficher un libellé, un nom ou une phrase commençant par une majuscule.
 * La ponctuation et les espaces de tête sont ignorés : la majuscule porte sur le premier
 * caractère alphanumérique (« « bonjour » » → « « Bonjour » »). Si ce caractère est un chiffre,
 * rien n'est mis en majuscule (« 1er janvier » reste inchangé).
 *
 * @param value - Texte à transformer.
 * @param options - Options : `lowerRest` pour mettre le reste en minuscules.
 * @returns Le texte avec sa première lettre en majuscule.
 * @example
 * ```ts
 * capitalize("œuvres complètes"); // "Œuvres complètes"
 * capitalize("élodie"); // "Élodie"
 * capitalize("JEAN", { lowerRest: true }); // "Jean"
 * ```
 * @since 0.2.0
 */
export function capitalize(value: string, options: ICapitalizeOptions = {}): string {
  const { lowerRest = false } = options;
  const index = value.search(FIRST_ALPHANUMERIC);
  if (index === -1) {
    return lowerRest ? value.toLowerCase() : value;
  }
  const rest = value.slice(index + 1);
  return (
    value.slice(0, index) +
    value.charAt(index).toUpperCase() +
    (lowerRest ? rest.toLowerCase() : rest)
  );
}
