import type { IPage } from "@etiennea20/adr-misc/contract";
import { PermissionsService } from "@etiennea20/adr-nest";
import {
  type IListCriteria,
  andCriteria,
  applyCriteriaInMemory,
} from "@etiennea20/adr-nest/filtering";
import { Injectable, NotFoundException } from "@nestjs/common";

import type { IMember } from "../auth";
import type { ILoan } from "./loan";
import { LoansRepository } from "./loans.repository";

@Injectable()
export class LoansService {
  constructor(
    private readonly repository: LoansRepository,
    private readonly permissions: PermissionsService,
  ) {}

  // #region scope
  findPage(member: IMember, criteria: IListCriteria): IPage<ILoan> {
    // Périmètre issu des règles : ses emprunts pour un adhérent, tous pour un bibliothécaire.
    // Avec Prisma, `toPrismaFindArgs` traduit le même arbre en `where`.
    const scoped = andCriteria(criteria, this.permissions.scope(member, "read", "loan"));
    return applyCriteriaInMemory(this.repository.findAll(), scoped);
  }
  // #endregion scope

  // #region assert-can
  cancel(member: IMember, id: string): ILoan {
    const loan = this.repository.findById(id);
    if (!loan) throw new NotFoundException(`Emprunt « ${id} » introuvable.`);
    // 403 si l'emprunt est celui d'un autre adhérent ou n'est plus en cours.
    this.permissions.assertCan(member, "cancel", "loan", loan);
    return this.repository.updateStatus(id, "cancelled") ?? loan;
  }
  // #endregion assert-can
}
