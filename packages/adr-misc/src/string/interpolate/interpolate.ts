// `{nom}` ou `{ nom }` : lettres (accents compris), chiffres et underscores.
const PLACEHOLDER = /\{\s*([\p{L}\p{N}_]+)\s*\}/gu;

/**
 * Options de {@link interpolate}.
 *
 * @example
 * ```ts
 * const options: IInterpolateOptions = { missing: "empty" };
 * interpolate("Bonjour {prenom} {nom}", { nom: "Dupont" }, options); // "Bonjour  Dupont"
 * ```
 * @since 0.2.0
 */
export interface IInterpolateOptions {
  /**
   * Traitement d'une clé absente de `values` (ou valant `null` ou `undefined`) :
   * `"keep"` laisse le marqueur `{cle}` tel quel, `"empty"` le remplace par une chaîne vide,
   * `"throw"` lève une erreur.
   *
   * @defaultValue `"keep"`
   */
  missing?: "keep" | "empty" | "throw";
}

/**
 * Valeurs acceptées par {@link interpolate} : converties avec `String()`.
 *
 * @example
 * ```ts
 * const values: InterpolateValues = { titre: "Le Horla", exemplaires: 3, disponible: true };
 * ```
 * @since 0.2.0
 */
export type InterpolateValues = Readonly<
  Record<string, string | number | bigint | boolean | null | undefined>
>;

/**
 * Remplace les marqueurs `{cle}` d'un modèle de texte par les valeurs correspondantes.
 *
 * À utiliser pour des messages paramétrés simples (notifications, libellés traduits, gabarits
 * d'e-mail) : `"Bonjour {prenom}, votre livre est à rendre le {date}."`. Les clés acceptent
 * lettres (accents compris), chiffres et underscores, avec des espaces facultatifs autour
 * (`{ prenom }`) ; tout autre contenu entre accolades est laissé intact. Les valeurs sont
 * converties avec `String()` : formater les dates et les nombres avant l'appel.
 *
 * @remarks
 * Les valeurs ne sont pas échappées : appliquer `escapeHtml` sur les valeurs avant d'insérer
 * le résultat dans du HTML.
 *
 * @param template - Modèle contenant des marqueurs `{cle}`.
 * @param values - Valeurs à insérer, indexées par clé.
 * @param options - Options : `missing` (traitement des clés absentes).
 * @returns Le texte avec les marqueurs remplacés.
 * @throws {@link Error} Si une clé est absente et que `missing` vaut `"throw"`.
 * @example
 * ```ts
 * interpolate("Bonjour {prenom}, {nombre} livre(s) en retard.", { prenom: "Inès", nombre: 2 });
 * // "Bonjour Inès, 2 livre(s) en retard."
 * interpolate("Bonjour {prenom}", {}); // "Bonjour {prenom}"
 * interpolate("Bonjour {prenom}", {}, { missing: "empty" }); // "Bonjour "
 * ```
 * @since 0.2.0
 */
export function interpolate(
  template: string,
  values: InterpolateValues,
  options: IInterpolateOptions = {},
): string {
  const { missing = "keep" } = options;
  return template.replace(PLACEHOLDER, (placeholder: string, key: string) => {
    const value = Object.hasOwn(values, key) ? values[key] : undefined;
    if (value !== undefined && value !== null) {
      return String(value);
    }
    if (missing === "throw") {
      throw new Error(`Valeur manquante pour la clé « ${key} » du modèle.`);
    }
    return missing === "empty" ? "" : placeholder;
  });
}
