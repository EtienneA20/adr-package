import type { FieldDefinitions, IListQueryDefinition } from "@etiennea20/adr-misc/contract";
import { type ExecutionContext, createParamDecorator } from "@nestjs/common";

import { type IListQueryParamOptions, parseListQuery } from "../parse-list-query";
import { resolveColumns } from "../resolve-columns";

interface IListRequest {
  readonly query?: unknown;
  readonly body?: unknown;
}

/**
 * Décorateur de paramètre : la requête de liste (filtre, recherche, tri, pagination,
 * sélection), validée par le contrat partagé avec le front et convertie en `IListCriteria`.
 *
 * À utiliser sur une route de liste (`GET /livres`) ou de recherche (`POST /livres/search`,
 * `source: "body"`). Les colonnes sont vérifiées dès la déclaration (au démarrage). En cas de
 * requête invalide, la route n'est pas appelée : 400 `INVALID_QUERY` ou `QUERY_LIMIT_EXCEEDED`
 * au format d'erreur d'API.
 *
 * @typeParam T - Définitions des champs du contrat.
 * @param definition - Contrat de liste (`defineListQuery`), partagé avec le front.
 * @param options - Source (`"query"` par défaut ou `"body"`) et chemins de colonnes.
 * @returns Un décorateur de paramètre qui fournit les critères.
 * @throws {@link ListQueryConfigError} À la déclaration, si `options.columns` est invalide.
 * @throws {@link ValidationException} À l'exécution de la route, si la requête est invalide.
 * @example
 * ```ts
 * @Get()
 * list(@ListQuery(bookListQuery, { columns: { authorName: "author.name" } }) criteria: IListCriteria) {
 *   return this.books.findPage(criteria);
 * }
 * ```
 * @since 0.2.0
 */
export function ListQuery<T extends FieldDefinitions>(
  definition: IListQueryDefinition<T>,
  options: IListQueryParamOptions<T> = {},
): ParameterDecorator {
  resolveColumns(definition, options.columns);
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<IListRequest>();
    const input = options.source === "body" ? request.body : request.query;
    return parseListQuery(definition, input, options);
  })();
}
