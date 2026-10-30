import { isPlainRecord } from "../is-plain-record";

/** Copies déjà créées, indexées par leur source : évite les boucles sur les références circulaires. */
type ClonedMap = Map<object, unknown>;

/**
 * Définit une propriété propre sans passer par un éventuel setter (`__proto__` compris).
 *
 * @param target - Objet copié.
 * @param key - Clé de la propriété.
 * @param value - Valeur de la propriété.
 */
function defineValue(target: object, key: string, value: unknown): void {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    writable: true,
    configurable: true,
  });
}

/**
 * Copie les conteneurs parcourus (tableau, `Map`, `Set`, objet simple). La copie est
 * enregistrée avant ses enfants pour qu'une référence circulaire pointe vers elle.
 *
 * @param source - Objet à copier.
 * @param cloned - Copies déjà créées.
 * @returns La copie, ou la source elle-même si elle n'est pas d'un type pris en charge.
 */
function cloneContainer(source: object, cloned: ClonedMap): unknown {
  if (Array.isArray(source)) {
    const copy: unknown[] = [];
    cloned.set(source, copy);
    for (const item of source as unknown[]) {
      copy.push(cloneValue(item, cloned));
    }
    return copy;
  }
  if (source instanceof Map) {
    const copy = new Map<unknown, unknown>();
    cloned.set(source, copy);
    source.forEach((value: unknown, key: unknown) => {
      copy.set(cloneValue(key, cloned), cloneValue(value, cloned));
    });
    return copy;
  }
  if (source instanceof Set) {
    const copy = new Set<unknown>();
    cloned.set(source, copy);
    source.forEach((value: unknown) => {
      copy.add(cloneValue(value, cloned));
    });
    return copy;
  }
  if (isPlainRecord(source)) {
    const copy = Object.create(Object.getPrototypeOf(source) as object | null) as object;
    cloned.set(source, copy);
    for (const [key, value] of Object.entries(source)) {
      defineValue(copy, key, cloneValue(value, cloned));
    }
    return copy;
  }
  return source;
}

/**
 * Copie une valeur quelconque : primitives telles quelles, dates et expressions régulières
 * recréées, conteneurs parcourus récursivement.
 *
 * @param value - Valeur à copier.
 * @param cloned - Copies déjà créées.
 * @returns La copie.
 */
function cloneValue(value: unknown, cloned: ClonedMap): unknown {
  if (typeof value !== "object" || value === null) {
    return value;
  }
  if (cloned.has(value)) {
    return cloned.get(value);
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }
  return cloneContainer(value, cloned);
}

/**
 * Crée une copie profonde d'une valeur.
 *
 * À utiliser pour obtenir une copie indépendante d'un état ou d'un objet de configuration avant
 * de le modifier (brouillon de formulaire, annulation…). Copie les objets simples, tableaux,
 * `Date`, `RegExp`, `Map` (clés et valeurs) et `Set`, et préserve les références circulaires et
 * partagées. Les autres objets (instances de classe, fonctions, erreurs…) sont repris par
 * référence. Seules les propriétés propres, énumérables et à clé chaîne des objets simples sont
 * copiées. Alternative portable à `structuredClone`, absent de la lib ES2022.
 *
 * @typeParam T - Type de la valeur.
 * @param value - Valeur à copier (non modifiée).
 * @returns Une copie profonde de même type.
 * @example
 * ```ts
 * const draft = deepClone(member);
 * draft.address.city = "Lyon"; // member.address.city est inchangé
 * ```
 * @since 0.2.0
 */
export function deepClone<T>(value: T): T {
  return cloneValue(value, new Map()) as T;
}
