import { assertDelay } from "../assert-delay";
import { sleep } from "../sleep";
import { TimeoutError } from "../timeout-error";

/**
 * Options de {@link waitUntil}.
 *
 * @example
 * ```ts
 * const options: IWaitUntilOptions = {
 *   timeoutMs: 10_000,
 *   intervalMs: 500,
 *   message: "L'import du catalogue n'est pas terminé.",
 * };
 * ```
 * @since 0.2.0
 */
export interface IWaitUntilOptions {
  /**
   * Durée maximale d'attente en millisecondes.
   *
   * @defaultValue 5000
   */
  timeoutMs?: number;
  /**
   * Intervalle en millisecondes entre deux vérifications de la condition.
   *
   * @defaultValue 50
   */
  intervalMs?: number;
  /**
   * Message de la `TimeoutError` levée à l'expiration du délai. Par défaut : « La condition n'a
   * pas été remplie en `timeoutMs` ms. »
   */
  message?: string;
}

/**
 * Vérifie une condition à intervalle régulier jusqu'à ce qu'elle soit vraie, ou jusqu'à
 * l'expiration du délai.
 *
 * À utiliser pour attendre un état qui ne fournit ni promesse ni événement : traitement de fond
 * terminé (sondage d'une API), ressource disponible, condition dans un test d'intégration. La
 * condition peut être synchrone ou asynchrone ; elle est vérifiée immédiatement, puis toutes les
 * `intervalMs` millisecondes. Une erreur levée par la condition interrompt l'attente.
 *
 * @param predicate - Condition à attendre ; renvoie `true` (ou une promesse de `true`) quand elle
 *   est remplie.
 * @param options - Délai maximal, intervalle entre deux vérifications et message d'erreur.
 * @returns Une promesse résolue dès que la condition est vraie.
 * @throws {@link TimeoutError} (promesse rejetée) Si la condition n'est pas remplie dans le délai.
 * @throws {@link RangeError} (promesse rejetée) Si `timeoutMs` ou `intervalMs` est négatif,
 *   infini ou `NaN`.
 * @example
 * ```ts
 * await api.post("/catalog/imports", file);
 * await waitUntil(
 *   async () => (await api.get<IImportStatus>("/catalog/imports/last")).done,
 *   { timeoutMs: 60_000, intervalMs: 2000 },
 * );
 * ```
 * @since 0.2.0
 */
export async function waitUntil(
  predicate: () => boolean | Promise<boolean>,
  options: IWaitUntilOptions = {},
): Promise<void> {
  const { timeoutMs = 5000, intervalMs = 50, message } = options;
  assertDelay(timeoutMs, "timeoutMs");
  assertDelay(intervalMs, "intervalMs");
  const deadline = Date.now() + timeoutMs;
  while (!(await predicate())) {
    if (Date.now() >= deadline) {
      throw new TimeoutError(message ?? `La condition n'a pas été remplie en ${timeoutMs} ms.`);
    }
    await sleep(intervalMs);
  }
}
