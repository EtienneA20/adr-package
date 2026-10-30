/**
 * Options de {@link parseNumber} et de `parseInteger`.
 *
 * @example
 * ```ts
 * const options: IParseNumberOptions = { decimalSeparator: "." };
 * parseNumber("1,234", options); // 1234
 * ```
 * @since 0.2.0
 */
export interface IParseNumberOptions {
  /**
   * Séparateur décimal imposé. Sans cette option, il est déduit de la saisie : quand `,` et `.`
   * sont présents, le dernier est le séparateur décimal ; quand un seul apparaît une seule
   * fois, il est décimal ; quand il apparaît plusieurs fois, c'est un séparateur de milliers.
   *
   * @defaultValue détection automatique
   */
  readonly decimalSeparator?: "," | ".";
}

/** Signe, corps (chiffres et séparateurs) et pourcentage facultatif. */
const NUMBER_PATTERN = /^([+\-\u2212]?)([\d.,]*\d[\d.,]*)(%?)$/;

/** Espaces à ignorer : `\s` couvre aussi les espaces insécables (U+00A0, U+202F) de `Intl`. */
const SPACES_PATTERN = /\s/g;

/**
 * Déduit le séparateur décimal d'un corps de nombre sans espaces.
 *
 * @param body - Chiffres et séparateurs (`1.234,56`).
 * @returns Le séparateur décimal, ou `undefined` si le nombre est entier.
 */
function detectDecimalSeparator(body: string): "," | "." | undefined {
  const lastComma = body.lastIndexOf(",");
  const lastDot = body.lastIndexOf(".");
  if (lastComma >= 0 && lastDot >= 0) {
    return lastComma > lastDot ? "," : ".";
  }
  const separator = lastComma >= 0 ? "," : ".";
  const occurrences = body.split(separator).length - 1;
  return occurrences === 1 ? separator : undefined;
}

/**
 * Déduit le séparateur de milliers : l'autre séparateur que le décimal, ou, pour un nombre
 * entier, celui qui apparaît dans la saisie.
 *
 * @param body - Chiffres et séparateurs.
 * @param decimalSeparator - Séparateur décimal, ou `undefined` si le nombre est entier.
 * @returns Le séparateur de milliers.
 */
function groupSeparatorFor(body: string, decimalSeparator: "," | "." | undefined): string {
  if (decimalSeparator !== undefined) {
    return decimalSeparator === "," ? "." : ",";
  }
  return body.includes(",") ? "," : ".";
}

/**
 * Supprime les séparateurs de milliers d'une partie entière après avoir vérifié leur position
 * (groupes de trois chiffres) : « 12.34 » n'est pas un regroupement de milliers valide.
 *
 * @param integerPart - Partie entière, éventuellement groupée.
 * @param groupSeparator - Séparateur de milliers attendu.
 * @returns Les chiffres seuls, ou `undefined` si le regroupement est incorrect.
 */
function readIntegerPart(integerPart: string, groupSeparator: string): string | undefined {
  const [firstGroup = "", ...otherGroups] = integerPart.split(groupSeparator);
  if (otherGroups.length === 0) {
    return /^\d*$/.test(firstGroup) ? firstGroup : undefined;
  }
  const isValid =
    /^\d{1,3}$/.test(firstGroup) && otherGroups.every((group) => /^\d{3}$/.test(group));
  return isValid ? `${firstGroup}${otherGroups.join("")}` : undefined;
}

/**
 * Convertit le corps d'un nombre (sans signe ni espaces) en valeur positive.
 *
 * @param body - Chiffres et séparateurs.
 * @param decimalSeparator - Séparateur décimal, ou `undefined` si le nombre est entier.
 * @returns La valeur, ou `undefined` si le corps est mal formé.
 */
function parseBody(body: string, decimalSeparator: "," | "." | undefined): number | undefined {
  const decimalIndex = decimalSeparator === undefined ? -1 : body.lastIndexOf(decimalSeparator);
  const integerPart = decimalIndex >= 0 ? body.slice(0, decimalIndex) : body;
  const decimalPart = decimalIndex >= 0 ? body.slice(decimalIndex + 1) : "0";
  const digits = readIntegerPart(integerPart, groupSeparatorFor(body, decimalSeparator));
  if (digits === undefined || !/^\d+$/.test(decimalPart)) {
    return undefined;
  }
  return Number(`${digits || "0"}.${decimalPart}`);
}

/**
 * Applique le signe et le pourcentage lus par {@link NUMBER_PATTERN}.
 *
 * @param absolute - Valeur absolue du nombre.
 * @param match - Résultat de {@link NUMBER_PATTERN} (groupes : signe, corps, pourcentage).
 * @returns La valeur signée, divisée par 100 si la saisie se termine par `%`.
 */
function applySignAndPercent(absolute: number, match: RegExpExecArray): number {
  const sign = match[1] === "-" || match[1] === "\u2212" ? -1 : 1;
  return match[3] === "%" ? (sign * absolute) / 100 : sign * absolute;
}

/**
 * Convertit une saisie en nombre, en acceptant les formats français et anglais.
 *
 * À utiliser pour lire un nombre saisi par un utilisateur ou importé d'un fichier (CSV, Excel,
 * copier-coller) : « 1 234,56 », « 1234.56 », « 1.234,56 », « 1,234.56 », espaces
 * insécables, signe (`+`, `-` ou moins typographique U+2212) et `%` final facultatif. Un pourcentage est renvoyé sous
 * forme de ratio (« 12,5 % » donne `0.125`), comme l'attend `formatPercent`.
 *
 * @remarks
 * Convention des fonctions `parse*` : une saisie invalide ne lève pas d'erreur, la fonction
 * renvoie `undefined`. Pour une valeur par défaut : `parseNumber(saisie) ?? 0`.
 *
 * Ambiguïté : « 1,234 » ou « 1.234 » (un seul séparateur, une seule fois) est lu comme un
 * nombre décimal (`1.234`). Imposer `decimalSeparator` pour lever l'ambiguïté.
 *
 * @param value - Saisie à convertir. Un `number` fini est renvoyé tel quel.
 * @param options - Séparateur décimal imposé (voir {@link IParseNumberOptions}).
 * @returns Le nombre, ou `undefined` si la saisie est vide, invalide ou non finie.
 * @example
 * ```ts
 * parseNumber("1 234,56"); // 1234.56
 * parseNumber("1,234.56"); // 1234.56
 * parseNumber("-12,5 %"); // -0.125
 * parseNumber("abc"); // undefined
 * parseNumber("1,234", { decimalSeparator: "." }); // 1234
 * ```
 * @since 0.2.0
 */
export function parseNumber(
  value: string | number | null | undefined,
  options: IParseNumberOptions = {},
): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  const match = NUMBER_PATTERN.exec((value ?? "").replace(SPACES_PATTERN, ""));
  const body = match?.[2];
  if (match === null || body === undefined) {
    return undefined;
  }
  const absolute = parseBody(body, options.decimalSeparator ?? detectDecimalSeparator(body));
  return absolute === undefined ? undefined : applySignAndPercent(absolute, match);
}
