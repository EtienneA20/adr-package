/**
 * Renvoie l'élément dont la valeur extraite l'emporte sur toutes les autres selon `isBetter`.
 *
 * Partagé par `minBy` et `maxBy` : même parcours, seule la comparaison change. Les valeurs
 * `NaN` sont ignorées (sinon un `NaN` en première position ne serait jamais remplacé, aucune
 * comparaison avec `NaN` n'étant vraie). En cas d'égalité, le premier élément est conservé.
 *
 * @typeParam T - Type des éléments.
 * @param items - Éléments à parcourir.
 * @param getValue - Fonction qui renvoie la valeur numérique d'un élément.
 * @param isBetter - Indique si `candidate` l'emporte strictement sur `best`.
 * @returns L'élément retenu, ou `undefined` si la liste est vide ou ne contient que des `NaN`.
 * @internal
 */
export function extremeBy<T>(
  items: readonly T[],
  getValue: (item: T) => number,
  isBetter: (candidate: number, best: number) => boolean,
): T | undefined {
  let best: { item: T; value: number } | undefined;
  for (const item of items) {
    const value = getValue(item);
    if (!Number.isNaN(value) && (best === undefined || isBetter(value, best.value))) {
      best = { item, value };
    }
  }
  return best?.item;
}
