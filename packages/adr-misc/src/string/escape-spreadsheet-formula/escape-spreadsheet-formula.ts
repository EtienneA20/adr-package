/**
 * Premiers caractères qui font interpréter une cellule comme une formule par un tableur
 * (Excel, LibreOffice, Google Sheets) : `=`, `+`, `-`, `@`, tabulation, retour chariot, et leurs
 * variantes pleine chasse (`＝`, `＋`, `－`, `＠`), que certains tableurs convertissent.
 */
const FORMULA_START = /^[=+\-@\t\r＝＋－＠]/;

/**
 * Indique si un texte serait interprété comme une formule par un tableur.
 *
 * À utiliser pour décider de neutraliser une cellule d'export (CSV, XLSX) issue d'une saisie
 * utilisateur. Détecte `=`, `+`, `-`, `@`, la tabulation et le retour chariot en première
 * position, ainsi que les variantes pleine chasse `＝`, `＋`, `－`, `＠`.
 *
 * @param value - Texte d'une cellule.
 * @returns `true` si le texte commence par un caractère de formule.
 * @example
 * ```ts
 * isSpreadsheetFormula("=HYPERLINK(\"https://pirate.example\")"); // true
 * isSpreadsheetFormula("＝1+1"); // true (pleine chasse)
 * isSpreadsheetFormula("Les Misérables"); // false
 * ```
 * @since 0.3.0
 */
export function isSpreadsheetFormula(value: string): boolean {
  return FORMULA_START.test(value);
}

/**
 * Neutralise un texte qui serait interprété comme une formule par un tableur, en le préfixant
 * d'une apostrophe (injection de formules, « CSV injection »).
 *
 * À appliquer à chaque cellule texte d'un export destiné à un tableur quand le contenu vient
 * d'utilisateurs (titres, commentaires, noms). L'apostrophe force l'affichage en texte ; elle
 * reste visible si le fichier est relu par un autre programme. Les nombres ne doivent pas
 * passer par cette fonction (un nombre négatif n'est pas une formule).
 *
 * @param value - Texte d'une cellule.
 * @returns Le texte préfixé de `'` s'il commence par un caractère de formule, sinon inchangé.
 * @example
 * ```ts
 * escapeSpreadsheetFormula("=1+1"); // "'=1+1"
 * escapeSpreadsheetFormula("@SUM(A1)"); // "'@SUM(A1)"
 * escapeSpreadsheetFormula("Germinal"); // "Germinal"
 * ```
 * @since 0.3.0
 */
export function escapeSpreadsheetFormula(value: string): string {
  return isSpreadsheetFormula(value) ? `'${value}` : value;
}
