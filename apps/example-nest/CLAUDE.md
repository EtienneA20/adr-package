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
- Pas de `main.ts` : démarrer un serveur HTTP demanderait `@nestjs/platform-express`, absent
  du dépôt (le proposer avant de l'ajouter).

## Docker et build de la doc

La doc ne dépend pas de cette application : les extraits sont commités dans les pages `.mdx`.
`turbo prune @etiennea20/docs` ne l'embarque donc pas, et l'image Docker n'a besoin ni d'elle
ni du script de synchronisation.
