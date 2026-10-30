/**
 * Options de {@link formatIban}.
 *
 * @example
 * ```ts
 * const options: IFormatIbanOptions = { masked: true };
 * formatIban("FR7630006000011234567890189", options); // "FR76 **** **** **** **** ***0 189"
 * ```
 * @since 0.2.0
 */
export interface IFormatIbanOptions {
  /**
   * Masque l'IBAN par des astérisques, sauf les 4 premiers caractères (pays et clé) et les
   * 4 derniers, pour l'afficher sans l'exposer (récapitulatif de prélèvement, reçu).
   *
   * @defaultValue `false`
   */
  readonly masked?: boolean;
}

/** Nombre de caractères laissés visibles à chaque extrémité d'un IBAN masqué. */
const VISIBLE_EDGE_LENGTH = 4;

/**
 * Remplace par des astérisques les caractères situés entre les extrémités visibles.
 *
 * @param iban - IBAN compact.
 * @returns L'IBAN masqué, inchangé s'il est trop court pour masquer quoi que ce soit.
 */
function maskIban(iban: string): string {
  const hiddenLength = iban.length - 2 * VISIBLE_EDGE_LENGTH;
  if (hiddenLength <= 0) {
    return iban;
  }
  return `${iban.slice(0, VISIBLE_EDGE_LENGTH)}${"*".repeat(hiddenLength)}${iban.slice(-VISIBLE_EDGE_LENGTH)}`;
}

/**
 * Formate un IBAN par groupes de quatre caractères en majuscules, comme sur un RIB :
 * « FR76 3000 6000 0112 3456 7890 189 ».
 *
 * À utiliser pour afficher les coordonnées bancaires d'un adhérent ou d'un fournisseur, quelle
 * que soit la saisie (espaces, tirets, minuscules). Option de masquage pour un affichage
 * partiel.
 *
 * @remarks
 * Ne vérifie ni la longueur ni la clé de contrôle : utiliser une fonction de validation pour un
 * contrôle de saisie.
 *
 * @param iban - IBAN à formater.
 * @param options - Masquage (voir {@link IFormatIbanOptions}).
 * @returns L'IBAN groupé par quatre, ou `""` s'il est absent ou vide.
 * @example
 * ```ts
 * formatIban("fr76 3000-6000 0112 3456 7890 189"); // "FR76 3000 6000 0112 3456 7890 189"
 * formatIban("FR7630006000011234567890189", { masked: true });
 * // "FR76 **** **** **** **** ***0 189"
 * ```
 * @since 0.2.0
 */
export function formatIban(
  iban: string | null | undefined,
  options: IFormatIbanOptions = {},
): string {
  const compact = (iban ?? "").replace(/[\s-]/g, "").toUpperCase();
  const displayed = options.masked === true ? maskIban(compact) : compact;
  return (displayed.match(/.{1,4}/g) ?? []).join(" ");
}
