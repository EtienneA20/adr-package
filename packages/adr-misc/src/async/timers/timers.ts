/**
 * Minuteries communes au navigateur et à Node, absentes de la lib ES2022.
 *
 * @internal
 */
export interface ITimers {
  /** Planifie `callback` après `delayMs` millisecondes et renvoie un identifiant opaque. */
  setTimeout(callback: () => void, delayMs: number): unknown;
  /** Annule une minuterie planifiée par `setTimeout`. */
  clearTimeout(handle: unknown): void;
}

/**
 * Renvoie les minuteries globales (`setTimeout`, `clearTimeout`).
 *
 * Le package ne charge ni la lib DOM ni les types Node : on type minimalement `globalThis`. Les
 * minuteries sont lues à chaque appel (et non capturées à l'import) pour rester compatibles avec
 * `vi.useFakeTimers()`, qui remplace les globales après le chargement des modules.
 *
 * @returns Les minuteries de l'environnement courant.
 * @internal
 */
export function getTimers(): ITimers {
  return globalThis as unknown as ITimers;
}
