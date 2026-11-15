import { ApiException, EApiErrorCode } from "../../common";

/**
 * Nombre maximal de lignes d'un export par défaut.
 *
 * @example
 * ```ts
 * assertExportSize(total, DEFAULT_EXPORT_MAX_ROWS); // 50 000
 * ```
 * @since 0.2.0
 */
export const DEFAULT_EXPORT_MAX_ROWS = 50_000;

/**
 * Export refusé car trop volumineux : 400 `EXPORT_LIMIT_EXCEEDED` au format d'erreur d'API.
 *
 * Levée par `assertExportSize` (avant l'envoi : réponse d'erreur propre) ou par
 * `limitExportRows` (pendant l'envoi : le flux est interrompu, le fichier est tronqué).
 *
 * @example
 * ```ts
 * throw new ExportLimitExceededException(50_000);
 * ```
 * @since 0.2.0
 */
export class ExportLimitExceededException extends ApiException {
  /**
   * Crée l'exception.
   *
   * @param maxRows - Nombre maximal de lignes autorisé.
   */
  constructor(readonly maxRows: number) {
    super({
      status: 400,
      code: EApiErrorCode.EXPORT_LIMIT_EXCEEDED,
      title: "Export trop volumineux",
      detail: `L'export est limité à ${maxRows.toLocaleString("fr-FR")} lignes : affinez le filtre.`,
    });
  }
}

/**
 * Vérifie, **avant** d'envoyer le fichier, que l'export ne dépasse pas la limite.
 *
 * À appeler avec le nombre de lignes à exporter (comptage de la requête) : une fois l'envoi
 * commencé, le statut HTTP ne peut plus changer et une erreur ne fait que tronquer le fichier.
 *
 * @param count - Nombre de lignes à exporter.
 * @param maxRows - Limite (`DEFAULT_EXPORT_MAX_ROWS` par défaut).
 * @throws {@link ExportLimitExceededException} Si `count` dépasse `maxRows`.
 * @example
 * ```ts
 * assertExportSize(await prisma.book.count({ where }), 10_000);
 * ```
 * @since 0.2.0
 */
export function assertExportSize(count: number, maxRows = DEFAULT_EXPORT_MAX_ROWS): void {
  if (count > maxRows) throw new ExportLimitExceededException(maxRows);
}

/**
 * Parcourt les lignes d'un export en s'arrêtant au-delà de la limite : garde-fou des formats
 * d'export, utile pour un format personnalisé.
 *
 * Accepte un tableau ou un itérable asynchrone (curseur d'ORM, pagination), pour ne jamais
 * charger tout l'export en mémoire.
 *
 * @typeParam T - Type d'une ligne.
 * @param rows - Lignes (tableau, itérable ou itérable asynchrone).
 * @param maxRows - Limite (`DEFAULT_EXPORT_MAX_ROWS` par défaut).
 * @returns Les lignes, une à une.
 * @throws {@link ExportLimitExceededException} Dès que la ligne `maxRows + 1` est lue.
 * @example
 * ```ts
 * for await (const book of limitExportRows(books, 1000)) write(book);
 * ```
 * @since 0.2.0
 */
export async function* limitExportRows<T>(
  rows: Iterable<T> | AsyncIterable<T>,
  maxRows = DEFAULT_EXPORT_MAX_ROWS,
): AsyncGenerator<T> {
  let count = 0;
  for await (const row of rows) {
    count += 1;
    if (count > maxRows) throw new ExportLimitExceededException(maxRows);
    yield row;
  }
}
