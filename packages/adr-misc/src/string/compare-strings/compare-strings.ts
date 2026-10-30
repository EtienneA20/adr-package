const DEFAULT_LOCALE = "fr-FR";
// `sensitivity: "base"` : ni la casse ni les accents ne comptent ; `numeric` : « 2 » < « 10 ».
const COLLATOR_OPTIONS: Intl.CollatorOptions = { sensitivity: "base", numeric: true };
// Créé une seule fois : instancier un `Intl.Collator` à chaque comparaison ralentit les tris.
const FRENCH_COLLATOR = new Intl.Collator(DEFAULT_LOCALE, COLLATOR_OPTIONS);

/**
 * Compare deux textes dans l'ordre alphabétique français, sans tenir compte de la casse ni des
 * accents, avec un ordre naturel des nombres.
 *
 * À utiliser comme fonction de comparaison de `Array.prototype.sort` (ou `toSorted`) pour
 * trier des titres, des noms ou des libellés comme un humain l'attend : « école » est rangé
 * avec « Ecole », avant « Étude » ; « Tome 2 » vient avant « Tome 10 ». Deux textes qui ne
 * diffèrent que par la casse ou les accents sont égaux (`0`) : le tri, stable, conserve alors
 * leur ordre d'origine.
 *
 * @param a - Premier texte.
 * @param b - Second texte.
 * @param locale - Locale de l'ordre alphabétique (code BCP 47).
 * @returns Un nombre négatif si `a` vient avant `b`, positif s'il vient après, `0` s'ils sont
 * équivalents.
 * @example
 * ```ts
 * ["Tome 10", "tome 2", "Étude", "école"].sort(compareStrings);
 * // ["école", "Étude", "tome 2", "Tome 10"]
 * compareStrings("Élève", "eleve"); // 0
 * ```
 * @since 0.2.0
 */
export function compareStrings(a: string, b: string, locale: string = DEFAULT_LOCALE): number {
  const collator =
    locale === DEFAULT_LOCALE ? FRENCH_COLLATOR : new Intl.Collator(locale, COLLATOR_OPTIONS);
  return collator.compare(a, b);
}
