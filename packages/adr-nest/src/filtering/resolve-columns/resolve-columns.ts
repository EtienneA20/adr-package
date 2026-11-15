import type { FieldDefinitions, IListQueryDefinition } from "@etiennea20/adr-misc/contract";

import { ListQueryConfigError } from "../list-query-config-error";

/** Chemin de colonne : segments identifiants séparés par des points. */
const PATH_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/;
const RESERVED_SEGMENTS = new Set(["__proto__", "constructor", "prototype"]);

function checkPath(field: string, path: string): void {
  const reserved = path.split(".").some((segment) => RESERVED_SEGMENTS.has(segment));
  if (!PATH_PATTERN.test(path) || reserved) {
    throw new ListQueryConfigError(
      `Colonne invalide « ${path} » pour le champ « ${field} » : segments identifiants séparés par des points.`,
    );
  }
}

/**
 * Associe chaque champ public d'un contrat à son chemin de colonne côté serveur.
 *
 * Pourquoi une association côté serveur : les noms du contrat sont publics et stables, les
 * colonnes peuvent changer (renommage, relation) sans casser le front. Par défaut, le chemin est
 * le nom du champ.
 *
 * @typeParam T - Définitions des champs du contrat.
 * @param definition - Contrat de liste.
 * @param columns - Chemins de colonnes par nom de champ (facultatif, champ par champ).
 * @returns Le chemin de colonne de chaque champ.
 * @throws {@link ListQueryConfigError} Si un champ est absent du contrat ou si un chemin est invalide.
 * @example
 * ```ts
 * resolveColumns(bookListQuery, { authorName: "author.name" }).get("authorName"); // "author.name"
 * ```
 * @internal
 */
export function resolveColumns<T extends FieldDefinitions>(
  definition: IListQueryDefinition<T>,
  columns: Readonly<Record<string, string | undefined>> = {},
): ReadonlyMap<string, string> {
  for (const field of Object.keys(columns)) {
    if (!Object.hasOwn(definition.fields, field)) {
      throw new ListQueryConfigError(
        `Colonne déclarée pour un champ absent du contrat : « ${field} ».`,
      );
    }
  }
  return new Map(
    Object.keys(definition.fields).map((field) => {
      const path = columns[field] ?? field;
      checkPath(field, path);
      return [field, path];
    }),
  );
}
