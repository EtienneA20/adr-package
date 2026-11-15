import type { IPermissionSubject } from "@etiennea20/adr-nest";

/** Adhérent ou bibliothécaire connecté : sujet des vérifications de droits. */
export interface IMember extends IPermissionSubject {
  readonly id: string;
}
