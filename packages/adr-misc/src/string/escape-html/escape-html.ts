/**
 * Échappe les caractères spéciaux HTML (`&`, `<`, `>`, `"`, `'`) d'un texte.
 *
 * À utiliser avant d'insérer un texte non maîtrisé (saisie utilisateur, donnée d'API) dans du
 * HTML construit à la main : gabarit d'e-mail, export HTML, `innerHTML`. Le texte échappé
 * s'affiche tel quel au lieu d'être interprété comme du balisage, ce qui prévient l'injection
 * de code (XSS) dans le contenu d'un élément et dans un attribut entre guillemets.
 *
 * @remarks
 * Inutile avec React, qui échappe déjà le texte rendu dans le JSX. Ne suffit pas pour une URL
 * (`href`) ni pour du code JavaScript ou CSS.
 *
 * @param value - Texte à échapper.
 * @returns Le texte avec les caractères spéciaux remplacés par des entités HTML.
 * @example
 * ```ts
 * escapeHtml(`<script>alert("pirate")</script>`);
 * // "&lt;script&gt;alert(&quot;pirate&quot;)&lt;/script&gt;"
 * escapeHtml("Tom & Jerry"); // "Tom &amp; Jerry"
 * ```
 * @since 0.2.0
 */
export function escapeHtml(value: string): string {
  // « & » en premier pour ne pas rééchapper les entités produites par les remplacements suivants.
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
