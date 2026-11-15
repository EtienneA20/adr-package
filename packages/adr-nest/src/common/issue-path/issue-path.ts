import type { IApiErrorIssue } from "../api-error";
import type { IStandardSchemaIssue } from "../standard-schema";

function segmentName(segment: PropertyKey | { readonly key: PropertyKey }): string {
  const key = typeof segment === "object" ? segment.key : segment;
  return typeof key === "symbol" ? (key.description ?? "") : String(key);
}

function stringProperty(source: object, key: string): string | undefined {
  const value: unknown = Reflect.get(source, key);
  return typeof value === "string" ? value : undefined;
}

/**
 * Convertit les problèmes d'un schéma Standard Schema en problèmes du format d'erreur d'API.
 *
 * Pourquoi lire `params.code` puis `code` : un problème zod porte son code (`invalid_type`),
 * mais les contrôles du contrat de liste d'adr-misc posent un code applicatif plus précis
 * (`QUERY_LIMIT_EXCEEDED`) dans `params.code`. Les autres bibliothèques n'en ont pas : `code`
 * est alors absent.
 *
 * @param issues - Problèmes renvoyés par le schéma.
 * @returns Les problèmes, chemin en notation pointée (`"items.0.title"`).
 * @example
 * ```ts
 * toApiErrorIssues([{ message: "Requis", path: ["items", 0, "title"] }]);
 * // [{ path: "items.0.title", message: "Requis" }]
 * ```
 * @internal
 */
export function toApiErrorIssues(issues: readonly IStandardSchemaIssue[]): IApiErrorIssue[] {
  return issues.map((issue) => {
    const params: unknown = Reflect.get(issue, "params");
    const code =
      (typeof params === "object" && params !== null
        ? stringProperty(params, "code")
        : undefined) ?? stringProperty(issue, "code");
    return {
      path: (issue.path ?? []).map(segmentName).join("."),
      message: issue.message,
      ...(code === undefined ? {} : { code }),
    };
  });
}
