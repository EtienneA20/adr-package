// Map (et non objet littéral) pour qu'une entité comme « &constructor; » ne lise pas le prototype.
const NAMED_ENTITIES = new Map<string, string>([
  ["amp", "&"],
  ["lt", "<"],
  ["gt", ">"],
  ["quot", '"'],
  ["apos", "'"],
  ["nbsp", "\u00a0"],
  ["laquo", "«"],
  ["raquo", "»"],
  ["lsquo", "‘"],
  ["rsquo", "’"],
  ["ldquo", "“"],
  ["rdquo", "”"],
  ["hellip", "…"],
  ["ndash", "–"],
  ["mdash", "—"],
  ["euro", "€"],
  ["copy", "©"],
  ["oelig", "œ"],
  ["OElig", "Œ"],
  ["aelig", "æ"],
  ["AElig", "Æ"],
  ["szlig", "ß"],
]);
// Lettres accentuées (« &eacute; », « &Ccedil; ») : lettre + diacritique combinant, recomposés.
const ACCENTED_LETTER = /^([a-zA-Z])(acute|grave|circ|uml|cedil|tilde|ring)$/;
const COMBINING_MARKS = new Map<string, string>([
  ["acute", "\u0301"],
  ["grave", "\u0300"],
  ["circ", "\u0302"],
  ["uml", "\u0308"],
  ["cedil", "\u0327"],
  ["tilde", "\u0303"],
  ["ring", "\u030a"],
]);
const ENTITY = /&(#\d+|#[xX][\da-fA-F]+|[a-zA-Z]+);/g;
const MAX_CODE_POINT = 0x10ffff;

/**
 * Décode une entité de lettre accentuée (`eacute`, `Ccedil`, `ouml`…).
 *
 * @param name - Nom de l'entité, sans `&` ni `;`.
 * @returns La lettre accentuée, ou `undefined` si le nom ne correspond à aucune lettre
 * précomposée (`qacute`).
 */
function decodeAccentedLetter(name: string): string | undefined {
  const match = ACCENTED_LETTER.exec(name);
  if (match === null) {
    return undefined;
  }
  const [, letter = "", accent = ""] = match;
  // Une lettre accentuée existante se recompose en un seul caractère ; sinon l'entité est inconnue.
  const composed = (letter + (COMBINING_MARKS.get(accent) ?? "")).normalize("NFC");
  return composed.length === 1 ? composed : undefined;
}

/**
 * Décode une entité HTML, ou la renvoie telle quelle si elle est inconnue ou invalide.
 *
 * @param entity - Entité complète (`&amp;`).
 * @param body - Contenu entre `&` et `;` (`amp`, `#39`, `#x27`).
 * @returns Le caractère correspondant, ou l'entité d'origine.
 */
function decodeEntity(entity: string, body: string): string {
  if (!body.startsWith("#")) {
    return NAMED_ENTITIES.get(body) ?? decodeAccentedLetter(body) ?? entity;
  }
  const isHex = body.charAt(1).toLowerCase() === "x";
  const code = isHex ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10);
  return code <= MAX_CODE_POINT ? String.fromCodePoint(code) : entity;
}

/**
 * Décode les entités HTML d'un texte (opération inverse de `escapeHtml`).
 *
 * À utiliser pour afficher en texte brut un contenu reçu échappé (flux RSS, export HTML,
 * réponse d'une ancienne API). Décode les entités numériques (`&#39;`, `&#x27;`) et les
 * entités nommées courantes en français : `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`,
 * `&nbsp;` (espace insécable), `&laquo;`, `&raquo;`, `&lsquo;`, `&rsquo;`, `&ldquo;`,
 * `&rdquo;`, `&hellip;`, `&ndash;`, `&mdash;`, `&euro;`, `&copy;`, les ligatures (`&oelig;`,
 * `&aelig;`, `&szlig;` et leurs majuscules) et les lettres accentuées (`&eacute;`, `&egrave;`,
 * `&ecirc;`, `&euml;`, `&ccedil;`, `&ntilde;`, `&aring;`…). Les entités inconnues ou
 * invalides sont laissées telles quelles. Le décodage se fait en une passe : `&amp;lt;` donne
 * `&lt;`, pas `<`.
 *
 * @remarks
 * Le résultat n'est pas sûr à insérer dans du HTML : il peut de nouveau contenir des balises.
 *
 * @param value - Texte contenant des entités HTML.
 * @returns Le texte décodé.
 * @example
 * ```ts
 * unescapeHtml("Tom &amp; Jerry"); // "Tom & Jerry"
 * unescapeHtml("L&#x27;&eacute;l&egrave;ve"); // "L'élève"
 * unescapeHtml("&laquo;&nbsp;Bonjour&nbsp;&raquo;"); // "«\u00a0Bonjour\u00a0»"
 * ```
 * @since 0.2.0
 */
export function unescapeHtml(value: string): string {
  return value.replace(ENTITY, decodeEntity);
}
