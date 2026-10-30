import { typedEntries } from "../typed-entries";

/**
 * Crée un nouvel objet avec les mêmes clés et des valeurs transformées.
 *
 * À utiliser pour convertir toutes les valeurs d'un objet (compteurs en pourcentages, dates en
 * chaînes, libellés traduits…). Seules les propriétés propres, énumérables et à clé chaîne sont
 * parcourues. L'objet d'origine n'est pas modifié.
 *
 * @typeParam T - Type de l'objet source.
 * @typeParam R - Type des nouvelles valeurs.
 * @param object - Objet source.
 * @param mapper - Reçoit la valeur et la clé ; renvoie la nouvelle valeur.
 * @returns Un nouvel objet aux mêmes clés, dont chaque valeur est de type `R`.
 * @example
 * ```ts
 * mapValues({ roman: 12, essai: 3 }, (count) => `${count} livre(s)`);
 * // { roman: "12 livre(s)", essai: "3 livre(s)" }
 * ```
 * @since 0.2.0
 */
export function mapValues<T extends object, R>(
  object: T,
  mapper: (value: T[keyof T & string], key: keyof T & string) => R,
): { [K in keyof T]: R } {
  return Object.fromEntries(
    typedEntries(object).map(([key, value]) => [key, mapper(value, key)]),
  ) as { [K in keyof T]: R };
}
