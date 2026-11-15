import type { IPage } from "@etiennea20/adr-misc/contract";
import { Can, CurrentSubject } from "@etiennea20/adr-nest";
import { type IListCriteria, ListQuery } from "@etiennea20/adr-nest/filtering";
import { Controller, Get, Param, Post } from "@nestjs/common";

import type { IMember } from "../auth";
import type { ILoan } from "./loan";
import { loanListQuery } from "./loan-list-query";
import { LoansService } from "./loans.service";

// #region loan-routes
@Controller("emprunts")
export class LoansController {
  constructor(private readonly loans: LoansService) {}

  @Can("read", "loan") // le guard vérifie le type de ressource, le service restreint la liste
  @Get()
  list(
    @CurrentSubject() member: IMember,
    @ListQuery(loanListQuery) criteria: IListCriteria,
  ): IPage<ILoan> {
    return this.loans.findPage(member, criteria);
  }

  @Can("cancel", "loan") // le service vérifie ensuite l'emprunt précis
  @Post(":id/annulation")
  cancel(@CurrentSubject() member: IMember, @Param("id") id: string): ILoan {
    return this.loans.cancel(member, id);
  }
}
// #endregion loan-routes
