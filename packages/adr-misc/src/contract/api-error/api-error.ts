import { z } from "zod";

/**
 * Type de média d'une réponse d'erreur au format RFC 9457 (Problem Details for HTTP APIs).
 *
 * À utiliser comme en-tête `Content-Type` d'une réponse d'erreur côté serveur, ou pour
 * reconnaître une erreur normalisée côté front.
 *
 * @example
 * ```ts
 * response.headers.get("content-type")?.startsWith(API_ERROR_CONTENT_TYPE);
 * ```
 * @since 0.3.0
 */
export const API_ERROR_CONTENT_TYPE = "application/problem+json";

/**
 * Schéma d'un problème précis d'une erreur d'API (un champ invalide, une limite dépassée).
 *
 * `path` est le chemin du champ en notation pointée (`"items.0.title"`, `""` pour la racine) :
 * il se passe tel quel à `setError` de react-hook-form. `code` est facultatif (code zod comme
 * `"invalid_type"`, ou code applicatif comme `"QUERY_LIMIT_EXCEEDED"`).
 *
 * @example
 * ```ts
 * apiErrorIssueSchema.parse({ path: "title", message: "Champ requis" });
 * ```
 * @since 0.3.0
 */
export const apiErrorIssueSchema = z.object({
  path: z.string(),
  message: z.string(),
  code: z.string().optional(),
});

/**
 * Problème précis d'une erreur d'API, inféré de {@link apiErrorIssueSchema}.
 *
 * @example
 * ```ts
 * const issue: ApiErrorIssue = { path: "filter.or.1.value", message: "Nombre attendu" };
 * ```
 * @since 0.3.0
 */
export type ApiErrorIssue = z.infer<typeof apiErrorIssueSchema>;

/**
 * Schéma du corps d'une réponse d'erreur d'API : RFC 9457 (Problem Details) étendue par un
 * code stable, le détail par champ et l'identifiant de corrélation.
 *
 * À utiliser côté front pour lire une erreur reçue (`apiErrorSchema.safeParse(body)`), et
 * côté serveur pour typer ou vérifier le corps produit par le filtre d'exceptions.
 * Champs : `type` (URI du type de problème, `"about:blank"` par défaut), `title` (résumé
 * lisible), `status` (statut HTTP), `detail` et `instance` (facultatifs), `code` (voir
 * `EApiErrorCode`, ou un code propre à l'application), `errors` (problèmes par champ) et
 * `requestId` (identifiant de corrélation de la requête). Les membres inconnus sont ignorés,
 * comme le prévoit la RFC.
 *
 * @example
 * ```ts
 * const result = apiErrorSchema.safeParse(await response.json());
 * if (result.success && result.data.code === EApiErrorCode.VALIDATION_FAILED) {
 *   for (const issue of result.data.errors ?? []) setError(issue.path, { message: issue.message });
 * }
 * ```
 * @since 0.3.0
 */
export const apiErrorSchema = z.object({
  type: z.string().default("about:blank"),
  title: z.string(),
  status: z.int().min(100).max(599),
  detail: z.string().optional(),
  instance: z.string().optional(),
  code: z.string(),
  errors: z.array(apiErrorIssueSchema).optional(),
  requestId: z.string().optional(),
});

/**
 * Corps d'une réponse d'erreur d'API, inféré de {@link apiErrorSchema}.
 *
 * @example
 * ```ts
 * const body: ApiError = { type: "about:blank", title: "Accès refusé", status: 403, code: "FORBIDDEN" };
 * ```
 * @since 0.3.0
 */
export type ApiError = z.infer<typeof apiErrorSchema>;
