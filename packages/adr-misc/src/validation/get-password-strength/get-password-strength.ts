/**
 * Critères de robustesse d'un mot de passe, renvoyés par {@link getPasswordStrength} quand ils
 * ne sont pas respectés.
 *
 * @example
 * ```ts
 * const strength = getPasswordStrength("bibliotheque");
 * strength.missingCriteria.includes(EPasswordCriterion.DIGIT); // true
 * ```
 * @since 0.2.0
 */
export const EPasswordCriterion = {
  /** Longueur minimale atteinte. */
  MIN_LENGTH: "minLength",
  /** Au moins une lettre majuscule. */
  UPPERCASE: "uppercase",
  /** Au moins une lettre minuscule. */
  LOWERCASE: "lowercase",
  /** Au moins un chiffre. */
  DIGIT: "digit",
  /** Au moins un caractère spécial (ni lettre ni chiffre, espace compris). */
  SPECIAL_CHAR: "specialChar",
} as const;

/** Valeur possible de `EPasswordCriterion`. */
export type EPasswordCriterion = (typeof EPasswordCriterion)[keyof typeof EPasswordCriterion];

/**
 * Règles de robustesse d'un mot de passe, utilisées par {@link getPasswordStrength} et
 * `isStrongPassword`. Les valeurs par défaut suivent la recommandation de la CNIL (12
 * caractères mêlant majuscules, minuscules, chiffres et caractères spéciaux).
 *
 * @example
 * ```ts
 * const rules: IPasswordRules = { minLength: 8, requireSpecialChar: false };
 * ```
 * @since 0.2.0
 */
export interface IPasswordRules {
  /**
   * Nombre minimal de caractères (points de code Unicode).
   *
   * @defaultValue 12
   */
  minLength?: number;
  /**
   * Exiger au moins une lettre majuscule (accentuées comprises).
   *
   * @defaultValue true
   */
  requireUppercase?: boolean;
  /**
   * Exiger au moins une lettre minuscule (accentuées comprises).
   *
   * @defaultValue true
   */
  requireLowercase?: boolean;
  /**
   * Exiger au moins un chiffre.
   *
   * @defaultValue true
   */
  requireDigit?: boolean;
  /**
   * Exiger au moins un caractère spécial (ni lettre ni chiffre).
   *
   * @defaultValue true
   */
  requireSpecialChar?: boolean;
}

/**
 * Résultat de {@link getPasswordStrength}.
 *
 * @example
 * ```ts
 * const strength: IPasswordStrength = { score: 3, missingCriteria: ["specialChar"] };
 * ```
 * @since 0.2.0
 */
export interface IPasswordStrength {
  /** Score de 0 (très faible) à 4 (fort) : part des critères exigés qui sont respectés. */
  score: 0 | 1 | 2 | 3 | 4;
  /** Critères exigés non respectés, dans l'ordre de `EPasswordCriterion`. */
  missingCriteria: EPasswordCriterion[];
}

const DEFAULT_MIN_LENGTH = 12;
/** Score maximal quand la longueur minimale n'est pas atteinte. */
const SHORT_PASSWORD_MAX_SCORE = 2;

/**
 * Liste, pour chaque critère, s'il est exigé et s'il est respecté.
 *
 * @param value - Mot de passe évalué.
 * @param rules - Règles fournies par l'appelant.
 * @returns Les critères avec leur exigence et leur résultat.
 */
function evaluateCriteria(
  value: string,
  rules: IPasswordRules,
): { criterion: EPasswordCriterion; required: boolean; met: boolean }[] {
  return [
    {
      criterion: EPasswordCriterion.MIN_LENGTH,
      required: true,
      met: Array.from(value).length >= (rules.minLength ?? DEFAULT_MIN_LENGTH),
    },
    {
      criterion: EPasswordCriterion.UPPERCASE,
      required: rules.requireUppercase ?? true,
      met: /\p{Lu}/u.test(value),
    },
    {
      criterion: EPasswordCriterion.LOWERCASE,
      required: rules.requireLowercase ?? true,
      met: /\p{Ll}/u.test(value),
    },
    {
      criterion: EPasswordCriterion.DIGIT,
      required: rules.requireDigit ?? true,
      met: /\d/.test(value),
    },
    {
      criterion: EPasswordCriterion.SPECIAL_CHAR,
      required: rules.requireSpecialChar ?? true,
      met: /[^\p{L}\p{N}]/u.test(value),
    },
  ];
}

/**
 * Évalue la robustesse d'un mot de passe : score de 0 à 4 et critères manquants.
 *
 * À utiliser pour afficher une jauge et des conseils pendant la saisie d'un mot de passe ;
 * pour une simple validation, préférer `isStrongPassword`. Le score est la part des critères
 * exigés qui sont respectés, ramenée à 0–4 (arrondie à l'inférieur) ; il est plafonné à 2 tant
 * que la longueur minimale n'est pas atteinte et vaut 0 pour une chaîne vide.
 *
 * @param value - Mot de passe à évaluer.
 * @param rules - Règles de robustesse (par défaut : 12 caractères, majuscule, minuscule,
 * chiffre et caractère spécial).
 * @returns Le score et la liste des critères exigés non respectés.
 * @example
 * ```ts
 * getPasswordStrength("Livre2026!Lecture"); // { score: 4, missingCriteria: [] }
 * getPasswordStrength("livre"); // { score: 0, missingCriteria: ["minLength", "uppercase", "digit", "specialChar"] }
 * ```
 * @since 0.2.0
 */
export function getPasswordStrength(value: string, rules: IPasswordRules = {}): IPasswordStrength {
  const criteria = evaluateCriteria(value, rules).filter((item) => item.required);
  const missingCriteria = criteria.filter((item) => !item.met).map((item) => item.criterion);
  if (value === "") {
    return { score: 0, missingCriteria };
  }
  const metCount = criteria.length - missingCriteria.length;
  let score = Math.floor((4 * metCount) / criteria.length);
  if (missingCriteria.includes(EPasswordCriterion.MIN_LENGTH)) {
    score = Math.min(score, SHORT_PASSWORD_MAX_SCORE);
  }
  return { score: score as IPasswordStrength["score"], missingCriteria };
}
