/**
 * Options de {@link formatPhoneNumber}.
 *
 * @example
 * ```ts
 * const options: IFormatPhoneNumberOptions = { international: true };
 * formatPhoneNumber("06 12 34 56 78", options); // "+33 6 12 34 56 78"
 * ```
 * @since 0.2.0
 */
export interface IFormatPhoneNumberOptions {
  /**
   * `true` impose le format international (« +33 6 12 34 56 78 »), `false` le format national
   * (« 06 12 34 56 78 »).
   *
   * @defaultValue celui de la saisie
   */
  readonly international?: boolean;
}

/**
 * Numéro français : indicatif `+33`, `0033` ou `0`, puis 9 chiffres dont le premier n'est pas
 * nul. Le groupe capture ces 9 chiffres.
 */
const FRENCH_PHONE_PATTERN = /^(?:\+33|0033|0)([1-9]\d{8})$/;

/** Longueur d'un numéro français au format national, sans séparateurs. */
const NATIONAL_LENGTH = 10;

/** Séparateurs tolérés dans la saisie. */
const SEPARATORS_PATTERN = /[\s.\-/]/g;

/**
 * Regroupe des chiffres par deux.
 *
 * @param digits - Chiffres, en nombre pair.
 * @returns Les paires séparées par une espace.
 */
function pairs(digits: string): string {
  return (digits.match(/\d{2}/g) ?? []).join(" ");
}

/**
 * Formate un numéro de téléphone français par paires de chiffres : « 06 12 34 56 78 » ou
 * « +33 6 12 34 56 78 ».
 *
 * À utiliser pour afficher le numéro d'un adhérent, quelle que soit sa saisie (espaces, points,
 * tirets, `+33`, `0033`, `(0)`). Un numéro non reconnu (étranger, incomplet, outre-mer avec un
 * autre indicatif) est renvoyé tel quel, sans les espaces autour, pour ne rien perdre.
 *
 * @remarks
 * Ne valide pas l'existence du numéro : utiliser une fonction de validation pour un contrôle de
 * saisie.
 *
 * @param phone - Numéro à formater.
 * @param options - Format national ou international (voir {@link IFormatPhoneNumberOptions}).
 * @returns Le numéro formaté, la saisie sans espaces autour si elle n'est pas reconnue, ou `""`
 *   si elle est absente.
 * @example
 * ```ts
 * formatPhoneNumber("0612345678"); // "06 12 34 56 78"
 * formatPhoneNumber("+33 (0)6.12.34.56.78"); // "+33 6 12 34 56 78"
 * formatPhoneNumber("+33612345678", { international: false }); // "06 12 34 56 78"
 * formatPhoneNumber("+44 20 7946 0958"); // "+44 20 7946 0958"
 * ```
 * @since 0.2.0
 */
export function formatPhoneNumber(
  phone: string | null | undefined,
  options: IFormatPhoneNumberOptions = {},
): string {
  const trimmed = (phone ?? "").trim();
  const compact = trimmed.replace("(0)", "").replace(SEPARATORS_PATTERN, "");
  const digits = FRENCH_PHONE_PATTERN.exec(compact)?.[1];
  if (digits === undefined) {
    return trimmed;
  }
  // La forme nationale (« 0612345678 ») compte 10 caractères ; « +33… » et « 0033… » davantage.
  const international = options.international ?? compact.length !== NATIONAL_LENGTH;
  return international
    ? `+33 ${digits.slice(0, 1)} ${pairs(digits.slice(1))}`
    : pairs(`0${digits}`);
}
