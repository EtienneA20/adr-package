import type { IPasswordRules } from "../get-password-strength";
import { getPasswordStrength } from "../get-password-strength";

/**
 * Indique si un mot de passe respecte toutes les règles de robustesse demandées.
 *
 * À utiliser pour valider un mot de passe à la création d'un compte ou lors de son
 * changement. Par défaut, suit la recommandation de la CNIL : au moins 12 caractères, une
 * majuscule, une minuscule, un chiffre et un caractère spécial. Pour afficher une jauge ou les
 * critères manquants, utiliser `getPasswordStrength`.
 *
 * @param value - Mot de passe à tester.
 * @param rules - Règles de robustesse, chacune surchargeable.
 * @returns `true` si tous les critères exigés sont respectés, `false` sinon.
 * @example
 * ```ts
 * isStrongPassword("Livre2026!Lecture"); // true
 * isStrongPassword("Livre2026!"); // false (moins de 12 caractères)
 * isStrongPassword("livre2026", { minLength: 8, requireUppercase: false, requireSpecialChar: false }); // true
 * ```
 * @since 0.2.0
 */
export function isStrongPassword(value: string, rules: IPasswordRules = {}): boolean {
  return getPasswordStrength(value, rules).missingCriteria.length === 0;
}
