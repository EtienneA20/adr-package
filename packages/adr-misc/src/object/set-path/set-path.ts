import { isArrayIndex } from "../array-index";
import type { PathValue } from "../get-path";
import { isUnsafeKey } from "../unsafe-key";

/**
 * Copie superficiellement le conteneur à modifier, ou en crée un s'il n'existe pas : un tableau
 * si le segment est un index (`"0"`), un objet sinon.
 *
 * @param current - Valeur actuelle à cet endroit du chemin.
 * @param segment - Segment qui va être écrit dans le conteneur.
 * @returns Un nouveau conteneur, modifiable.
 */
function copyContainer(current: unknown, segment: string): Record<string, unknown> {
  if (Array.isArray(current)) {
    return [...(current as unknown[])] as unknown as Record<string, unknown>;
  }
  if (typeof current === "object" && current !== null) {
    return { ...current };
  }
  return (isArrayIndex(segment) ? [] : {}) as Record<string, unknown>;
}

/**
 * Écrit la valeur en recopiant uniquement les conteneurs situés sur le chemin : le reste de
 * l'arbre est partagé avec l'objet d'origine (partage structurel, comme un reducer).
 *
 * @param current - Valeur actuelle à ce niveau.
 * @param segments - Segments restants du chemin.
 * @param value - Valeur à écrire au bout du chemin.
 * @returns La nouvelle valeur de ce niveau.
 */
function setIn(current: unknown, segments: readonly string[], value: unknown): unknown {
  const [segment, ...rest] = segments;
  if (segment === undefined) {
    return value;
  }
  const container = copyContainer(current, segment);
  container[segment] = setIn(container[segment], rest, value);
  return container;
}

/**
 * Renvoie une copie d'un objet avec une valeur écrite à un chemin pointé, sans modifier
 * l'original.
 *
 * À utiliser pour mettre à jour une propriété profonde de façon immuable (état React, reducer,
 * formulaire imbriqué…). Seuls les objets et tableaux situés sur le chemin sont recopiés ; le
 * reste est partagé avec l'original. Les conteneurs manquants (ou non objets) sont créés : un
 * tableau si le segment suivant est un index (`"items.0.title"`), un objet sinon. Les objets
 * recopiés perdent leur prototype (copie par décomposition `{ ...objet }`) : réserver cette
 * fonction aux objets simples et tableaux. La valeur doit avoir le type attendu au bout du
 * chemin quand celui-ci est littéral.
 *
 * @typeParam T - Type de l'objet.
 * @typeParam P - Chemin pointé.
 * @param object - Objet d'origine (non modifié).
 * @param path - Chemin pointé, par exemple `"author.address.city"`.
 * @param value - Valeur à écrire.
 * @returns Une nouvelle version de l'objet avec la valeur écrite.
 * @throws {@link Error} Si un segment du chemin vaut `__proto__`, `constructor` ou `prototype`
 * (protection contre la pollution de prototype).
 * @example
 * ```ts
 * const updated = setPath(member, "address.city", "Lyon");
 * updated.address.city; // "Lyon"
 * member.address.city; // inchangé
 * setPath({}, "loans.0.bookId", "b-42"); // { loans: [{ bookId: "b-42" }] }
 * ```
 * @since 0.2.0
 */
export function setPath<T extends object, P extends string>(
  object: T,
  path: P,
  value: PathValue<T, P>,
): T {
  const segments = path.split(".");
  const unsafeSegment = segments.find((segment) => isUnsafeKey(segment));
  if (unsafeSegment !== undefined) {
    throw new Error(
      `Chemin « ${path} » refusé : le segment « ${unsafeSegment} » est interdit (pollution de prototype).`,
    );
  }
  return setIn(object, segments, value) as T;
}
