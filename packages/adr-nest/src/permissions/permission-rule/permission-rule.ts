/**
 * Valeur d'une condition de règle : texte, nombre ou booléen fixe, référence au sujet
 * (`"$subject.id"`, `"$subject.tenantId"`), ou liste de ces valeurs (appartenance).
 *
 * Une chaîne qui commence par `$` est toujours une référence : `$subject.` suivi d'un chemin
 * pointé dans le sujet. Une référence qui désigne une liste (`"$subject.libraryIds"`) donne une
 * condition d'appartenance.
 *
 * @example
 * ```ts
 * const owner: PermissionConditionValue = "$subject.id";
 * const statuses: PermissionConditionValue = ["active", "late"];
 * ```
 * @since 0.2.0
 */
export type PermissionConditionValue =
  string | number | boolean | readonly (string | number | boolean)[];

/**
 * Règle de permission **sérialisable** (JSON) : le rôle qui la porte peut faire `action` sur
 * `resource`, éventuellement limité aux ressources qui vérifient `where`.
 *
 * Jokers : l'action `"manage"` vaut toutes les actions, la ressource `"all"` toutes les
 * ressources. Les conditions de `where` (champ de la ressource → valeur) sont combinées en ET :
 * égalité pour une valeur simple, appartenance pour une liste.
 *
 * @example
 * ```ts
 * const rule: IPermissionRule = {
 *   action: ["read", "cancel"],
 *   resource: "loan",
 *   where: { memberId: "$subject.id" },
 * };
 * ```
 * @since 0.2.0
 */
export interface IPermissionRule {
  /** Action ou liste d'actions (`"read"`, `["read", "cancel"]`, `"manage"` pour toutes). */
  readonly action: string | readonly string[];
  /** Ressource ou liste de ressources (`"loan"`, `"all"` pour toutes). */
  readonly resource: string | readonly string[];
  /** Conditions sur la ressource, combinées en ET ; absent : toutes les ressources. */
  readonly where?: Readonly<Record<string, PermissionConditionValue>> | undefined;
}

/**
 * Définition des permissions d'une application : règles par rôle, sérialisables (aucune
 * fonction), refus par défaut.
 *
 * @example
 * ```ts
 * const definition: IPermissionsDefinition = {
 *   roles: { librarian: [{ action: "manage", resource: "book" }] },
 * };
 * ```
 * @since 0.2.0
 */
export interface IPermissionsDefinition {
  /** Règles accordées à chaque rôle (nom du rôle → règles). */
  readonly roles: Readonly<Record<string, readonly IPermissionRule[]>>;
}

/**
 * Sujet d'une vérification de droits : l'utilisateur (ou le service) à l'origine de la requête.
 *
 * Seul `roles` est lu par les règles ; les autres propriétés (`id`, plus tard `tenantId`…) sont
 * accessibles aux conditions par référence (`"$subject.id"`). Fourni par la fonction `subject`
 * de `PermissionsModule` (`request.user` par défaut).
 *
 * @example
 * ```ts
 * interface IMember extends IPermissionSubject {
 *   readonly id: string;
 * }
 * ```
 * @since 0.2.0
 */
export interface IPermissionSubject {
  /** Rôles du sujet (`["member"]`). */
  readonly roles: readonly string[];
}
