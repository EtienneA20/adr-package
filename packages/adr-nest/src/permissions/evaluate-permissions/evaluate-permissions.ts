// Évaluation des règles, sans NestJS : partagée par le service et le guard. Tout ce qui ne peut
// pas être résolu (sujet sans rôles, référence absente du sujet) refuse plutôt qu'il n'accorde.
import type {
  IPermissionRule,
  IPermissionsDefinition,
  PermissionConditionValue,
} from "../permission-rule";
import type { IPermissionCondition, PermissionScope } from "../permission-scope";
import { SUBJECT_REFERENCE_PREFIX } from "../validate-permissions";

type Scalar = string | number | boolean;

const ANY_ACTION = "manage";
const ANY_RESOURCE = "all";

function readPath(source: unknown, path: string): unknown {
  let current = source;
  for (const segment of path.split(".")) {
    if (typeof current !== "object" || current === null || !Object.hasOwn(current, segment)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function isScalar(value: unknown): value is Scalar {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

// `Array.isArray` ne réduit pas les tableaux en lecture seule.
function isList<T>(value: T | readonly T[]): value is readonly T[] {
  return Array.isArray(value);
}

function names(value: string | readonly string[]): readonly string[] {
  return isList(value) ? value : [value];
}

function subjectRoles(subject: unknown): readonly string[] {
  const roles = readPath(subject, "roles");
  return Array.isArray(roles) ? roles.filter((role) => typeof role === "string") : [];
}

function ruleCovers(rule: IPermissionRule, action: string, resource: string): boolean {
  const actions = names(rule.action);
  const resources = names(rule.resource);
  return (
    (actions.includes(action) || actions.includes(ANY_ACTION)) &&
    (resources.includes(resource) || resources.includes(ANY_RESOURCE))
  );
}

/**
 * Règles des rôles du sujet qui portent sur l'action et la ressource (jokers `manage` et
 * `all` compris), conditions `where` non évaluées.
 *
 * @param definition - Règles par rôle.
 * @param subject - Sujet (rôles lus dans `roles`, absent : aucun rôle).
 * @param action - Action.
 * @param resource - Type de ressource.
 * @returns Les règles applicables.
 * @example
 * ```ts
 * applicableRules(definition, { roles: ["member"] }, "read", "loan");
 * ```
 * @internal
 */
export function applicableRules(
  definition: IPermissionsDefinition,
  subject: unknown,
  action: string,
  resource: string,
): IPermissionRule[] {
  return subjectRoles(subject)
    .filter((role) => Object.hasOwn(definition.roles, role))
    .flatMap((role) => definition.roles[role] ?? [])
    .filter((rule) => ruleCovers(rule, action, resource));
}

/**
 * Indique si une règle, tous rôles confondus, porte sur l'action et la ressource.
 *
 * @param definition - Règles par rôle.
 * @param action - Action.
 * @param resource - Type de ressource.
 * @returns `true` si l'action est citée par une règle.
 * @example
 * ```ts
 * isKnownPermission(definition, "cancel", "loan"); // true
 * ```
 * @internal
 */
export function isKnownPermission(
  definition: IPermissionsDefinition,
  action: string,
  resource: string,
): boolean {
  return Object.values(definition.roles).some((rules) =>
    rules.some((rule) => ruleCovers(rule, action, resource)),
  );
}

function resolveItem(value: Scalar, subject: unknown): unknown {
  return typeof value === "string" && value.startsWith(SUBJECT_REFERENCE_PREFIX)
    ? readPath(subject, value.slice(SUBJECT_REFERENCE_PREFIX.length))
    : value;
}

// `undefined` : condition impossible à résoudre, la règle ne s'applique pas.
function resolveValue(
  value: PermissionConditionValue,
  subject: unknown,
): IPermissionCondition["value"] | undefined {
  if (!isList(value)) {
    const resolved = resolveItem(value, subject);
    if (isScalar(resolved)) return resolved;
    return Array.isArray(resolved) && resolved.every(isScalar) ? resolved : undefined;
  }
  // Liste : les références absentes du sujet sont ignorées (moins de droits, jamais plus).
  return value.map((item) => resolveItem(item, subject)).filter(isScalar);
}

function ruleConditions(
  rule: IPermissionRule,
  subject: unknown,
): IPermissionCondition[] | undefined {
  const conditions: IPermissionCondition[] = [];
  for (const [path, value] of Object.entries(rule.where ?? {})) {
    const resolved = resolveValue(value, subject);
    if (resolved === undefined) return undefined;
    const op = isList(resolved) ? "in" : "eq";
    conditions.push({ path, op, value: resolved, caseSensitive: true });
  }
  return conditions;
}

function conditionMatches(target: object, condition: IPermissionCondition): boolean {
  const field = readPath(target, condition.path);
  if (!isScalar(field)) return false;
  return isList(condition.value) ? condition.value.includes(field) : condition.value === field;
}

/**
 * Indique si l'une des règles autorise l'action sur cette ressource : toutes ses conditions
 * sont vérifiées par les champs de la ressource (égalité stricte, appartenance).
 *
 * @param rules - Règles applicables.
 * @param subject - Sujet (références `$subject.…`).
 * @param target - Ressource chargée.
 * @returns `true` si une règle s'applique.
 * @example
 * ```ts
 * allowsResource(rules, { id: "m-1", roles: ["member"] }, { memberId: "m-1" }); // true
 * ```
 * @internal
 */
export function allowsResource(
  rules: readonly IPermissionRule[],
  subject: unknown,
  target: object,
): boolean {
  return rules.some((rule) => {
    const conditions = ruleConditions(rule, subject);
    return conditions?.every((condition) => conditionMatches(target, condition)) ?? false;
  });
}

function branchOf(conditions: readonly IPermissionCondition[]): PermissionScope {
  const [first] = conditions;
  return conditions.length === 1 && first ? first : { and: conditions };
}

/**
 * Périmètre accordé par des règles : OU des conditions de chaque règle.
 *
 * @param rules - Règles applicables.
 * @param subject - Sujet (références `$subject.…`).
 * @returns `{ and: [] }` si une règle est sans condition, `{ or: [] }` si aucune ne
 * s'applique, sinon les conditions.
 * @example
 * ```ts
 * rulesScope(rules, { id: "m-1", roles: ["member"] });
 * // { path: "memberId", op: "eq", value: "m-1", caseSensitive: true }
 * ```
 * @internal
 */
export function rulesScope(rules: readonly IPermissionRule[], subject: unknown): PermissionScope {
  const branches: PermissionScope[] = [];
  for (const rule of rules) {
    const conditions = ruleConditions(rule, subject);
    if (conditions === undefined) continue;
    if (conditions.length === 0) return { and: [] };
    branches.push(branchOf(conditions));
  }
  const [only] = branches;
  return branches.length === 1 && only ? only : { or: branches };
}
