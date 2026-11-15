/**
 * Sous-chemin `@etiennea20/adr-misc/contract` (exige `zod` ≥ 4) : contrat de liste partagé
 * front / back et format d'erreur d'API (RFC 9457).
 *
 * @packageDocumentation
 * @module contract
 */

export * from "./api-error";
export * from "./api-error-code";
export type * from "./field-definition";
export * from "./field-type";
export * from "./filter-node";
export * from "./filter-operator";
export * from "./list-query";
export * from "./list-query-limits";
export * from "./page";
export * from "./search-params";
