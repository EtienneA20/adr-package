/** Index des styles de cellule de `xl/styles.xml` (ordre des `<xf>` de `cellXfs`). */
export const XLSX_STYLE = {
  DEFAULT: 0,
  HEADER: 1,
  DATE: 2,
  DATETIME: 3,
  CURRENCY: 4,
  QUOTED_TEXT: 5,
} as const;

const MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships";
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

// Caractères interdits en XML 1.0 (contrôles sauf tabulation et retours à la ligne).
// eslint-disable-next-line no-control-regex -- c'est précisément ce qu'on retire
const INVALID_XML = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

/**
 * Échappe un texte pour du XML (contenu ou attribut) et retire les caractères interdits.
 *
 * @param value - Texte brut.
 * @returns Le texte échappé.
 * @internal
 */
export function escapeXml(value: string): string {
  return value
    .replace(INVALID_XML, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Nom de colonne Excel d'un index à partir de 0 (`0` → `A`, `26` → `AA`).
 *
 * @param index - Index de la colonne.
 * @returns Le nom de la colonne.
 * @internal
 */
export function columnName(index: number): string {
  let name = "";
  for (let rest = index + 1; rest > 0; rest = Math.floor((rest - 1) / 26)) {
    name = String.fromCharCode(65 + ((rest - 1) % 26)) + name;
  }
  return name;
}

/**
 * Nom d'onglet valide : sans `[ ] : * ? / \`, 31 caractères au plus, `Export` par défaut.
 *
 * @param name - Nom souhaité.
 * @returns Le nom assaini.
 * @internal
 */
export function sheetName(name: string | undefined): string {
  const cleaned = (name ?? "")
    .replace(/[[\]:*?/\\]/g, " ")
    .trim()
    .slice(0, 31)
    .trim();
  return cleaned || "Export";
}

const STYLES = `${XML_HEADER}<styleSheet xmlns="${MAIN_NS}"><numFmts count="3"><numFmt numFmtId="164" formatCode="dd/mm/yyyy"/><numFmt numFmtId="165" formatCode="dd/mm/yyyy hh:mm"/><numFmt numFmtId="166" formatCode="#,##0.00\\ &quot;€&quot;"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="6"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" quotePrefix="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;

/**
 * Parties fixes d'un classeur XLSX à un onglet (types de contenu, relations, classeur,
 * styles), dans l'ordre d'écriture de l'archive.
 *
 * @param name - Nom de l'onglet (déjà assaini).
 * @returns Les couples chemin / contenu XML.
 * @internal
 */
export function xlsxStaticParts(name: string): readonly (readonly [string, string])[] {
  return [
    [
      "[Content_Types].xml",
      `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    ],
    [
      "_rels/.rels",
      `${XML_HEADER}<Relationships xmlns="${PKG_REL_NS}"><Relationship Id="rId1" Type="${REL_NS}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    ],
    [
      "xl/workbook.xml",
      `${XML_HEADER}<workbook xmlns="${MAIN_NS}" xmlns:r="${REL_NS}"><sheets><sheet name="${escapeXml(name)}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    ],
    [
      "xl/_rels/workbook.xml.rels",
      `${XML_HEADER}<Relationships xmlns="${PKG_REL_NS}"><Relationship Id="rId1" Type="${REL_NS}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${REL_NS}/styles" Target="styles.xml"/></Relationships>`,
    ],
    ["xl/styles.xml", STYLES],
  ];
}

/**
 * Début de la feuille : volet figé sous l'en-tête, largeurs de colonnes, ouverture des données.
 *
 * @param widths - Largeur de chaque colonne (`undefined` : largeur par défaut).
 * @returns Le début du XML de la feuille.
 * @internal
 */
export function sheetStart(widths: readonly (number | undefined)[]): string {
  const cols = widths
    .map((width, index) =>
      width === undefined
        ? ""
        : `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`,
    )
    .join("");
  return `${XML_HEADER}<worksheet xmlns="${MAIN_NS}"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols ? `<cols>${cols}</cols>` : ""}<sheetData>`;
}

/**
 * Fin de la feuille : filtre automatique sur l'en-tête et les données.
 *
 * @param columnCount - Nombre de colonnes.
 * @param rowCount - Nombre de lignes écrites, en-tête compris.
 * @returns La fin du XML de la feuille.
 * @internal
 */
export function sheetEnd(columnCount: number, rowCount: number): string {
  return `</sheetData><autoFilter ref="A1:${columnName(columnCount - 1)}${rowCount}"/></worksheet>`;
}
