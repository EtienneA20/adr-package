/**
 * Applique une fonction asynchrone à chaque élément d'un tableau, avec au plus `concurrency`
 * appels en cours simultanément, et renvoie les résultats dans l'ordre des éléments.
 *
 * À utiliser à la place de `Promise.all(items.map(mapper))` quand lancer tous les appels d'un
 * coup surchargerait un serveur ou dépasserait une limite de débit (import en masse, envoi de
 * courriels, appels d'API). Comme `Promise.all`, la promesse est rejetée à la première erreur ;
 * aucun nouvel appel n'est alors lancé, mais ceux déjà en cours ne sont pas interrompus.
 *
 * @typeParam T - Type des éléments.
 * @typeParam R - Type des résultats.
 * @param items - Éléments à traiter (non modifié).
 * @param mapper - Fonction appliquée à chaque élément, avec son index.
 * @param concurrency - Nombre maximal d'appels simultanés (entier supérieur ou égal à 1).
 * @returns Une promesse du tableau des résultats, dans l'ordre de `items`.
 * @throws {@link RangeError} (promesse rejetée) Si `concurrency` n'est pas un entier supérieur
 *   ou égal à 1.
 * @throws La première erreur levée par `mapper` (promesse rejetée).
 * @example
 * ```ts
 * const covers = await mapConcurrent(
 *   books,
 *   (book) => api.get<Blob>(`/books/${book.id}/cover`),
 *   4, // 4 téléchargements au plus en parallèle
 * );
 * ```
 * @since 0.2.0
 */
export async function mapConcurrent<T, R>(
  items: readonly T[],
  mapper: (item: T, index: number) => R | Promise<R>,
  concurrency: number,
): Promise<R[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError(
      `concurrency doit être un entier supérieur ou égal à 1 (reçu : ${concurrency}).`,
    );
  }
  const results = new Array<R>(items.length);
  const entries = items.entries();
  let failed = false;

  // Chaque « travailleur » prend l'élément suivant dès qu'il a fini le précédent : l'itérateur
  // partagé garantit que chaque élément n'est traité qu'une fois.
  const work = async (): Promise<void> => {
    for (const [index, item] of entries) {
      if (failed) {
        return;
      }
      try {
        results[index] = await mapper(item, index);
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  };

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, work));
  return results;
}
