import { Inject, Injectable } from "@nestjs/common";

import { type ILoan, LoansRepository } from "../loans";
import { REMINDERS_OPTIONS, type RemindersOptions } from "./reminders-options";

const DAY_MS = 24 * 60 * 60 * 1000;

// #region service
@Injectable()
export class RemindersService {
  constructor(
    @Inject(REMINDERS_OPTIONS) private readonly options: RemindersOptions,
    private readonly loans: LoansRepository,
  ) {}

  // Emprunts en cours à rendre d'ici `daysBeforeDue` jours (date du jour passée en paramètre :
  // le service ne dépend pas de l'horloge).
  dueSoon(today: Date): ILoan[] {
    const from = today.toISOString().slice(0, 10);
    const to = new Date(today.getTime() + this.options.daysBeforeDue * DAY_MS)
      .toISOString()
      .slice(0, 10);
    return this.loans
      .findAll()
      .filter((loan) => loan.status === "active" && loan.dueAt >= from && loan.dueAt <= to);
  }
}
// #endregion service
