/** Saisies reconnues comme vraies (en minuscules, sans espaces autour). */
const TRUE_VALUES: ReadonlySet<string> = new Set([
  "true",
  "vrai",
  "oui",
  "yes",
  "o",
  "y",
  "1",
  "on",
]);

/** Saisies reconnues comme fausses (en minuscules, sans espaces autour). */
const FALSE_VALUES: ReadonlySet<string> = new Set(["false", "faux", "non", "no", "n", "0", "off"]);

/**
 * Convertit une saisie en booléen.
 *
 * À utiliser pour lire une case à cocher exportée, une colonne « Oui/Non » d'un fichier CSV,
 * un paramètre de requête ou une variable de configuration. Reconnaît, sans tenir compte de la
 * casse ni des espaces autour : `true`/`false`, `vrai`/`faux`, `oui`/`non`, `yes`/`no`,
 * `o`/`n`, `y`/`n`, `1`/`0`, `on`/`off`.
 *
 * @remarks
 * Convention des fonctions `parse*` : une saisie non reconnue renvoie `undefined` (pas
 * d'erreur). Pour une valeur par défaut : `parseBoolean(saisie) ?? false`.
 *
 * @param value - Saisie à convertir. Un booléen est renvoyé tel quel ; les nombres `1` et `0`
 *   sont acceptés.
 * @returns Le booléen, ou `undefined` si la saisie n'est pas reconnue.
 * @example
 * ```ts
 * parseBoolean("Oui"); // true
 * parseBoolean(" off "); // false
 * parseBoolean(1); // true
 * parseBoolean("peut-être"); // undefined
 * ```
 * @since 0.2.0
 */
export function parseBoolean(
  value: string | number | boolean | null | undefined,
): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (TRUE_VALUES.has(normalized)) {
    return true;
  }
  return FALSE_VALUES.has(normalized) ? false : undefined;
}
