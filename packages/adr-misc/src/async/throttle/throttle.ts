import { assertDelay } from "../assert-delay";
import { getTimers } from "../timers";

/**
 * Fonction renvoyée par {@link throttle} : mêmes arguments que la fonction d'origine, plus une
 * méthode pour annuler l'appel différé en attente.
 *
 * @typeParam TArgs - Types des arguments de la fonction.
 * @example
 * ```ts
 * const track: IThrottledFunction<[number]> = throttle(sendScrollPosition, 1000);
 * track(120);
 * track.cancel();
 * ```
 * @since 0.2.0
 */
export interface IThrottledFunction<TArgs extends unknown[]> {
  (...args: TArgs): void;
  /** Annule l'appel différé en attente et termine la fenêtre en cours. */
  readonly cancel: () => void;
}

/**
 * Crée une version de `fn` exécutée au plus une fois toutes les `waitMs` millisecondes.
 *
 * À utiliser pour limiter la fréquence d'une action déclenchée en continu (défilement,
 * déplacement de la souris, suivi de progression, envoi de position) tout en restant réactif.
 * Le premier appel est exécuté immédiatement ; les appels suivants pendant la fenêtre sont
 * regroupés et le dernier est exécuté à la fin de la fenêtre, avec ses arguments.
 *
 * @typeParam TArgs - Types des arguments de `fn`.
 * @param fn - Fonction à exécuter ; son résultat est ignoré.
 * @param waitMs - Intervalle minimal en millisecondes entre deux exécutions.
 * @returns La fonction limitée, dotée d'une méthode `cancel()`.
 * @throws {@link RangeError} Si `waitMs` est négatif, infini ou `NaN`.
 * @example
 * ```ts
 * const reportProgress = throttle((percent: number) => {
 *   void api.post("/imports/progress", { percent });
 * }, 1000);
 *
 * for (const [index, book] of books.entries()) {
 *   await importBook(book);
 *   reportProgress(Math.round(((index + 1) / books.length) * 100));
 * }
 * ```
 * @since 0.2.0
 */
export function throttle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => unknown,
  waitMs: number,
): IThrottledFunction<TArgs> {
  assertDelay(waitMs, "waitMs");
  let waiting = false;
  let handle: unknown;
  let trailingArgs: TArgs | undefined;

  // La fenêtre est ouverte avant l'appel de `fn` : si `fn` lève, la limitation reste cohérente.
  function run(args: TArgs): void {
    waiting = true;
    handle = getTimers().setTimeout(endWindow, waitMs);
    fn(...args);
  }

  function endWindow(): void {
    const args = trailingArgs;
    trailingArgs = undefined;
    waiting = false;
    if (args) {
      run(args);
    }
  }

  const throttled = (...args: TArgs): void => {
    if (waiting) {
      trailingArgs = args;
      return;
    }
    run(args);
  };

  const cancel = (): void => {
    getTimers().clearTimeout(handle);
    waiting = false;
    trailingArgs = undefined;
  };

  return Object.assign(throttled, { cancel });
}
