## Description

<!-- Ce que change cette PR et pourquoi. Le titre suit Conventional Commits : `feat(adr-react): …`. -->

## Checklist « terminé »

- [ ] TSDoc français complet sur chaque élément public ajouté ou modifié (description, `@param`, `@returns`, `@throws`, `@example`, `@since`)
- [ ] Tests : cas nominal, cas limites, cas d'erreur (et rendu / interactions / accessibilité pour un composant) ; couverture ≥ 90 %
- [ ] Élément exporté via les `index.ts` et ajouté à `SKILLS.md`
- [ ] Skills régénérés (`pnpm run install:skills`) et `.claude/skills/` commité
- [ ] Page de documentation dans `apps/docs` (démo live pour adr-react, guide pour adr-nest / adr-misc)
- [ ] Changeset ajouté (`pnpm changeset`) avec le bon type : patch, minor ou major
- [ ] `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm check:skills`, `pnpm run install:skills --check` et `pnpm build` passent sans avertissement
