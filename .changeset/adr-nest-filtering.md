---
"@etiennea20/adr-nest": minor
---

Ajoute le sous-chemin `@etiennea20/adr-nest/filtering` (peerDependencies optionnelles `@etiennea20/adr-misc` ≥ 0.3 et `zod` ≥ 4) : décorateur `ListQuery` qui valide une requête de liste avec le contrat partagé avec le front et la convertit en critères neutres (`IListCriteria`), `parseListQuery`, `toListCriteria`, `andCriteria`, `applyCriteriaInMemory` et `toPage`. Ajoute le sous-chemin `@etiennea20/adr-nest/prisma` : `toPrismaFindArgs` et `toPrismaWhere` (objets simples, sans dépendance à `@prisma/client`).
