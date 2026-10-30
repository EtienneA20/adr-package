import { round } from "../round";

/**
 * Nombre de décimales significatives d'un pas (`0.05` : 2, `15` : 0, `2.5e-7` : 8).
 *
 * Sert à arrondir le résultat final pour effacer les erreurs flottantes de la multiplication
 * (`23 * 0.05 === 1.1500000000000001`).
 *
 * @param step - Pas strictement positif et fini.
 * @returns Le nombre de décimales du pas.
 */
function countDecimals(step: number): number {
  const [mantissa = "", exponent = "0"] = String(step).split("e");
  const fractionLength = mantissa.split(".")[1]?.length ?? 0;
  return Math.max(fractionLength - Number(exponent), 0);
}

/**
 * Arrondit un nombre au multiple le plus proche d'un pas.
 *
 * À utiliser pour caler une valeur sur une grille : prix au multiple de 0,05 €, durée au
 * quart d'heure (`step` = 15 minutes), quantité par lots. Les demis s'éloignent de zéro, comme
 * avec `round`. Pour un arrondi au multiple inférieur ou supérieur, utiliser
 * `Math.floor(value / step) * step` ou `Math.ceil(value / step) * step`.
 *
 * @param value - Nombre à arrondir.
 * @param step - Pas de la grille, strictement positif.
 * @returns Le multiple de `step` le plus proche de `value`, sans erreur flottante.
 * @throws {@link RangeError} Si `step` n'est pas un nombre fini strictement positif.
 * @example
 * ```ts
 * roundToStep(1.23, 0.05); // 1.25
 * roundToStep(52, 15); // 45 (minutes)
 * roundToStep(53, 15); // 60
 * ```
 * @since 0.2.0
 */
export function roundToStep(value: number, step: number): number {
  if (!(step > 0 && Number.isFinite(step))) {
    throw new RangeError(`Le pas doit être un nombre fini strictement positif (reçu : ${step}).`);
  }
  // Premier arrondi à 9 décimales : `1.15 / 0.05` vaut 22.999999999999996 et doit compter
  // comme 23 avant de choisir le multiple le plus proche.
  const multiple = round(round(value / step, 9));
  return round(multiple * step, countDecimals(step));
}
