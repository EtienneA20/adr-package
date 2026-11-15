import type { CriteriaNode, IListCriteria } from "../list-criteria";

/**
 * Ajoute une condition **de confiance** du serveur aux critères d'une requête client
 * (combinaison par `and`).
 *
 * À utiliser pour restreindre une liste à ce que le sujet a le droit de voir (périmètre d'une
 * règle de droits) ou à un état imposé (livres non supprimés). La condition n'est pas soumise à
 * la liste blanche du contrat : elle vient du code serveur et utilise des chemins de colonnes.
 *
 * @param criteria - Critères issus de la requête client.
 * @param condition - Condition imposée par le serveur.
 * @returns De nouveaux critères (les critères d'origine ne sont pas modifiés).
 * @example
 * ```ts
 * const scoped = andCriteria(criteria, { path: "ownerId", op: "eq", value: member.id, caseSensitive: false });
 * ```
 * @since 0.2.0
 */
export function andCriteria(criteria: IListCriteria, condition: CriteriaNode): IListCriteria {
  return { ...criteria, where: criteria.where ? { and: [criteria.where, condition] } : condition };
}
