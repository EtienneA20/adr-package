/**
 * Conventional Commits : type en anglais, description libre en français
 * (d'où la désactivation de `subject-case`).
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "refactor", "test", "chore", "ci", "build", "perf", "revert"],
    ],
    "subject-case": [0],
  },
};
