import { z } from "zod";

import { EApiErrorCode } from "../api-error-code";

/** Clés d'une requête de liste lues dans les paramètres d'URL ; les autres sont ignorées. */
export const LIST_QUERY_KEYS = [
  "filter",
  "q",
  "sort",
  "page",
  "pageSize",
  "fields",
  "withTotal",
] as const;

/** Clés dont la valeur est toujours un texte : `q=123` reste `"123"`. */
const STRING_KEYS = new Set<string>(["q"]);

function decodeValue(key: string, raw: string): unknown {
  try {
    const parsed: unknown = JSON.parse(raw);
    return STRING_KEYS.has(key) && typeof parsed !== "string" ? raw : parsed;
  } catch {
    return raw;
  }
}

function decodeEntry(
  key: string,
  raw: unknown,
  maxLength: number,
  ctx: z.core.$RefinementCtx,
): unknown {
  if (typeof raw !== "string") {
    ctx.addIssue({
      code: "custom",
      path: [key],
      message: `Le paramètre « ${key} » doit apparaître une seule fois, sous forme de texte.`,
    });
    return undefined;
  }
  if (raw.length > maxLength) {
    ctx.addIssue({
      code: "custom",
      path: [key],
      message: `Le paramètre « ${key} » dépasse ${maxLength} caractères.`,
      params: { code: EApiErrorCode.QUERY_LIMIT_EXCEEDED, limit: "maxParamLength" },
    });
    return undefined;
  }
  return decodeValue(key, raw);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Crée le schéma qui décode les paramètres d'URL d'une requête de liste (un paramètre par
 * clé, valeur encodée en JSON) avant de les passer au schéma de la requête.
 *
 * Même convention que la sérialisation par défaut de TanStack Router : une valeur est lue
 * comme du JSON si possible, sinon comme un texte brut (`?q=dune`). Chaque paramètre est
 * borné en longueur **avant** `JSON.parse`. Les valeurs répétées (`?page=1&page=2`) ou
 * imbriquées (parseur `qs` étendu) sont refusées. L'objet produit ne contient que les clés de
 * la requête de liste (construit par `Object.fromEntries` : une clé `__proto__` ne modifie
 * aucun prototype).
 *
 * @typeParam T - Type de sortie du schéma de requête.
 * @param target - Schéma de la requête de liste.
 * @param maxParamLength - Longueur maximale d'un paramètre.
 * @returns Le schéma qui accepte l'objet des paramètres d'URL (`req.query`, search params).
 * @example
 * ```ts
 * createSearchParamsSchema(schema, 4096).parse({ page: "2", q: "dune" });
 * ```
 * @internal
 */
export function createSearchParamsSchema<T>(
  target: z.ZodType<T>,
  maxParamLength: number,
): z.ZodType<T, Readonly<Record<string, unknown>>> {
  return z
    .custom<Readonly<Record<string, unknown>>>(isRecord, {
      error: "Les paramètres de la requête doivent être un objet.",
    })
    .transform((params, ctx): unknown => {
      const entries = LIST_QUERY_KEYS.filter(
        (key) => Object.hasOwn(params, key) && params[key] !== undefined,
      ).map((key) => [key, decodeEntry(key, params[key], maxParamLength, ctx)] as const);
      return Object.fromEntries(entries);
    })
    .pipe(target);
}
