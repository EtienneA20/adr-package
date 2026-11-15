import type { IPermissionsDefinition } from "../permission-rule";
import { PermissionsConfigError } from "../permissions-config-error";
import { validatePermissions } from "../validate-permissions";

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

/**
 * Valide une définition de permissions et en renvoie une copie figée.
 *
 * À utiliser pour déclarer les règles de l'application (dans le code ou chargées d'un JSON) :
 * une erreur de règle est signalée au démarrage, avec son emplacement, plutôt que de retirer un
 * droit en silence. `PermissionsModule` valide aussi la définition reçue. Les règles sont des
 * données : elles peuvent être partagées telles quelles avec le front.
 *
 * @param definition - Règles par rôle.
 * @returns Une copie validée et figée de la définition.
 * @throws {@link PermissionsConfigError} Si une règle est invalide (propriété inconnue, action
 * vide, référence au sujet mal écrite, valeur non sérialisable…).
 * @example
 * ```ts
 * export const permissions = definePermissions({
 *   roles: {
 *     librarian: [{ action: "manage", resource: "all" }],
 *     member: [
 *       { action: "read", resource: "book" },
 *       { action: ["read", "cancel"], resource: "loan", where: { memberId: "$subject.id" } },
 *     ],
 *   },
 * });
 * ```
 * @since 0.2.0
 */
export function definePermissions(definition: IPermissionsDefinition): IPermissionsDefinition {
  const issues = validatePermissions(definition);
  if (issues.length > 0) throw new PermissionsConfigError(issues);
  return deepFreeze(structuredClone(definition));
}
