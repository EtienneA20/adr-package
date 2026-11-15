import { Injectable } from "@nestjs/common";

import { type ILoan, LOANS } from "./loan";

/** Dépôt en mémoire des emprunts (voir `BooksRepository`). */
@Injectable()
export class LoansRepository {
  private readonly loans: ILoan[] = LOANS.map((loan) => ({ ...loan }));

  findAll(): ILoan[] {
    return this.loans.map((loan) => ({ ...loan }));
  }

  findById(id: string): ILoan | undefined {
    const loan = this.loans.find((candidate) => candidate.id === id);
    return loan && { ...loan };
  }

  updateStatus(id: string, status: ILoan["status"]): ILoan | undefined {
    const loan = this.loans.find((candidate) => candidate.id === id);
    if (!loan) return undefined;
    loan.status = status;
    return { ...loan };
  }
}
