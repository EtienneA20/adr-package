// Sexe (1, 2, ou 3, 4, 7, 8 pour les numéros provisoires), année, mois (01 à 12, ou 20 à 99
// quand le mois de naissance est inconnu), département (dont 2A et 2B), commune, ordre, clé.
const NIR_PATTERN = /^([1-478]\d{2}(?:0[1-9]|1[0-2]|[2-9]\d)(?:\d{2}|2[AB])\d{6})(\d{2})$/;

/**
 * Indique si une chaîne est un numéro de sécurité sociale français (NIR) valide.
 *
 * À utiliser pour valider le NIR d'un agent ou d'un usager (15 caractères : 13 pour le numéro,
 * 2 pour la clé). Vérifie la structure (sexe, mois, département) et la clé
 * `97 - (numéro mod 97)`. Les départements corses `2A` et `2B` sont gérés (remplacés par 19 et
 * 18 pour le calcul de la clé). Les espaces de présentation et les minuscules (`2a`) sont
 * tolérés.
 *
 * @param value - NIR à tester, espaces tolérés.
 * @returns `true` si `value` est un NIR valide, `false` sinon.
 * @example
 * ```ts
 * isNir("1 85 05 78 006 084 91"); // true
 * isNir("2 69 05 2A 004 012 28"); // true (né en Corse-du-Sud)
 * isNir("1 85 05 78 006 084 92"); // false (clé invalide)
 * ```
 * @since 0.2.0
 */
export function isNir(value: string): boolean {
  const match = NIR_PATTERN.exec(value.replace(/\s/g, "").toUpperCase());
  if (!match) {
    return false;
  }
  const [, number = "", key] = match;
  // 13 chiffres au plus : la valeur reste exacte en `number` (inférieure à 2^53).
  const numeric = Number(number.replace("2A", "19").replace("2B", "18"));
  return 97 - (numeric % 97) === Number(key);
}
