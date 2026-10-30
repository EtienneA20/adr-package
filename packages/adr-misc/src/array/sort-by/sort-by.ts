/**
 * Valeur de tri renvoyée par un critère de {@link sortBy}.
 *
 * Les nombres, `bigint`, booléens (`false` avant `true`) et dates sont comparés numériquement,
 * les chaînes avec l'ordre alphabétique français (`Intl.Collator("fr")`). `null`, `undefined`,
 * `NaN` et les dates invalides sont toujours placés en dernier.
 *
 * @example
 * ```ts
 * const getDueDate = (loan: ILoan): SortByValue => loan.dueDate ?? null;
 * ```
 * @since 0.2.0
 */
export type SortByValue = string | number | bigint | boolean | Date | null | undefined;

/**
 * Critère de tri détaillé de {@link sortBy} : valeur à comparer et sens du tri.
 *
 * @typeParam T - Type des éléments triés.
 * @example
 * ```ts
 * const byNewest: ISortByCriterion<IBook> = { by: (book) => book.publishedAt, direction: "desc" };
 * ```
 * @since 0.2.0
 */
export interface ISortByCriterion<T> {
  /** Extrait d'un élément la valeur à comparer. */
  by: (item: T) => SortByValue;
  /**
   * Sens du tri : croissant (`"asc"`) ou décroissant (`"desc"`).
   *
   * @defaultValue `"asc"`
   */
  direction?: "asc" | "desc";
}

/**
 * Critère de tri accepté par {@link sortBy} : une fonction (tri croissant) ou un objet
 * {@link ISortByCriterion} qui précise le sens.
 *
 * @typeParam T - Type des éléments triés.
 * @example
 * ```ts
 * const criteria: SortByCriterion<IBook>[] = [
 *   (book) => book.author,
 *   { by: (book) => book.year, direction: "desc" },
 * ];
 * ```
 * @since 0.2.0
 */
export type SortByCriterion<T> = ((item: T) => SortByValue) | ISortByCriterion<T>;

/** Valeur de tri ramenée à un type comparable ; `undefined` représente une valeur absente. */
type NormalizedValue = string | number | bigint | undefined;

/**
 * Ramène une valeur de tri à un type comparable. Les dates et booléens deviennent des nombres ;
 * les valeurs absentes ou non comparables (`NaN`, date invalide) deviennent `undefined` pour
 * être placées en dernier.
 *
 * @param value - Valeur extraite par un critère.
 * @returns La valeur normalisée.
 */
function normalize(value: SortByValue): NormalizedValue {
  const comparable =
    value instanceof Date || typeof value === "boolean" ? Number(value) : (value ?? undefined);
  return Number.isNaN(comparable) ? undefined : comparable;
}

/**
 * Compare deux valeurs normalisées présentes. Les chaînes passent par le collator français ;
 * un mélange chaîne / nombre est comparé sous forme de chaînes.
 *
 * @param left - Première valeur.
 * @param right - Seconde valeur.
 * @param collator - Collator français partagé par tout le tri.
 * @returns Un nombre négatif, nul ou positif.
 */
function comparePresent(
  left: string | number | bigint,
  right: string | number | bigint,
  collator: Intl.Collator,
): number {
  if (typeof left === "string" || typeof right === "string") {
    return collator.compare(String(left), String(right));
  }
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
}

/**
 * Compare deux valeurs normalisées : les valeurs absentes sont toujours en dernier, quel que
 * soit le sens du tri.
 *
 * @param left - Première valeur.
 * @param right - Seconde valeur.
 * @param factor - `1` pour un tri croissant, `-1` pour un tri décroissant.
 * @param collator - Collator français partagé par tout le tri.
 * @returns Un nombre négatif, nul ou positif.
 */
function compareValues(
  left: NormalizedValue,
  right: NormalizedValue,
  factor: number,
  collator: Intl.Collator,
): number {
  if (left === undefined || right === undefined) {
    return Number(left === undefined) - Number(right === undefined);
  }
  return comparePresent(left, right, collator) * factor;
}

/**
 * Trie un tableau selon un ou plusieurs critères et renvoie un nouveau tableau.
 *
 * À utiliser pour trier des listes d'objets (livres par auteur puis par titre, emprunts par
 * date de retour…). Le tri est stable : à égalité sur tous les critères, l'ordre d'origine est
 * conservé. Chaque critère est une fonction (tri croissant) ou un objet
 * `{ by, direction: "asc" | "desc" }` ; le critère suivant départage les égalités du précédent.
 * Les chaînes sont comparées dans l'ordre alphabétique français (accents compris), et
 * `null`, `undefined` et `NaN` sont toujours placés en dernier. Chaque critère n'est évalué
 * qu'une fois par élément. Le tableau d'origine n'est pas modifié.
 *
 * @typeParam T - Type des éléments.
 * @param items - Tableau à trier.
 * @param criteria - Un ou plusieurs critères de tri, par ordre de priorité.
 * @returns Un nouveau tableau trié.
 * @example
 * ```ts
 * sortBy(books, (book) => book.author, { by: (book) => book.year, direction: "desc" });
 * sortBy(["Émile", "eva", "Zoé"], (name) => name); // ["Émile", "eva", "Zoé"]
 * ```
 * @since 0.2.0
 */
export function sortBy<T>(
  items: readonly T[],
  ...criteria: [SortByCriterion<T>, ...SortByCriterion<T>[]]
): T[] {
  const collator = new Intl.Collator("fr");
  const comparators = criteria.map((criterion) =>
    typeof criterion === "function"
      ? { by: criterion, factor: 1 }
      : { by: criterion.by, factor: criterion.direction === "desc" ? -1 : 1 },
  );
  const decorated = items.map((item) => ({
    item,
    values: comparators.map(({ by }) => normalize(by(item))),
  }));
  decorated.sort((left, right) => {
    for (const [index, { factor }] of comparators.entries()) {
      const result = compareValues(left.values[index], right.values[index], factor, collator);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });
  return decorated.map(({ item }) => item);
}
