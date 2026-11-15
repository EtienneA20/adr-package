import type { FieldDefinitions, IListQueryDefinition } from "@etiennea20/adr-misc/contract";

import { EApiErrorCode, ValidationException } from "../../common";
import type { IListCriteria } from "../list-criteria";
import { type IListCriteriaOptions, toListCriteria } from "../to-list-criteria";

/**
 * Options de `parseListQuery` et du décorateur `ListQuery`.
 *
 * @typeParam T - Définitions des champs du contrat.
 * @example
 * ```ts
 * const options: IListQueryParamOptions<typeof bookFields> = { source: "body", columns: { authorName: "author.name" } };
 * ```
 * @since 0.2.0
 */
export interface IListQueryParamOptions<
  T extends FieldDefinitions = FieldDefinitions,
> extends IListCriteriaOptions<T> {
  /**
   * Forme de l'entrée : `"query"` (paramètres d'URL, un par clé en JSON ; par défaut) ou
   * `"body"` (objet, pour `POST …/search`).
   */
  readonly source?: "query" | "body";
}

function hasLimitIssue(issues: readonly { params?: unknown }[]): boolean {
  return issues.some((issue) => {
    const params = issue.params as { code?: unknown } | undefined;
    return params?.code === EApiErrorCode.QUERY_LIMIT_EXCEEDED;
  });
}

/**
 * Valide une requête de liste reçue du client et la convertit en critères.
 *
 * Utilisé par le décorateur `ListQuery` ; à appeler directement quand l'entrée ne vient pas
 * d'un paramètre de route (WebSocket, file de messages). Rien de ce qui vient du client ne
 * devient une requête brute : champs en liste blanche, limites du contrat, valeurs validées.
 *
 * @typeParam T - Définitions des champs du contrat.
 * @param definition - Contrat de liste (`defineListQuery`).
 * @param input - `req.query` (source `"query"`) ou `req.body` (source `"body"`).
 * @param options - Source de l'entrée et chemins de colonnes.
 * @returns Les critères de liste.
 * @throws {@link ValidationException} 400 `QUERY_LIMIT_EXCEEDED` si une limite du contrat est
 * dépassée, sinon 400 `INVALID_QUERY` si la requête est invalide (détail par champ).
 * @throws {@link ListQueryConfigError} Si `options.columns` est invalide (erreur de configuration).
 * @example
 * ```ts
 * const criteria = parseListQuery(bookListQuery, payload, { source: "body" });
 * ```
 * @since 0.2.0
 */
export function parseListQuery<T extends FieldDefinitions>(
  definition: IListQueryDefinition<T>,
  input: unknown,
  options: IListQueryParamOptions<T> = {},
): IListCriteria {
  const schema = options.source === "body" ? definition.schema : definition.searchParamsSchema;
  const result = schema.safeParse(input);
  if (!result.success) {
    const limit = hasLimitIssue(result.error.issues as readonly { params?: unknown }[]);
    throw new ValidationException(result.error.issues, {
      code: limit ? EApiErrorCode.QUERY_LIMIT_EXCEEDED : EApiErrorCode.INVALID_QUERY,
      title: limit ? "Limite de la requête de liste dépassée" : "Paramètres de liste invalides",
    });
  }
  return toListCriteria(definition, result.data, options);
}
