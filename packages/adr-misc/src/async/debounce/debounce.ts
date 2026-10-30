import { assertDelay } from "../assert-delay";
import { getTimers } from "../timers";

/**
 * Fonction renvoyée par {@link debounce} : même arguments que la fonction d'origine, plus des
 * méthodes pour annuler ou forcer l'appel en attente.
 *
 * @typeParam TArgs - Types des arguments de la fonction.
 * @example
 * ```ts
 * const save: IDebouncedFunction<[string]> = debounce(saveNote, 500);
 * save("Brouillon");
 * save.flush(); // enregistre tout de suite
 * ```
 * @since 0.2.0
 */
export interface IDebouncedFunction<TArgs extends unknown[]> {
  (...args: TArgs): void;
  /** Annule l'appel en attente, s'il y en a un. */
  readonly cancel: () => void;
  /** Exécute immédiatement l'appel en attente (avec les derniers arguments), s'il y en a un. */
  readonly flush: () => void;
}

/**
 * Crée une version de `fn` dont l'exécution est retardée jusqu'à ce que `waitMs` millisecondes
 * se soient écoulées sans nouvel appel.
 *
 * À utiliser pour réagir à une rafale d'événements une seule fois, à la fin : recherche pendant
 * la saisie, enregistrement automatique, redimensionnement. Seul le dernier appel de la rafale
 * est exécuté, avec ses arguments. Appeler `cancel()` au démontage d'un composant, ou `flush()`
 * pour ne pas perdre un appel en attente (avant de quitter une page par exemple).
 *
 * @typeParam TArgs - Types des arguments de `fn`.
 * @param fn - Fonction à exécuter ; son résultat est ignoré.
 * @param waitMs - Durée d'inactivité en millisecondes avant l'exécution.
 * @returns La fonction retardée, dotée des méthodes `cancel()` et `flush()`.
 * @throws {@link RangeError} Si `waitMs` est négatif, infini ou `NaN`.
 * @example
 * ```ts
 * const searchBooks = debounce((query: string) => {
 *   void loadResults(query);
 * }, 300);
 *
 * searchBooks("ger");
 * searchBooks("germ");
 * searchBooks("germinal"); // seul cet appel est exécuté, 300 ms plus tard
 * ```
 * @since 0.2.0
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => unknown,
  waitMs: number,
): IDebouncedFunction<TArgs> {
  assertDelay(waitMs, "waitMs");
  let pending: { args: TArgs; handle: unknown } | undefined;

  const cancel = (): void => {
    if (pending) {
      getTimers().clearTimeout(pending.handle);
      pending = undefined;
    }
  };

  const flush = (): void => {
    if (pending) {
      const { args } = pending;
      cancel();
      fn(...args);
    }
  };

  const debounced = (...args: TArgs): void => {
    cancel();
    pending = { args, handle: getTimers().setTimeout(flush, waitMs) };
  };

  return Object.assign(debounced, { cancel, flush });
}
