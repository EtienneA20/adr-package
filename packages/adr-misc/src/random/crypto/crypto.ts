/**
 * Sous-ensemble de l'API Web Crypto utilisé par la catégorie : présent dans le navigateur et
 * dans Node (18 et plus) sous `globalThis.crypto`, mais absent de la lib TypeScript ES2022.
 *
 * Membres optionnels : `randomUUID` n'existe dans le navigateur qu'en contexte sécurisé
 * (HTTPS), et un environnement ancien peut n'exposer aucune des deux méthodes.
 *
 * @internal
 */
export interface IWebCrypto {
  /** Génère un UUID v4 à partir d'une source cryptographiquement sûre. */
  randomUUID?: () => string;
  /** Remplit le tableau fourni d'octets cryptographiquement sûrs et le renvoie. */
  getRandomValues?: (array: Uint8Array) => Uint8Array;
}

/**
 * Renvoie l'API Web Crypto de l'environnement courant, si elle existe.
 *
 * Lue à chaque appel (et non capturée à l'import) pour rester compatible avec
 * `vi.stubGlobal("crypto", …)` dans les tests.
 *
 * @returns L'objet `globalThis.crypto`, ou `undefined` s'il est absent.
 * @internal
 */
export function getWebCrypto(): IWebCrypto | undefined {
  return (globalThis as { crypto?: IWebCrypto }).crypto;
}
