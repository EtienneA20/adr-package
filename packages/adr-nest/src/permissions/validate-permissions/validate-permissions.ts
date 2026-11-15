// Validation d'une définition de permissions venue du code ou d'un JSON (`forRootAsync`) : les
// règles sont des données, donc vérifiées à l'exécution, et toute anomalie est une erreur de
// démarrage plutôt qu'une règle silencieusement ignorée (un droit en moins passe inaperçu).

const RULE_KEYS = new Set(["action", "resource", "where"]);
const PATH_SEGMENT = /^[A-Za-z_]\w*$/;
const FORBIDDEN_SEGMENTS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Préfixe d'une référence au sujet dans une condition.
 *
 * @example
 * ```ts
 * "$subject.id".startsWith(SUBJECT_REFERENCE_PREFIX); // true
 * ```
 * @internal
 */
export const SUBJECT_REFERENCE_PREFIX = "$subject.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPath(path: string): boolean {
  return path
    .split(".")
    .every((segment) => PATH_SEGMENT.test(segment) && !FORBIDDEN_SEGMENTS.has(segment));
}

function checkNames(value: unknown, label: string, at: string): string[] {
  const names = typeof value === "string" ? [value] : value;
  if (!Array.isArray(names) || names.length === 0) {
    return [`${at} : « ${label} » doit être un texte ou une liste non vide de textes.`];
  }
  return names.some((name) => typeof name !== "string" || name.trim() === "")
    ? [`${at} : « ${label} » ne peut contenir que des textes non vides.`]
    : [];
}

function checkScalar(value: unknown, at: string): string[] {
  if (typeof value === "string") {
    if (!value.startsWith("$")) return [];
    const path = value.slice(SUBJECT_REFERENCE_PREFIX.length);
    return value.startsWith(SUBJECT_REFERENCE_PREFIX) && isPath(path)
      ? []
      : [`${at} : référence « ${value} » invalide (attendu : "$subject.<chemin>").`];
  }
  if (typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) {
    return [];
  }
  return [`${at} : valeur invalide (texte, nombre fini, booléen ou liste de ces valeurs).`];
}

function checkWhere(where: unknown, at: string): string[] {
  if (where === undefined) return [];
  if (!isRecord(where)) return [`${at} : « where » doit être un objet.`];
  return Object.entries(where).flatMap(([path, value]) => {
    const fieldAt = `${at}.where.${path}`;
    if (!isPath(path)) return [`${fieldAt} : chemin de champ invalide.`];
    if (!Array.isArray(value)) return checkScalar(value, fieldAt);
    if (value.length === 0) return [`${fieldAt} : liste vide.`];
    return value.flatMap((item, index) =>
      Array.isArray(item)
        ? [`${fieldAt}[${String(index)}] : liste imbriquée.`]
        : checkScalar(item, `${fieldAt}[${String(index)}]`),
    );
  });
}

function checkRule(rule: unknown, at: string): string[] {
  if (!isRecord(rule)) return [`${at} : une règle doit être un objet.`];
  const unknownKeys = Object.keys(rule).filter((key) => !RULE_KEYS.has(key));
  return [
    ...unknownKeys.map((key) => `${at} : propriété « ${key} » inconnue.`),
    ...checkNames(rule.action, "action", at),
    ...checkNames(rule.resource, "resource", at),
    ...checkWhere(rule.where, at),
  ];
}

/**
 * Liste les problèmes d'une définition de permissions (vide si elle est valide).
 *
 * @param definition - Définition à vérifier, de forme inconnue.
 * @returns Les problèmes, avec leur emplacement (`roles.member[0].where.memberId`).
 * @example
 * ```ts
 * validatePermissions({ roles: { member: [{ action: "read", resource: "loan", wher: {} }] } });
 * // ["roles.member[0] : propriété « wher » inconnue."]
 * ```
 * @internal
 */
export function validatePermissions(definition: unknown): string[] {
  if (!isRecord(definition) || !isRecord(definition.roles)) {
    return ["La définition doit être un objet { roles: { <rôle>: [règles] } }."];
  }
  return Object.entries(definition.roles).flatMap(([role, rules]) => {
    const at = `roles.${role}`;
    if (role.trim() === "" || FORBIDDEN_SEGMENTS.has(role))
      return [`${at} : nom de rôle invalide.`];
    if (!Array.isArray(rules)) return [`${at} : les règles d'un rôle forment une liste.`];
    return rules.flatMap((rule, index) => checkRule(rule, `${at}[${String(index)}]`));
  });
}
