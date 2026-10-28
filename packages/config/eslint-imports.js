// @ts-check

/**
 * Frontières d'imports des sources (`src/**`) : imports profonds interdits, et peerDependencies
 * optionnelles cantonnées à la catégorie exposée par leur sous-chemin `exports`.
 */

/** @typedef {import("eslint").Linter.Config} Config */
/**
 * @typedef {object} OptionalPeer
 * @property {string} name - Nom du module (`axios`).
 * @property {string} allowedIn - Glob des fichiers autorisés à l'importer (`src/fetch/**`).
 */

const SOURCE_FILES = ["src/**/*.{ts,tsx}"];

/**
 * Un import relatif qui descend de plus d'un niveau dans un dossier (`./a/b`, `../../a/b`)
 * contourne l'`index.ts` d'un élément ou d'une catégorie : c'est un import profond.
 */
const DEEP_IMPORT_PATTERN = {
  regex: String.raw`^\.{1,2}/(?:\.\./)*[^./][^/]*/.+`,
  message: "Import profond interdit : importer via l'index.ts de l'élément ou de la catégorie.",
};

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
        message: `${peer.name} est une peerDependency optionnelle : import autorisé uniquement dans ${peer.allowedIn} (sous-chemin dédié).`,
      })),
      patterns: [DEEP_IMPORT_PATTERN],
    },
  ];
}

/**
 * Configurations ESLint des frontières d'imports.
 *
 * @param {OptionalPeer[]} optionalPeers - PeerDependencies optionnelles et leur zone autorisée.
 * @returns {Config[]} Une configuration pour le reste du code, puis une par zone autorisée.
 */
export function importBoundaryConfigs(optionalPeers) {
  const zones = [...new Set(optionalPeers.map((peer) => peer.allowedIn))];
  return [
    { files: SOURCE_FILES, rules: { "no-restricted-imports": restrictedImports(optionalPeers) } },
    ...zones.map((zone) => ({
      files: [zone],
      rules: {
        "no-restricted-imports": restrictedImports(
          optionalPeers.filter((peer) => peer.allowedIn !== zone),
        ),
      },
    })),
  ];
}
