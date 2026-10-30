import { describe, expect, it, vi } from "vitest";

import { createUuid } from "./create-uuid";

const UUID_V4 = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/;

describe("createUuid", () => {
  it("génère un UUID v4 avec l'API crypto de l'environnement", () => {
    expect(createUuid()).toMatch(UUID_V4);
  });

  it("génère des valeurs différentes à chaque appel", () => {
    expect(createUuid()).not.toBe(createUuid());
  });

  it("utilise crypto.randomUUID quand il existe", () => {
    const randomUUID = vi.fn(() => "3b241101-e2bb-4255-8caf-4136c566a962");
    vi.stubGlobal("crypto", { randomUUID });
    expect(createUuid()).toBe("3b241101-e2bb-4255-8caf-4136c566a962");
    expect(randomUUID).toHaveBeenCalledOnce();
  });

  it("se rabat sur crypto.getRandomValues et applique version et variante", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (array: Uint8Array) => array.fill(0xff),
    });
    expect(createUuid()).toBe("ffffffff-ffff-4fff-bfff-ffffffffffff");
  });

  it("produit un UUID v4 valide avec des octets nuls", () => {
    vi.stubGlobal("crypto", { getRandomValues: (array: Uint8Array) => array });
    expect(createUuid()).toBe("00000000-0000-4000-8000-000000000000");
  });

  it("lève une erreur si l'API crypto est absente", () => {
    vi.stubGlobal("crypto", undefined);
    expect(() => createUuid()).toThrow(
      new Error(
        "API Web Crypto indisponible : impossible de générer un UUID de façon sûre dans cet environnement.",
      ),
    );
  });

  it("lève une erreur si l'API crypto n'expose aucune méthode utile", () => {
    vi.stubGlobal("crypto", {});
    expect(() => createUuid()).toThrow(Error);
  });
});
