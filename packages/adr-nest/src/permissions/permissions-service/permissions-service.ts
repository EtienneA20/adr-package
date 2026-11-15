import { type ExecutionContext, Inject, Injectable } from "@nestjs/common";

import { definePermissions } from "../define-permissions";
import {
  allowsResource,
  applicableRules,
  isKnownPermission,
  rulesScope,
} from "../evaluate-permissions";
import { PermissionDeniedException, UnauthenticatedException } from "../permission-exceptions";
import type { IPermissionSubject, IPermissionsDefinition } from "../permission-rule";
import type { PermissionScope } from "../permission-scope";
import {
  type IPermissionsModuleOptions,
  PERMISSIONS_OPTIONS,
  type SubjectResolver,
} from "../permissions-options";

type Subject = IPermissionSubject | null | undefined;

const requestUser: SubjectResolver = (context) =>
  context.switchToHttp().getRequest<{ user?: IPermissionSubject | null }>().user ?? null;

/**
 * Vérifie les droits d'un sujet selon les règles de `PermissionsModule` : sur un type de
 * ressource (guard), sur une ressource chargée (`assertCan`) ou pour restreindre une liste
 * (`scope`).
 *
 * Injectable partout une fois `PermissionsModule` importé (module global). Testable sans base
 * ni requête : `new PermissionsService({ permissions })`.
 *
 * @example
 * ```ts
 * @Injectable()
 * export class LoansService {
 *   constructor(private readonly permissions: PermissionsService) {}
 *
 *   cancel(member: IMember, id: string): ILoan {
 *     const loan = this.repository.get(id);
 *     this.permissions.assertCan(member, "cancel", "loan", loan); // 403 si ce n'est pas le sien
 *     return this.repository.update(id, { status: "cancelled" });
 *   }
 * }
 * ```
 * @throws {@link PermissionsConfigError} À la construction, si les règles sont invalides.
 * @since 0.2.0
 */
@Injectable()
export class PermissionsService {
  /** Règles validées et figées (sérialisables, partageables avec le front). */
  readonly definition: IPermissionsDefinition;
  private readonly resolver: SubjectResolver;

  /**
   * Crée le service.
   *
   * @param options - Options du module : règles et fonction de résolution du sujet.
   * @throws {@link PermissionsConfigError} Si les règles sont invalides.
   */
  constructor(@Inject(PERMISSIONS_OPTIONS) options: IPermissionsModuleOptions) {
    this.definition = definePermissions(options.permissions);
    this.resolver = options.subject ?? requestUser;
  }

  /**
   * Résout le sujet d'une requête avec la fonction `subject` du module.
   *
   * @param context - Contexte d'exécution de NestJS.
   * @returns Le sujet, ou `null` pour une requête anonyme.
   */
  async resolveSubject(context: ExecutionContext): Promise<IPermissionSubject | null> {
    return (await this.resolver(context)) ?? null;
  }

  /**
   * Indique si le sujet peut faire l'action sur **au moins une** ressource du type (conditions
   * `where` non évaluées) : contrôle d'une route `@Can()` ou affichage d'un bouton.
   *
   * @param subject - Sujet (`null` : anonyme, toujours refusé).
   * @param action - Action (`"read"`).
   * @param resource - Type de ressource (`"loan"`).
   * @returns `true` si une règle d'un des rôles du sujet porte sur l'action et la ressource.
   */
  canOnSome(subject: Subject, action: string, resource: string): boolean {
    return applicableRules(this.definition, subject, action, resource).length > 0;
  }

  /**
   * Indique si le sujet peut faire l'action sur cette ressource précise (conditions `where`
   * évaluées sur ses champs).
   *
   * @param subject - Sujet (`null` : anonyme, toujours refusé).
   * @param action - Action (`"cancel"`).
   * @param resource - Type de ressource (`"loan"`).
   * @param target - Ressource chargée (`{ id, memberId, … }`).
   * @returns `true` si une règle s'applique et toutes ses conditions sont vérifiées.
   */
  can(subject: Subject, action: string, resource: string, target: object): boolean {
    return allowsResource(
      applicableRules(this.definition, subject, action, resource),
      subject,
      target,
    );
  }

  /**
   * Vérifie que le sujet peut faire l'action sur cette ressource, sinon lève l'erreur HTTP
   * adaptée. À appeler dans le service, après avoir chargé la ressource.
   *
   * @param subject - Sujet.
   * @param action - Action.
   * @param resource - Type de ressource.
   * @param target - Ressource chargée.
   * @throws {@link UnauthenticatedException} Si le sujet est absent (401).
   * @throws {@link PermissionDeniedException} Si aucune règle ne l'autorise (403).
   */
  assertCan(subject: Subject, action: string, resource: string, target: object): void {
    if (!subject) throw new UnauthenticatedException();
    if (!this.can(subject, action, resource, target)) {
      throw new PermissionDeniedException(action, resource);
    }
  }

  /**
   * Périmètre du sujet pour une action sur un type de ressource, à ajouter au filtre d'une
   * liste (`andCriteria(criteria, scope)`) : la liste ne contient alors que les ressources
   * autorisées.
   *
   * @param subject - Sujet.
   * @param action - Action (`"read"`).
   * @param resource - Type de ressource (`"loan"`).
   * @returns `{ and: [] }` sans restriction, `{ or: [] }` si rien n'est autorisé, sinon les
   * conditions des règles (en OU), références au sujet résolues.
   */
  scope(subject: Subject, action: string, resource: string): PermissionScope {
    return rulesScope(applicableRules(this.definition, subject, action, resource), subject);
  }

  /**
   * Indique si au moins une règle, tous rôles confondus, porte sur l'action et la ressource
   * (contrôle des `@Can()` au démarrage, en mode strict).
   *
   * @param action - Action.
   * @param resource - Type de ressource.
   * @returns `true` si l'action est citée par une règle.
   */
  isKnownPermission(action: string, resource: string): boolean {
    return isKnownPermission(this.definition, action, resource);
  }
}
