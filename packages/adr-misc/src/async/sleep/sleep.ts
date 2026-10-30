import { assertDelay } from "../assert-delay";
import { getTimers } from "../timers";

/**
 * Renvoie une promesse résolue après `ms` millisecondes.
 *
 * À utiliser pour introduire une pause dans une fonction asynchrone (attente entre deux
 * tentatives, limitation du débit d'appels à une API, démonstration). Ne bloque pas le fil
 * d'exécution. Compatible avec `vi.useFakeTimers()`.
 *
 * @param ms - Durée de la pause en millisecondes (nombre fini, positif ou nul).
 * @returns Une promesse résolue sans valeur à l'issue du délai.
 * @throws {@link RangeError} (promesse rejetée) Si `ms` est négatif, infini ou `NaN`.
 * @example
 * ```ts
 * for (const member of lateMembers) {
 *   await sendReminder(member);
 *   await sleep(200); // ne pas saturer le serveur de messagerie
 * }
 * ```
 * @since 0.2.0
 */
export async function sleep(ms: number): Promise<void> {
  assertDelay(ms, "ms");
  await new Promise<void>((resolve) => {
    getTimers().setTimeout(() => {
      resolve();
    }, ms);
  });
}
