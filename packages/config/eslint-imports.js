// @ts-check

/**
 * Frontières d'imports des sources (`src/**`) : imports profonds interdits, et peerDependencies
 * optionnelles cantonnées à la catégorie exposée par leur sous-chemin `exports`.
 */

/** @typedef {import("eslint").Linter.Config} Config */
/**
 * @typedef {object} OptionalPeer
 * @property {string} name - Nom du module (`axios`, `@etiennea20/adr-misc/contract`).
 * @property {string | string[]} allowedIn - Glob(s) des fichiers autorisés à l'importer
 *   (`src/fetch/**`). Les globs de zones différentes ne doivent pas se recouvrir.
 */

const SOURCE_FILES = ["src/**/*.{ts,tsx}"];
const TEST_FILES = ["**/*.test.{ts,tsx}"];

/**
 * Un import relatif qui descend de plus d'un niveau dans un dossier (`./a/b`, `../../a/b`)
 * contourne l'`index.ts` d'un élément ou d'une catégorie : c'est un import profond.
 */
const DEEP_IMPORT_PATTERN = {
  regex: String.raw`^\.{1,2}/(?:\.\./)*[^./][^/]*/.+`,
  message: "Import profond interdit : importer via l'index.ts de l'élément ou de la catégorie.",
};

/**
 * Zones (globs) où une peerDependency optionnelle est autorisée.
 *
 * @param {OptionalPeer} peer - PeerDependency optionnelle.
 * @returns {string[]} Ses zones.
 */
function zonesOf(peer) {
  return Array.isArray(peer.allowedIn) ? peer.allowedIn : [peer.allowedIn];
}

/**
 * Construit la règle `no-restricted-imports` pour une zone du code.
 *
 * @param {OptionalPeer[]} forbiddenPeers - PeerDependencies optionnelles interdites dans la zone.
 * @returns {import("eslint").Linter.RuleEntry} La configuration de la règle.
 */
function restrictedImports(forbiddenPeers) {
  return [
    "error",
    {
      paths: forbiddenPeers.map((peer) => ({
        name: peer.name,
        message: `${peer.name} est une peerDependency optionnelle : import autorisé uniquement dans ${zonesOf(peer).join(", ")} (sous-chemin dédié).`,
      })),
      patterns: [DEEP_IMPORT_PATTERN],
    },
  ];
}

/**
 * Configurations ESLint des frontières d'imports. Une zone autorise toutes les peerDependencies
 * qui la déclarent (une zone peut en autoriser plusieurs). Les tests, jamais publiés, peuvent
 * importer toutes les peerDependencies optionnelles (installées en devDependencies) ; les
 * imports profonds y restent interdits.
 *
 * @param {OptionalPeer[]} optionalPeers - PeerDependencies optionnelles et leurs zones autorisées.
 * @returns {Config[]} Une configuration pour le reste du code, une par zone, puis les tests.
 */
export function importBoundaryConfigs(optionalPeers) {
  const zones = [...new Set(optionalPeers.flatMap(zonesOf))];
  return [
    { files: SOURCE_FILES, rules: { "no-restricted-imports": restrictedImports(optionalPeers) } },
    ...zones.map((zone) => ({
      files: [zone],
      rules: {
        "no-restricted-imports": restrictedImports(
          optionalPeers.filter((peer) => !zonesOf(peer).includes(zone)),
        ),
      },
    })),
    ...(optionalPeers.length
      ? [{ files: TEST_FILES, rules: { "no-restricted-imports": restrictedImports([]) } }]
      : []),
  ];
}
