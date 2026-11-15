import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "./app.module";
import { BOOKS } from "./books";

// Tests de bout en bout : l'application complète (guard, pipes, filtre, intercepteur) sur
// Express, appelée avec le `fetch` de Node sur 127.0.0.1 et un port choisi par le système.
// Aucune sortie réseau.

interface ITestRequest {
  headers: Record<string, string | string[] | undefined>;
  user?: unknown;
}

const LIBRARIAN = { sub: "bibliothecaire-1", roles: ["librarian"] };
const MEMBER = { sub: "adherent-1", roles: ["member"] };
const BOOK_ID = BOOKS[0]?.id ?? "";

let app: INestApplication;
let baseUrl: string;

// Authentification simulée : en production, Passport (ou un équivalent) pose `request.user`.
function fakeAuthentication(request: ITestRequest, _response: unknown, next: () => void): void {
  const header = request.headers["x-test-user"];
  if (typeof header === "string") request.user = JSON.parse(header) as unknown;
  next();
}

function call(
  path: string,
  options: {
    method?: string;
    user?: object;
    body?: unknown;
    headers?: Record<string, string>;
  } = {},
): Promise<Response> {
  const headers: Record<string, string> = { ...options.headers };
  if (options.user) headers["x-test-user"] = JSON.stringify(options.user);
  if (options.body !== undefined) headers["content-type"] = "application/json";
  return fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
}

function query(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, typeof value === "string" ? value : JSON.stringify(value));
  }
  return `?${search.toString()}`;
}

describe("application Bibliothèque sur HTTP", () => {
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication({ logger: false });
    app.use(fakeAuthentication);
    await app.listen(0, "127.0.0.1");
    baseUrl = await app.getUrl();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("routes publiques", () => {
    it("répond sur /health avec un identifiant de corrélation généré", async () => {
      const response = await call("/health");

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ status: "ok" });
      expect(response.headers.get("x-request-id")).toMatch(/^[0-9a-f-]{36}$/);
    });

    it("filtre, trie et pagine le catalogue, en reprenant le x-request-id reçu", async () => {
      const response = await call(
        `/livres${query({ filter: { field: "status", op: "eq", value: "available" }, pageSize: "1" })}`,
        { headers: { "x-request-id": "e2e-catalogue" } },
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-request-id")).toBe("e2e-catalogue");
      const page = (await response.json()) as { items: { title: string }[]; total: number };
      expect(page.items.map((book) => book.title)).toEqual(["Germinal"]);
      expect(page.total).toBe(2);
    });

    it("refuse une requête de liste invalide (400 INVALID_QUERY)", async () => {
      const response = await call(
        `/livres${query({ filter: { field: "secret", op: "eq", value: 1 } })}`,
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({ code: "INVALID_QUERY" });
    });
  });

  describe("format d'erreur d'API", () => {
    it("répond 401 en application/problem+json, avec instance et requestId", async () => {
      const response = await call(`/livres/${BOOK_ID}?champ=secret`, {
        headers: { "x-request-id": "e2e-401" },
      });

      expect(response.status).toBe(401);
      expect(response.headers.get("content-type")).toContain("application/problem+json");
      await expect(response.json()).resolves.toEqual({
        type: "about:blank",
        title: "Authentification requise",
        status: 401,
        code: "UNAUTHENTICATED",
        detail: "Connectez-vous pour accéder à cette ressource.",
        instance: `/livres/${BOOK_ID}`,
        requestId: "e2e-401",
      });
    });

    it("traduit une NotFoundException du service (404 NOT_FOUND)", async () => {
      const response = await call("/livres/inconnu", { user: MEMBER });

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toMatchObject({
        code: "NOT_FOUND",
        title: "Ressource introuvable",
        detail: "Livre « inconnu » introuvable.",
      });
    });

    it("détaille les erreurs de validation du pipe d'adr-nest (POST)", async () => {
      const response = await call("/livres", {
        method: "POST",
        user: LIBRARIAN,
        body: { title: "", authorName: "Zola", publishedAt: "1880" },
      });

      expect(response.status).toBe(400);
      const body = (await response.json()) as { code: string; errors: { path: string }[] };
      expect(body.code).toBe("VALIDATION_FAILED");
      expect(body.errors.map((issue) => issue.path)).toEqual(["title", "publishedAt"]);
    });

    it("détaille aussi les erreurs du pipe natif de NestJS 12 (PATCH)", async () => {
      const response = await call(`/livres/${BOOK_ID}`, {
        method: "PATCH",
        user: LIBRARIAN,
        body: { status: "perdu" },
      });

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        code: "VALIDATION_FAILED",
        errors: [expect.objectContaining({ path: "status" })],
      });
    });
  });

  describe("permissions", () => {
    it("réserve la création de livres aux bibliothécaires", async () => {
      const book = { title: "Nana", authorName: "Émile Zola", publishedAt: "1880-03-01" };

      const forbidden = await call("/livres", { method: "POST", user: MEMBER, body: book });
      expect(forbidden.status).toBe(403);
      await expect(forbidden.json()).resolves.toMatchObject({ code: "FORBIDDEN" });

      const created = await call("/livres", { method: "POST", user: LIBRARIAN, body: book });
      expect(created.status).toBe(201);
      await expect(created.json()).resolves.toMatchObject({ title: "Nana", status: "available" });
    });

    it("ne montre à un adhérent que ses emprunts", async () => {
      const response = await call("/emprunts", { user: MEMBER });

      const page = (await response.json()) as { items: { memberId: string }[] };
      expect(response.status).toBe(200);
      expect(page.items.map((loan) => loan.memberId)).toEqual(["adherent-1", "adherent-1"]);
    });

    it("refuse l'annulation de l'emprunt d'un autre adhérent, accepte la sienne", async () => {
      const other = await call("/emprunts/emprunt-2/annulation", { method: "POST", user: MEMBER });
      expect(other.status).toBe(403);

      const own = await call("/emprunts/emprunt-1/annulation", { method: "POST", user: MEMBER });
      expect(own.status).toBe(201);
      await expect(own.json()).resolves.toMatchObject({ id: "emprunt-1", status: "cancelled" });
    });
  });

  describe("export", () => {
    it("télécharge le catalogue en CSV, avec un nom de fichier assaini", async () => {
      const response = await call(`/livres/export${query({ format: "csv" })}`, { user: LIBRARIAN });

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("text/csv; charset=utf-8");
      expect(response.headers.get("content-disposition")).toBe(
        "attachment; filename=\"Catalogue de la bibliotheque.csv\"; filename*=UTF-8''Catalogue%20de%20la%20biblioth%C3%A8que.csv",
      );
      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
      const bytes = new Uint8Array(await response.arrayBuffer());
      const text = new TextDecoder("utf-8", { ignoreBOM: true }).decode(bytes);
      expect(text.startsWith("﻿Titre;Auteur;Statut;Publication;Identifiant")).toBe(true);
      expect(text).toContain("Les Misérables;Victor Hugo;Disponible;03/04/1862;");
    });

    it("réserve l'export aux bibliothécaires", async () => {
      const response = await call(`/livres/export${query({ format: "csv" })}`, { user: MEMBER });

      expect(response.status).toBe(403);
    });
  });
});
