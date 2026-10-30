/**
 * Options de {@link maskString}.
 *
 * @example
 * ```ts
 * const options: IMaskStringOptions = { visibleStart: 4, visibleEnd: 3, preserve: " " };
 * maskString("FR76 3000 6000 0112 3456 7890 189", options);
 * // "FR76 **** **** **** **** **** 189"
 * ```
 * @since 0.2.0
 */
export interface IMaskStringOptions {
  /**
   * Nombre de caractères laissés visibles au début.
   *
   * @defaultValue `0`
   */
  visibleStart?: number;
  /**
   * Nombre de caractères laissés visibles à la fin.
   *
   * @defaultValue `4`
   */
  visibleEnd?: number;
  /**
   * Caractère (ou texte) qui remplace chaque caractère masqué.
   *
   * @defaultValue `"*"`
   */
  maskChar?: string;
  /**
   * Caractères jamais masqués, pour garder la forme de la valeur (espaces d'un IBAN, `@` et
   * `.` d'un e-mail…). Ils comptent tout de même dans `visibleStart` et `visibleEnd`.
   *
   * @defaultValue `""` (tout est masqué)
   */
  preserve?: string;
}

/**
 * Vérifie qu'un nombre de caractères visibles est un entier positif ou nul.
 *
 * @param name - Nom de l'option, pour le message d'erreur.
 * @param value - Valeur à vérifier.
 * @throws {@link RangeError} Si la valeur n'est pas un entier positif ou nul.
 */
function assertCount(name: string, value: number): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(
      `L'option « ${name} » doit être un entier positif ou nul (reçu : ${value}).`,
    );
  }
}

/**
 * Masque une valeur sensible en ne laissant visibles que quelques caractères au début et à la
 * fin.
 *
 * À utiliser pour afficher une donnée confidentielle de façon reconnaissable sans la révéler :
 * IBAN, numéro de carte, numéro de sécurité sociale, téléphone, e-mail. Par défaut, seuls les
 * 4 derniers caractères restent visibles. Les caractères sont comptés par point de code
 * (un emoji compte pour un). Si `visibleStart + visibleEnd` couvre toute la valeur, elle est
 * renvoyée en clair.
 *
 * @remarks
 * Masquer à l'affichage ne protège pas la donnée : elle reste présente en clair là où elle a
 * été chargée. Masquer côté serveur si le client ne doit pas la connaître.
 *
 * @param value - Valeur à masquer.
 * @param options - Options : `visibleStart`, `visibleEnd`, `maskChar` et `preserve`.
 * @returns La valeur masquée.
 * @throws {@link RangeError} Si `visibleStart` ou `visibleEnd` n'est pas un entier positif ou
 * nul.
 * @example
 * ```ts
 * maskString("4970101234567890"); // "************7890"
 * maskString("jean.dupont@exemple.fr", { visibleStart: 2, visibleEnd: 11, preserve: "@." });
 * // "je**.******@exemple.fr"
 * maskString("0612345678", { visibleStart: 2, visibleEnd: 2, maskChar: "•" }); // "06••••••78"
 * ```
 * @since 0.2.0
 */
export function maskString(value: string, options: IMaskStringOptions = {}): string {
  const { visibleStart = 0, visibleEnd = 4, maskChar = "*", preserve = "" } = options;
  assertCount("visibleStart", visibleStart);
  assertCount("visibleEnd", visibleEnd);
  const chars = Array.from(value);
  const hiddenEnd = chars.length - visibleEnd;
  return chars
    .map((char, index) => {
      const visible = index < visibleStart || index >= hiddenEnd || preserve.includes(char);
      return visible ? char : maskChar;
    })
    .join("");
}
