import { foldText } from "../fold-for-search";

/**
 * Indique si un texte correspond à une recherche, sans tenir compte de la casse ni des accents.
 *
 * À utiliser pour filtrer une liste côté client à partir d'un champ de recherche (livres,
 * adhérents, options d'une liste déroulante). La requête est découpée en mots : **tous** les
 * mots doivent apparaître dans le texte, dans n'importe quel ordre, éventuellement au milieu
 * d'un mot (« hug vic » trouve « Victor Hugo »). La comparaison ignore la casse, les accents
 * et les ligatures (« oeuvre » trouve « Œuvre »), les types d'espaces et d'apostrophes
 * (« l'ile » trouve « L’Île »). Une requête vide ou blanche correspond à tout.
 *
 * @param text - Texte dans lequel chercher (titre, nom…). Pour chercher dans plusieurs champs,
 * les concaténer avec une espace.
 * @param query - Recherche saisie par l'utilisateur.
 * @returns `true` si chaque mot de la requête apparaît dans le texte.
 * @example
 * ```ts
 * matchesSearch("Les Misérables, Victor Hugo", "hugo miserables"); // true
 * matchesSearch("L’Œuvre au noir", "oeuvre"); // true
 * matchesSearch("Le Petit Prince", "petit roi"); // false
 * ```
 * @since 0.2.0
 */
export function matchesSearch(text: string, query: string): boolean {
  const foldedText = foldText(text);
  return foldText(query)
    .split(" ")
    .filter((word) => word !== "")
    .every((word) => foldedText.includes(word));
}
