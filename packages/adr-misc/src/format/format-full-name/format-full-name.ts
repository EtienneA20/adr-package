/**
 * Prénom et nom d'une personne, tels que stockés (casse et espaces quelconques).
 *
 * @example
 * ```ts
 * const member: IPersonName = { firstName: "marie", lastName: "Dupont" };
 * formatFullName(member); // "Marie DUPONT"
 * ```
 * @since 0.2.0
 */
export interface IPersonName {
  /** Prénom (composé ou non : « jean-pierre », « Marie Ève »). */
  readonly firstName?: string | null;
  /** Nom de famille (« Dupont », « de La Fontaine »). */
  readonly lastName?: string | null;
}

/**
 * Options de {@link formatFullName}.
 *
 * @example
 * ```ts
 * const options: IFormatFullNameOptions = { order: "lastFirst" };
 * formatFullName({ firstName: "Marie", lastName: "Dupont" }, options); // "DUPONT Marie"
 * ```
 * @since 0.2.0
 */
export interface IFormatFullNameOptions {
  /**
   * Ordre : `firstLast` (« Marie DUPONT », pour un affichage) ou `lastFirst` (« DUPONT
   * Marie », pour une liste triée par nom).
   *
   * @defaultValue `"firstLast"`
   */
  readonly order?: "firstLast" | "lastFirst";
  /**
   * Écrit le nom de famille en majuscules, selon l'usage administratif français. Sinon, il est
   * conservé tel quel (seuls les espaces sont normalisés), car sa casse ne se devine pas
   * (« de La Fontaine », « McDonald »).
   *
   * @defaultValue `true`
   */
  readonly uppercaseLastName?: boolean;
}

/**
 * Supprime les espaces autour et les espaces multiples.
 *
 * @param text - Texte à normaliser.
 * @returns Le texte normalisé, `""` si `text` est absent.
 */
function normalizeSpaces(text: string | null | undefined): string {
  return (text ?? "").trim().replace(/\s+/g, " ");
}

/**
 * Met une majuscule au début de chaque partie d'un prénom (après une espace, un tiret ou une
 * apostrophe) et des minuscules ailleurs : « JEAN-PIERRE » donne « Jean-Pierre ».
 *
 * @param firstName - Prénom normalisé.
 * @returns Le prénom capitalisé.
 */
function capitalizeFirstName(firstName: string): string {
  return firstName
    .toLocaleLowerCase("fr-FR")
    .replace(
      /(^|[\s\-'’])(\p{L})/gu,
      (_match, separator: string, letter: string) =>
        `${separator}${letter.toLocaleUpperCase("fr-FR")}`,
    );
}

/**
 * Formate le nom complet d'une personne à la française : « Marie DUPONT ».
 *
 * À utiliser pour afficher un adhérent, un auteur ou un bibliothécaire de façon homogène, quelle
 * que soit la casse de la saisie. Le prénom est capitalisé (« jean-pierre » donne
 * « Jean-Pierre ») ; un prénom ou un nom absent est simplement omis.
 *
 * @param person - Prénom et nom (voir {@link IPersonName}).
 * @param options - Ordre et casse du nom (voir {@link IFormatFullNameOptions}).
 * @returns Le nom complet, ou `""` si ni le prénom ni le nom n'est renseigné.
 * @example
 * ```ts
 * formatFullName({ firstName: "jean-pierre", lastName: "Dupont" }); // "Jean-Pierre DUPONT"
 * formatFullName({ firstName: "Marie", lastName: "Curie" }, { order: "lastFirst" }); // "CURIE Marie"
 * formatFullName({ lastName: "de La Fontaine" }, { uppercaseLastName: false }); // "de La Fontaine"
 * ```
 * @since 0.2.0
 */
export function formatFullName(person: IPersonName, options: IFormatFullNameOptions = {}): string {
  const firstName = capitalizeFirstName(normalizeSpaces(person.firstName));
  const lastName = normalizeSpaces(person.lastName);
  const displayedLastName =
    options.uppercaseLastName === false ? lastName : lastName.toLocaleUpperCase("fr-FR");
  const parts =
    options.order === "lastFirst" ? [displayedLastName, firstName] : [firstName, displayedLastName];
  return parts.filter((part) => part !== "").join(" ");
}
