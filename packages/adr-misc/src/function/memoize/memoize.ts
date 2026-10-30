/**
 * Options de {@link memoize}.
 *
 * @typeParam TArgs - Types des arguments de la fonction mémoïsée.
 * @example
 * ```ts
 * const options: IMemoizeOptions<[string, number]> = {
 *   resolveKey: (isbn, page) => `${isbn}:${page}`,
 *   maxSize: 100,
 * };
 * ```
 * @since 0.2.0
 */
export interface IMemoizeOptions<TArgs extends unknown[]> {
  /**
   * Calcule la clé de cache à partir des arguments. Les clés sont comparées comme celles d'une
   * `Map` (`SameValueZero` : deux objets distincts sont deux clés différentes).
   *
   * @defaultValue le premier argument
   */
  resolveKey?: (...args: TArgs) => unknown;
  /**
   * Nombre maximal d'entrées conservées. Au-delà, l'entrée utilisée le moins récemment est
   * supprimée. Doit être un entier supérieur ou égal à 1.
   *
   * @defaultValue `Infinity` (cache illimité)
   */
  maxSize?: number;
}

/**
 * Fonction mémoïsée renvoyée par {@link memoize} : même signature que la fonction d'origine,
 * plus une méthode pour vider le cache.
 *
 * @typeParam TArgs - Types des arguments de la fonction.
 * @typeParam TResult - Type du résultat de la fonction.
 * @example
 * ```ts
 * const getAuthor: IMemoizedFunction<[string], IAuthor> = memoize(findAuthor);
 * getAuthor("a1");
 * getAuthor.clear();
 * ```
 * @since 0.2.0
 */
export interface IMemoizedFunction<TArgs extends unknown[], TResult> {
  (...args: TArgs): TResult;
  /** Vide le cache : les prochains appels exécutent à nouveau la fonction d'origine. */
  readonly clear: () => void;
}

/** Entrée du cache ; l'enveloppe distingue un résultat `undefined` d'une entrée absente. */
interface ICacheEntry<TResult> {
  value: TResult;
}

/**
 * Crée une version de `fn` qui met ses résultats en cache selon ses arguments.
 *
 * À utiliser pour une fonction **pure** et coûteuse appelée souvent avec les mêmes arguments
 * (calcul, recherche dans une grande liste, formatage). Par défaut, la clé de cache est le
 * premier argument : fournir `resolveKey` dès que la fonction en reçoit plusieurs ou reçoit un
 * objet. Les erreurs levées ne sont pas mises en cache. Pour une fonction asynchrone, c'est la
 * promesse qui est mise en cache (y compris si elle est rejetée).
 *
 * @typeParam TArgs - Types des arguments de `fn`.
 * @typeParam TResult - Type du résultat de `fn`.
 * @param fn - Fonction à mémoïser.
 * @param options - Calcul de la clé (`resolveKey`) et taille maximale du cache (`maxSize`).
 * @returns La fonction mémoïsée, dotée d'une méthode `clear()`.
 * @throws {@link RangeError} Si `maxSize` n'est pas un entier supérieur ou égal à 1.
 * @example
 * ```ts
 * const countLoans = memoize(
 *   (memberId: string, year: number) => loans.filter((loan) => loan.memberId === memberId && loan.year === year).length,
 *   { resolveKey: (memberId, year) => `${memberId}:${year}`, maxSize: 500 },
 * );
 *
 * countLoans("m1", 2026); // calculé
 * countLoans("m1", 2026); // lu dans le cache
 * ```
 * @since 0.2.0
 */
export function memoize<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  options: IMemoizeOptions<TArgs> = {},
): IMemoizedFunction<TArgs, TResult> {
  const { resolveKey = (...args: TArgs) => args[0], maxSize = Number.POSITIVE_INFINITY } = options;
  if (maxSize !== Number.POSITIVE_INFINITY && (!Number.isInteger(maxSize) || maxSize < 1)) {
    throw new RangeError(`maxSize doit être un entier supérieur ou égal à 1 (reçu : ${maxSize}).`);
  }
  const cache = new Map<unknown, ICacheEntry<TResult>>();

  const memoized = (...args: TArgs): TResult => {
    const key = resolveKey(...args);
    const cached = cache.get(key);
    if (cached) {
      // Réinsertion : la `Map` conserve l'ordre d'insertion, la première clé est la moins récente.
      cache.delete(key);
      cache.set(key, cached);
      return cached.value;
    }
    const value = fn(...args);
    cache.set(key, { value });
    if (cache.size > maxSize) {
      cache.delete(cache.keys().next().value);
    }
    return value;
  };

  return Object.assign(memoized, {
    clear: () => {
      cache.clear();
    },
  });
}
