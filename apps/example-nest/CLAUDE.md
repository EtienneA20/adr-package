# CLAUDE.md : `apps/example-nest`

Complète le `CLAUDE.md` racine (à lire d'abord), puis `packages/adr-nest/CLAUDE.md`.

## Rôle

Application NestJS **fictive** « Bibliothèque » (livres, adhérents, emprunts), **privée** : jamais
publiée, ignorée par Changesets (`ignore` de `.changeset/config.json`). Elle sert d'exemple
complet aux guides d'adr-nest : chaque extrait de code d'un guide est recopié depuis ses
fichiers par `pnpm run sync:snippets`, ce qui garantit que la documentation montre du code
compilé, linté et testé.

## Règles

- Utiliser les packages comme un consommateur : imports par `@etiennea20/adr-nest`
  (et ses sous-chemins), `@etiennea20/adr-misc`, jamais par chemin relatif vers `packages/`.
- Aucune base de données ni accès réseau : dépôts en mémoire, données de démonstration dans le
  code (`src/books/book.ts`). Tests Vitest + SWC avec `Test.createTestingModule`, comme
  adr-nest (`vitest.config.mts`, `vitest.setup.ts`), couverture ≥ 90 %.
- Mêmes conventions que les packages (nommage, `index.ts` par dossier, aucun import profond,
  messages en français), mais pas de TSDoc exigé (`documentation: false` dans ESLint) : un
  commentaire explique le **pourquoi** quand c'est utile.
- Une région citée par la doc est délimitée par `// #region <nom>` et `// #endregion <nom>`
  (marqueurs retirés de l'extrait). Après toute modification d'un fichier cité :
  `pnpm run sync:snippets`, puis commiter les pages mises à jour (`--check` en CI).
- Tests de bout en bout dans `src/app.e2e.test.ts` : l'application complète sur Express
  (`@nestjs/platform-express`, devDependency de cet exemple uniquement), écoutant sur
  `127.0.0.1` et un port choisi par le système, appelée avec le `fetch` de Node (pas de
  supertest). L'authentification est simulée par un middleware de test (en-tête
  `x-test-user` → `request.user`). Une application par test (`beforeEach`), pour que les
  dépôts en mémoire repartent de zéro. Toute nouvelle route y reçoit au moins un test.
- Pas de `main.ts` : l'application n'est jamais lancée hors des tests.

## Docker et build de la doc

La doc ne dépend pas de cette application : les extraits sont commités dans les pages `.mdx`.
`turbo prune @etiennea20/docs` ne l'embarque donc pas, et l'image Docker n'a besoin ni d'elle
ni du script de synchronisation.
