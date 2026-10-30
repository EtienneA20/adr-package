import { assertDelay } from "../assert-delay";
import { sleep } from "../sleep";

/**
 * Options de {@link retry}.
 *
 * @example
 * ```ts
 * const options: IRetryOptions = {
 *   attempts: 5,
 *   delayMs: 500,
 *   factor: 2,
 *   maxDelayMs: 5000,
 *   shouldRetry: (error) => !(error instanceof TypeError),
 * };
 * ```
 * @since 0.2.0
 */
export interface IRetryOptions {
  /**
   * Nombre total de tentatives, première comprise. Entier supérieur ou égal à 1.
   *
   * @defaultValue 3
   */
  attempts?: number;
  /**
   * Délai en millisecondes avant la deuxième tentative.
   *
   * @defaultValue 100
   */
  delayMs?: number;
  /**
   * Multiplicateur appliqué au délai à chaque nouvelle tentative (backoff exponentiel). `1` donne
   * un délai constant. Nombre fini supérieur ou égal à 1.
   *
   * @defaultValue 2
   */
  factor?: number;
  /**
   * Délai maximal en millisecondes entre deux tentatives, quel que soit `factor`.
   *
   * @defaultValue `Infinity`
   */
  maxDelayMs?: number;
  /**
   * Décide si l'erreur justifie une nouvelle tentative ; `false` la relève immédiatement.
   * `attempt` est le numéro de la tentative qui vient d'échouer (à partir de 1).
   *
   * @defaultValue toujours `true`
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /**
   * Appelé avant chaque attente, avec l'erreur, le numéro de la tentative qui vient d'échouer et
   * le délai avant la suivante (journalisation, métriques).
   */
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}

/**
 * Vérifie les options numériques.
 *
 * @param options - Options complètes.
 * @throws {@link RangeError} Si une option numérique est hors limites.
 */
function validateOptions({ attempts, factor, delayMs, maxDelayMs }: Required<IRetryOptions>): void {
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new RangeError(
      `attempts doit être un entier supérieur ou égal à 1 (reçu : ${attempts}).`,
    );
  }
  if (!Number.isFinite(factor) || factor < 1) {
    throw new RangeError(
      `factor doit être un nombre fini supérieur ou égal à 1 (reçu : ${factor}).`,
    );
  }
  assertDelay(delayMs, "delayMs");
  if (maxDelayMs !== Number.POSITIVE_INFINITY) {
    assertDelay(maxDelayMs, "maxDelayMs");
  }
}

/**
 * Applique les valeurs par défaut des options et les valide.
 *
 * @param options - Options fournies par l'appelant.
 * @returns Les options complètes.
 * @throws {@link RangeError} Si une option numérique est hors limites.
 */
function resolveOptions(options: IRetryOptions): Required<IRetryOptions> {
  const resolved: Required<IRetryOptions> = {
    attempts: options.attempts ?? 3,
    delayMs: options.delayMs ?? 100,
    factor: options.factor ?? 2,
    maxDelayMs: options.maxDelayMs ?? Number.POSITIVE_INFINITY,
    shouldRetry: options.shouldRetry ?? (() => true),
    onRetry: options.onRetry ?? (() => undefined),
  };
  validateOptions(resolved);
  return resolved;
}

/**
 * Exécute une fonction asynchrone et la relance en cas d'échec, avec un délai croissant entre
 * les tentatives.
 *
 * À utiliser pour une opération qui peut échouer de façon passagère (réseau instable, service
 * momentanément surchargé, verrou en base). Le délai avant la tentative `n + 1` vaut
 * `delayMs × factor^(n − 1)`, plafonné à `maxDelayMs`. Limiter les relances aux erreurs
 * passagères avec `shouldRetry` : relancer une erreur de validation ne sert à rien.
 *
 * @typeParam T - Type de la valeur produite par `fn`.
 * @param fn - Opération à exécuter ; reçoit le numéro de la tentative (à partir de 1).
 * @param options - Nombre de tentatives, délais, filtre des erreurs et rappel avant relance.
 * @returns Une promesse de la valeur produite par la première tentative réussie.
 * @throws La dernière erreur levée par `fn` (promesse rejetée) quand toutes les tentatives ont
 *   échoué ou que `shouldRetry` renvoie `false`.
 * @throws {@link RangeError} (promesse rejetée) Si `attempts`, `factor`, `delayMs` ou
 *   `maxDelayMs` est hors limites.
 * @example
 * ```ts
 * const books = await retry(() => api.get<IBook[]>("/books"), {
 *   attempts: 4,
 *   delayMs: 500,
 *   shouldRetry: (error) => isNetworkError(error),
 *   onRetry: (error, attempt, delayMs) => {
 *     logger.warn(`Tentative ${attempt} échouée, nouvel essai dans ${delayMs} ms`);
 *   },
 * });
 * ```
 * @since 0.2.0
 */
export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  options: IRetryOptions = {},
): Promise<T> {
  const { attempts, delayMs, factor, maxDelayMs, shouldRetry, onRetry } = resolveOptions(options);
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn(attempt);
    } catch (error) {
      if (attempt >= attempts || !shouldRetry(error, attempt)) {
        throw error;
      }
      const delay = Math.min(delayMs * factor ** (attempt - 1), maxDelayMs);
      onRetry(error, attempt, delay);
      await sleep(delay);
    }
  }
}
