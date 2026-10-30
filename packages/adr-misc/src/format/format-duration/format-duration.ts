/**
 * Options de {@link formatDuration}.
 *
 * @example
 * ```ts
 * const options: IFormatDurationOptions = { style: "long", maxUnits: 2 };
 * formatDuration(93_784_000, options); // "1 jour et 2 heures"
 * ```
 * @since 0.2.0
 */
export interface IFormatDurationOptions {
  /**
   * Présentation :
   *
   * - `short` : unités abrégées séparées par des espaces (« 1 j 2 h 30 min ») ;
   * - `long` : unités en toutes lettres (« 1 jour, 2 heures et 30 minutes ») ;
   * - `clock` : horloge `H:mm:ss` (« 26:30:00 »), les jours étant convertis en heures.
   *
   * @defaultValue `"short"`
   */
  readonly style?: "short" | "long" | "clock";
  /**
   * Nombre maximal d'unités affichées (styles `short` et `long`), en partant de la plus grande.
   * Les unités suivantes sont tronquées, pas arrondies.
   *
   * @defaultValue toutes les unités non nulles
   */
  readonly maxUnits?: number;
}

/** Une unité de durée et ses libellés français. */
interface IDurationUnit {
  /** Durée de l'unité en secondes. */
  readonly seconds: number;
  /** Libellé abrégé. */
  readonly short: string;
  /** Libellé en toutes lettres, au singulier. */
  readonly singular: string;
  /** Libellé en toutes lettres, au pluriel. */
  readonly plural: string;
}

/** Plus petite unité affichée, utilisée aussi pour une durée nulle. */
const SECOND_UNIT: IDurationUnit = {
  seconds: 1,
  short: "s",
  singular: "seconde",
  plural: "secondes",
};

/** Unités affichées, de la plus grande à la plus petite. */
const UNITS: readonly IDurationUnit[] = [
  { seconds: 86_400, short: "j", singular: "jour", plural: "jours" },
  { seconds: 3600, short: "h", singular: "heure", plural: "heures" },
  { seconds: 60, short: "min", singular: "minute", plural: "minutes" },
  SECOND_UNIT,
];

/**
 * Libellé d'une quantité d'une unité. En français, 0 et 1 sont au singulier.
 *
 * @param amount - Quantité.
 * @param unit - Unité.
 * @param style - Style abrégé ou en toutes lettres.
 * @returns Le terme, par exemple « 2 h » ou « 2 heures ».
 */
function formatTerm(amount: number, unit: IDurationUnit, style: "short" | "long"): string {
  if (style === "short") {
    return `${amount} ${unit.short}`;
  }
  return `${amount} ${amount < 2 ? unit.singular : unit.plural}`;
}

/**
 * Formate une durée positive au format horloge `H:mm:ss`.
 *
 * @param totalSeconds - Durée en secondes, entière et positive.
 * @returns La durée, par exemple « 1:05:09 ».
 */
function formatClock(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (part: number): string => String(part).padStart(2, "0");
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formate une durée positive avec des unités.
 *
 * @param totalSeconds - Durée en secondes, entière et positive.
 * @param style - Style abrégé ou en toutes lettres.
 * @param maxUnits - Nombre maximal d'unités affichées.
 * @returns La durée, « 0 s » ou « 0 seconde » si elle est nulle.
 */
function formatUnits(totalSeconds: number, style: "short" | "long", maxUnits: number): string {
  let remaining = totalSeconds;
  const terms: string[] = [];
  for (const unit of UNITS) {
    const amount = Math.floor(remaining / unit.seconds);
    remaining -= amount * unit.seconds;
    if (amount > 0 && terms.length < maxUnits) {
      terms.push(formatTerm(amount, unit, style));
    }
  }
  if (terms.length === 0) {
    return formatTerm(0, SECOND_UNIT, style);
  }
  if (style === "short") {
    return terms.join(" ");
  }
  return new Intl.ListFormat("fr-FR", { type: "conjunction" }).format(terms);
}

/**
 * Vérifie le nombre maximal d'unités et applique la valeur par défaut. Vérifié avant même de
 * lire la durée : une option invalide est une erreur de programmation, à signaler à chaque
 * appel.
 *
 * @param maxUnits - Valeur de l'option.
 * @returns Le nombre maximal d'unités (toutes par défaut).
 * @throws {@link RangeError} Si `maxUnits` n'est pas un entier supérieur ou égal à 1.
 */
function resolveMaxUnits(maxUnits: number | undefined): number {
  const resolved = maxUnits ?? UNITS.length;
  if (!Number.isInteger(resolved) || resolved < 1) {
    throw new RangeError(
      `Nombre d'unités invalide : ${resolved}. Un entier supérieur ou égal à 1 est attendu.`,
    );
  }
  return resolved;
}

/**
 * Formate une durée en millisecondes en texte français : « 1 h 30 min », « 2 jours et
 * 3 heures » ou « 1:30:00 ».
 *
 * À utiliser pour afficher une durée d'emprunt, un retard, un temps de lecture ou un délai.
 * La durée est arrondie à la seconde. Le style `short` (par défaut) et le style `clock` sont
 * relus à l'identique par `parseDuration`.
 *
 * @param durationMs - Durée en millisecondes. Une durée négative est préfixée par `-`.
 * @param options - Style et nombre maximal d'unités (voir {@link IFormatDurationOptions}).
 * @returns La durée formatée, ou `""` si `durationMs` est `null`, `undefined`, `NaN` ou infini.
 * @throws {@link RangeError} Si `maxUnits` n'est pas un entier supérieur ou égal à 1.
 * @example
 * ```ts
 * formatDuration(5_400_000); // "1 h 30 min"
 * formatDuration(183_600_000, { style: "long" }); // "2 jours et 3 heures"
 * formatDuration(5_400_000, { style: "clock" }); // "1:30:00"
 * formatDuration(93_784_000, { maxUnits: 2 }); // "1 j 2 h"
 * ```
 * @since 0.2.0
 */
export function formatDuration(
  durationMs: number | null | undefined,
  options: IFormatDurationOptions = {},
): string {
  const maxUnits = resolveMaxUnits(options.maxUnits);
  if (durationMs === null || durationMs === undefined || !Number.isFinite(durationMs)) {
    return "";
  }
  const totalSeconds = Math.round(Math.abs(durationMs) / 1000);
  const sign = durationMs < 0 && totalSeconds > 0 ? "-" : "";
  const style = options.style ?? "short";
  const text =
    style === "clock" ? formatClock(totalSeconds) : formatUnits(totalSeconds, style, maxUnits);
  return `${sign}${text}`;
}
