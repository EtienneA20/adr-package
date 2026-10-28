/**
 * Contrôles appliqués aux fichiers indexés avant chaque commit.
 * `v10_config_lookup_from_file` : chaque fichier est linté avec l'eslint.config.js le plus
 * proche (celui de son package), comme dans `pnpm lint`.
 */
export default {
  "*.{ts,tsx,js,mjs,cjs}": [
    "eslint --flag v10_config_lookup_from_file --fix --max-warnings=0 --no-warn-ignored",
    "prettier --write --ignore-unknown",
  ],
  "*.{json,md,mdx,yml,yaml,css,html}": "prettier --write --ignore-unknown",
};
