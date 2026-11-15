import type { CriteriaNode, CriteriaValue, ICriteriaCondition } from "../list-criteria";

type Scalar = string | number | boolean | Date;

/**
 * Lit la valeur d'un chemin pointé (`author.name`) dans un objet.
 *
 * @param item - Objet lu.
 * @param path - Chemin de colonne.
 * @returns La valeur, ou `undefined` si un segment manque.
 * @internal
 */
export function readPath(item: unknown, path: string): unknown {
  let current: unknown = item;
  for (const segment of path.split(".")) {
    if (typeof current !== "object" || current === null || !Object.hasOwn(current, segment)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

/**
 * Rend deux valeurs comparables : dates en millisecondes (un texte comparé à une `Date` est lu
 * comme une date), textes repliés en minuscules si la comparaison ignore la casse.
 *
 * @param value - Valeur de l'objet.
 * @param expected - Valeur de la condition.
 * @param foldCase - Ignorer la casse.
 * @returns Les deux valeurs comparables.
 * @internal
 */
export function comparable(value: unknown, expected: Scalar, foldCase = false): [unknown, unknown] {
  if (expected instanceof Date) {
    const time = value instanceof Date ? value.getTime() : Date.parse(String(value));
    return [time, expected.getTime()];
  }
  if (foldCase && typeof value === "string" && typeof expected === "string") {
    return [value.toLowerCase(), expected.toLowerCase()];
  }
  return [value, expected];
}

function compare(value: unknown, expected: Scalar): number {
  const [left, right] = comparable(value, expected);
  if (typeof left !== typeof right || left === null || left === undefined) return Number.NaN;
  if (left === right) return 0;
  return (left as number) < (right as number) ? -1 : 1;
}

function textMatch(value: unknown, condition: ICriteriaCondition): boolean {
  if (typeof value !== "string") return false;
  const [text, search] = comparable(value, condition.value as string, !condition.caseSensitive) as [
    string,
    string,
  ];
  if (condition.op === "startsWith") return text.startsWith(search);
  if (condition.op === "endsWith") return text.endsWith(search);
  return text.includes(search);
}

function list(value: CriteriaValue): readonly Scalar[] {
  return Array.isArray(value) ? (value as readonly Scalar[]) : [value as Scalar];
}

const COMPARATORS: Readonly<Record<string, (order: number) => boolean>> = {
  eq: (order) => order === 0,
  ne: (order) => order !== 0,
  gt: (order) => order > 0,
  gte: (order) => order >= 0,
  lt: (order) => order < 0,
  lte: (order) => order <= 0,
};

function matchesValues(value: unknown, op: string, values: readonly Scalar[]): boolean {
  if (op === "in" || op === "nin") {
    return values.some((expected) => compare(value, expected) === 0) === (op === "in");
  }
  const [first, second] = values as [Scalar, Scalar];
  if (op === "between") return compare(value, first) >= 0 && compare(value, second) <= 0;
  const comparator = COMPARATORS[op];
  return comparator ? comparator(compare(value, first)) : false;
}

function matchesCondition(item: unknown, condition: ICriteriaCondition): boolean {
  const value = readPath(item, condition.path);
  const { op } = condition;
  if (op === "isNull") return (value === null || value === undefined) === condition.value;
  if (op === "contains" || op === "startsWith" || op === "endsWith") {
    return textMatch(value, condition);
  }
  return matchesValues(value, op, list(condition.value));
}

/**
 * Évalue un arbre de critères sur un objet en mémoire.
 *
 * Pourquoi une évaluation en mémoire : les tests, la documentation et les petits jeux de
 * données (référentiels, données de démonstration) n'ont pas de base ; elle sert aussi de
 * référence de sémantique aux adaptateurs d'ORM (même résultat attendu).
 *
 * @param item - Objet évalué.
 * @param node - Arbre de critères.
 * @returns `true` si l'objet satisfait l'arbre.
 * @internal
 */
export function matchesCriteria(item: unknown, node: CriteriaNode): boolean {
  if ("path" in node) return matchesCondition(item, node);
  if ("not" in node) return !matchesCriteria(item, node.not);
  if ("and" in node) return node.and.every((child) => matchesCriteria(item, child));
  return node.or.some((child) => matchesCriteria(item, child));
}

/**
 * Compare deux valeurs pour un tri : valeurs absentes en dernier, dates et nombres par ordre
 * naturel, textes avec `localeCompare` (français).
 *
 * @param left - Première valeur.
 * @param right - Seconde valeur.
 * @returns Négatif, nul ou positif.
 * @internal
 */
export function compareForSort(left: unknown, right: unknown): number {
  const leftMissing = left === null || left === undefined;
  const rightMissing = right === null || right === undefined;
  if (leftMissing || rightMissing) return Number(leftMissing) - Number(rightMissing);
  if (typeof left === "string" && typeof right === "string") return left.localeCompare(right, "fr");
  const [a, b] = [left, right].map((value) =>
    value instanceof Date ? value.getTime() : value,
  ) as [number, number];
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
