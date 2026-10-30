/**
 * Décale la virgule d'un nombre en passant par la notation exponentielle (`"1.005e2"`).
 *
 * Multiplier par `10 ** n` ferait apparaître l'erreur de représentation binaire
 * (`1.005 * 100 === 100.49999999999999`) ; la chaîne repart de la représentation décimale la
 * plus courte du nombre, celle que l'utilisateur a saisie.
 *
 * @param value - Nombre positif fini à décaler.
 * @param exponent - Nombre de rangs (positif : multiplie, négatif : divise).
 * @returns Le nombre multiplié par `10 ** exponent`.
 */
function shiftDecimal(value: number, exponent: number): number {
  const [mantissa = "", currentExponent = "0"] = String(value).split("e");
  return Number(`${mantissa}e${Number(currentExponent) + exponent}`);
}

/**
 * Arrondit un nombre à un nombre de décimales donné, sans les erreurs de l'arithmétique
 * flottante (`round(1.005, 2)` vaut bien `1.01`).
 *
 * À utiliser avant d'afficher ou de stocker un montant, une moyenne ou un pourcentage. Les
 * demis sont arrondis en s'éloignant de zéro (`round(-2.5)` vaut `-3`), comme l'arrondi
 * commercial et `Intl.NumberFormat`. Un nombre de décimales négatif arrondit aux dizaines,
 * centaines…
 *
 * @param value - Nombre à arrondir. `NaN` et les infinis sont renvoyés tels quels.
 * @param decimals - Nombre de décimales à conserver (entier, éventuellement négatif).
 * @defaultValue `decimals` : `0`
 * @returns Le nombre arrondi (jamais `-0`).
 * @throws {@link RangeError} Si `decimals` n'est pas un entier.
 * @example
 * ```ts
 * round(1.005, 2); // 1.01
 * round(2.5); // 3
 * round(-2.5); // -3
 * round(1234.5, -2); // 1200
 * ```
 * @since 0.2.0
 */
export function round(value: number, decimals = 0): number {
  if (!Number.isInteger(decimals)) {
    throw new RangeError(`Le nombre de décimales doit être un entier (reçu : ${decimals}).`);
  }
  const shifted = shiftDecimal(Math.abs(value), decimals);
  // NaN, infinis, ou précision demandée au-delà de ce qu'un nombre flottant représente.
  if (!Number.isFinite(shifted)) {
    return value;
  }
  // `+ 0` convertit `-0` (arrondi d'un petit négatif) en `0`.
  return Math.sign(value) * shiftDecimal(Math.round(shifted), -decimals) + 0;
}
