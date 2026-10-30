import { formatFiniteNumber } from "../finite-number";

/**
 * Options de {@link formatBytes}.
 *
 * @example
 * ```ts
 * const options: IFormatBytesOptions = { binary: true, decimals: 2 };
 * formatBytes(1536, options); // "1,5 Kio"
 * ```
 * @since 0.2.0
 */
export interface IFormatBytesOptions {
  /**
   * Nombre maximal de décimales.
   *
   * @defaultValue `1`
   */
  readonly decimals?: number;
  /**
   * Utilise les unités binaires (base 1024 : Kio, Mio, Gio…) au lieu des unités décimales
   * (base 1000 : ko, Mo, Go…).
   *
   * @defaultValue `false`
   */
  readonly binary?: boolean;
  /**
   * Locale BCP 47 du nombre (les unités restent en français).
   *
   * @defaultValue `"fr-FR"`
   */
  readonly locale?: string;
}

/** Unités décimales (base 1000), en octets. */
const DECIMAL_UNITS = ["o", "ko", "Mo", "Go", "To", "Po"] as const;

/** Unités binaires (base 1024), en octets. */
const BINARY_UNITS = ["o", "Kio", "Mio", "Gio", "Tio", "Pio"] as const;

/**
 * Choisit l'exposant de l'unité : le plus grand dont la valeur arrondie reste sous la base
 * (« 999 999 o » s'affiche « 1 Mo » et non « 1 000 ko »).
 *
 * @param bytes - Valeur absolue en octets.
 * @param base - 1000 ou 1024.
 * @param decimals - Décimales affichées.
 * @returns L'index de l'unité dans la table.
 */
function selectExponent(bytes: number, base: number, decimals: number): number {
  const maxExponent = DECIMAL_UNITS.length - 1;
  const factor = 10 ** decimals;
  let exponent = 0;
  while (
    exponent < maxExponent &&
    Math.round((bytes / base ** exponent) * factor) / factor >= base
  ) {
    exponent += 1;
  }
  return exponent;
}

/**
 * Formate une taille en octets avec l'unité adaptée, au format français (« 1,5 Mo »).
 *
 * À utiliser pour afficher la taille d'un fichier joint, d'une couverture de livre ou d'un
 * quota. Les unités sont françaises (octet : `o`, `ko`, `Mo`…), séparées du nombre par une
 * espace insécable (U+00A0).
 *
 * @param bytes - Taille en octets. Une valeur négative garde son signe (variation de taille).
 * @param options - Décimales, base et locale (voir {@link IFormatBytesOptions}).
 * @returns La taille formatée, ou `""` si `bytes` est `null`, `undefined`, `NaN` ou infini.
 * @throws {@link RangeError} Si `decimals` est hors de l'intervalle 0 à 100 ou si la locale est
 *   invalide.
 * @example
 * ```ts
 * formatBytes(512); // "512 o"
 * formatBytes(1_500_000); // "1,5 Mo"
 * formatBytes(1536, { binary: true }); // "1,5 Kio"
 * ```
 * @since 0.2.0
 */
export function formatBytes(
  bytes: number | null | undefined,
  options: IFormatBytesOptions = {},
): string {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes)) {
    return "";
  }
  const decimals = options.decimals ?? 1;
  const base = options.binary === true ? 1024 : 1000;
  const units = options.binary === true ? BINARY_UNITS : DECIMAL_UNITS;
  const exponent = selectExponent(Math.abs(bytes), base, Math.max(0, Math.trunc(decimals)));
  const amount = formatFiniteNumber(bytes / base ** exponent, options.locale ?? "fr-FR", {
    maximumFractionDigits: decimals,
  });
  return `${amount}\u00a0${units[exponent] ?? ""}`;
}
