/**
 * Sous-chemin `@etiennea20/adr-nest/filtering` (exige `zod` ≥ 4 et `@etiennea20/adr-misc`) :
 * requêtes de liste validées par le contrat partagé avec le front et converties en critères
 * neutres vis-à-vis de l'ORM.
 *
 * @packageDocumentation
 * @module filtering
 */

export * from "./and-criteria";
export * from "./apply-criteria-in-memory";
export type * from "./list-criteria";
export * from "./list-query";
export * from "./list-query-config-error";
export * from "./parse-list-query";
export * from "./to-list-criteria";
export * from "./to-page";
