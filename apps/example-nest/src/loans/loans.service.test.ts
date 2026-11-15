import { PermissionDeniedException, PermissionsModule } from "@etiennea20/adr-nest";
import { parseListQuery } from "@etiennea20/adr-nest/filtering";
import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { type IMember, permissions } from "../auth";
import { loanListQuery } from "./loan-list-query";
import { LoansModule } from "./loans.module";
import { LoansService } from "./loans.service";

const member: IMember = { id: "adherent-1", roles: ["member"] };
const librarian: IMember = { id: "bibliothecaire-1", roles: ["librarian"] };

async function createService(): Promise<LoansService> {
  const moduleRef = await Test.createTestingModule({
    imports: [PermissionsModule.forRoot({ permissions }), LoansModule],
  }).compile();
  return moduleRef.get(LoansService);
}

describe("LoansService.findPage", () => {
  it("ne montre à un adhérent que ses emprunts", async () => {
    const page = (await createService()).findPage(member, parseListQuery(loanListQuery, {}));

    expect(page.items.map((loan) => loan.id)).toEqual(["emprunt-3", "emprunt-1"]);
  });

  it("combine le filtre du client avec le périmètre des permissions", async () => {
    const criteria = parseListQuery(loanListQuery, {
      filter: JSON.stringify({ field: "status", op: "eq", value: "active" }),
    });

    expect((await createService()).findPage(member, criteria).items).toHaveLength(1);
  });

  it("montre tous les emprunts à un bibliothécaire", async () => {
    const page = (await createService()).findPage(librarian, parseListQuery(loanListQuery, {}));

    expect(page.total).toBe(3);
  });
});

describe("LoansService.cancel", () => {
  it("annule un emprunt en cours de l'adhérent", async () => {
    expect((await createService()).cancel(member, "emprunt-1").status).toBe("cancelled");
  });

  it("refuse l'emprunt d'un autre adhérent ou un emprunt rendu (403)", async () => {
    const service = await createService();

    expect(() => service.cancel(member, "emprunt-2")).toThrow(PermissionDeniedException);
    expect(() => service.cancel(member, "emprunt-3")).toThrow(PermissionDeniedException);
  });

  it("laisse un bibliothécaire annuler n'importe quel emprunt", async () => {
    expect((await createService()).cancel(librarian, "emprunt-2").status).toBe("cancelled");
  });

  it("répond 404 pour un emprunt inconnu", async () => {
    const service = await createService();

    expect(() => service.cancel(member, "inconnu")).toThrow(NotFoundException);
  });
});
