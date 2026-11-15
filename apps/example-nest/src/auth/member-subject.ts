import type { SubjectResolver } from "@etiennea20/adr-nest";

import type { IMember } from "./member";

// #region subject
// Charge utile du jeton, posée dans `request.user` par l'authentification (Passport, JWT…).
interface ITokenPayload {
  readonly sub: string;
  readonly roles?: readonly string[];
}

// Point d'extension : traduit l'utilisateur authentifié en sujet des permissions.
export const memberSubject: SubjectResolver = (context) => {
  const user = context.switchToHttp().getRequest<{ user?: ITokenPayload }>().user;
  if (!user) return null; // requête anonyme : 401 sur les routes protégées
  const member: IMember = { id: user.sub, roles: user.roles ?? [] };
  return member;
};
// #endregion subject
