import { isPlainRecord } from "../is-plain-record";

/**
 * Options de {@link removeUndefined}.
 *
 * @example
 * ```ts
 * const options: IRemoveUndefinedOptions = { deep: true };
 * ```
 * @since 0.2.0
 */
export interface IRemoveUndefinedOptions {
  /**
   * Nettoie aussi les objets simples imbriqués, y compris ceux contenus dans des tableaux.
   *
   * @defaultValue `false`
   */
  deep?: boolean;
}

/**
 * Nettoie une valeur : retire les clés `undefined` des objets simples et, en mode profond,
 * parcourt les objets et tableaux imbriqués. Les éléments des tableaux ne sont jamais retirés
 * (les index seraient décalés).
 *
 * @param value - Valeur à nettoyer.
 * @param deep - Parcourir les valeurs imbriquées.
 * @returns La valeur nettoyée (copie pour les conteneurs).
 */
function clean(value: unknown, deep: boolean): unknown {
  const cleanChild = (child: unknown): unknown => (deep ? clean(child, deep) : child);
  if (Array.isArray(value)) {
    return (value as unknown[]).map(cleanChild);
  }
  if (!isPlainRecord(value)) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, child]) => child !== undefined)
      .map(([key, child]) => [key, cleanChild(child)]),
  );
}

/**
 * Crée une copie d'un objet sans ses propriétés de valeur `undefined`.
 *
 * À utiliser avant d'envoyer un objet à une API ou de le sérialiser quand une clé présente avec
 * `undefined` n'a pas le même sens qu'une clé absente (filtres optionnels, `PATCH` partiel,
 * comparaison avec `isEqual`…). Les valeurs `null` sont conservées. Avec `deep: true`, les
 * objets simples imbriqués (y compris dans des tableaux) sont aussi nettoyés ; les éléments
 * `undefined` des tableaux sont conservés. Les objets non simples (dates, instances de classe…)
 * sont repris tels quels. L'objet d'origine n'est pas modifié.
 *
 * @typeParam T - Type de l'objet.
 * @param object - Objet (ou tableau) à nettoyer.
 * @param options - Options du nettoyage.
 * @returns Une copie de l'objet sans les clés `undefined`, du même type.
 * @example
 * ```ts
 * removeUndefined({ title: "Germinal", author: undefined, year: null }); // { title: "Germinal", year: null }
 * removeUndefined({ filters: { genre: undefined, available: true } }, { deep: true });
 * // { filters: { available: true } }
 * ```
 * @since 0.2.0
 */
export function removeUndefined<T extends object>(
  object: T,
  options: IRemoveUndefinedOptions = {},
): T {
  return clean(object, options.deep ?? false) as T;
}
