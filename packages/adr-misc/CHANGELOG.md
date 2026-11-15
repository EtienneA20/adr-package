# @etiennea20/adr-misc

## 0.3.0

### Minor Changes

- [#12](https://github.com/EtienneA20/adr-package/pull/12) [`a38219c`](https://github.com/EtienneA20/adr-package/commit/a38219c27d8395e279dde5e9614371c05ed56d33) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Ajoute le sous-chemin `@etiennea20/adr-misc/contract` (zod ≥ 4 en peerDependency optionnelle) : contrat de liste partagé front / back (`defineListQuery` : filtre en arbre `and` / `or` / `not` sur liste blanche, recherche `q`, tri, pagination par pages, sélection de champs, limites configurables, encodage en paramètres d'URL avec `toListQuerySearchParams`), page de résultats (`pageSchema`) et format d'erreur d'API RFC 9457 (`apiErrorSchema`, `EApiErrorCode`). L'entrée principale ne dépend pas de zod.

## 0.2.1

### Patch Changes

- [#10](https://github.com/EtienneA20/adr-package/pull/10) [`86f85a8`](https://github.com/EtienneA20/adr-package/commit/86f85a88a335b3ce5235cbb84fc2063a1b621441) Thanks [@EtienneA20](https://github.com/EtienneA20)! - La commande d'installation des skills (`adr-nest-skills`, `adr-misc-skills`) n'installe que le skill du package et vérifie sa présence avant de copier.

## 0.2.0

### Minor Changes

- [#4](https://github.com/EtienneA20/adr-package/pull/4) [`ba01a3c`](https://github.com/EtienneA20/adr-package/commit/ba01a3c1a8f66817c03aa9e7551bda279451b3c6) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Ajoute environ 200 utilitaires répartis en 19 catégories : assertions et gestion d'erreurs
  (`core`), gardes de type (`guards`), types utilitaires (`types`), fonctions d'ordre supérieur
  (`function`), asynchrone (`async` : `retry`, `debounce`, `withTimeout`…), tableaux (`array`),
  objets (`object`), chaînes (`string`) et casse (`case`), calculs (`math`), aléatoire
  (`random`), parsing (`parsing` : nombres, dates, durées, CSV), formatage français (`format`),
  dates (`date` : jours fériés, jours ouvrés), énumérations (`enums`), validation (`validation` :
  email, SIRET, IBAN, NIR…), URL (`url`), fichiers (`file`) et couleurs (`color`).

## 0.1.0

### Minor Changes

- [`6bfd107`](https://github.com/EtienneA20/adr-package/commit/6bfd107004a99c75dc8e8295c45112fd147f2eb4) Thanks [@EtienneA20](https://github.com/EtienneA20)! - Première version de `@etiennea20/adr-misc` : structure du package et utilitaire `invariant`.
