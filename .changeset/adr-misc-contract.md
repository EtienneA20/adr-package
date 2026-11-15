---
"@etiennea20/adr-misc": minor
---

Ajoute le sous-chemin `@etiennea20/adr-misc/contract` (zod ≥ 4 en peerDependency optionnelle) : contrat de liste partagé front / back (`defineListQuery` : filtre en arbre `and` / `or` / `not` sur liste blanche, recherche `q`, tri, pagination par pages, sélection de champs, limites configurables, encodage en paramètres d'URL avec `toListQuerySearchParams`), page de résultats (`pageSchema`) et format d'erreur d'API RFC 9457 (`apiErrorSchema`, `EApiErrorCode`). L'entrée principale ne dépend pas de zod.
