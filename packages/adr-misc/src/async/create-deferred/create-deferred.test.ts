import { describe, expect, expectTypeOf, it } from "vitest";

import { createDeferred } from "./create-deferred";

describe("createDeferred", () => {
  it("résout la promesse depuis l'extérieur", async () => {
    const deferred = createDeferred<string>();
    deferred.resolve("Germinal");
    await expect(deferred.promise).resolves.toBe("Germinal");
    expectTypeOf(deferred.promise).toEqualTypeOf<Promise<string>>();
  });

  it("rejette la promesse depuis l'extérieur", async () => {
    const deferred = createDeferred<number>();
    const error = new Error("Annulé");
    deferred.reject(error);
    await expect(deferred.promise).rejects.toBe(error);
  });

  it("ignore les appels après le premier règlement", async () => {
    const deferred = createDeferred<number>();
    deferred.resolve(1);
    deferred.resolve(2);
    deferred.reject(new Error("ignoré"));
    await expect(deferred.promise).resolves.toBe(1);
  });

  it("accepte une promesse comme valeur de résolution", async () => {
    const deferred = createDeferred<number>();
    deferred.resolve(Promise.resolve(3));
    await expect(deferred.promise).resolves.toBe(3);
  });

  it("fonctionne sans destructuration des méthodes", async () => {
    const { promise, resolve } = createDeferred<boolean>();
    resolve(true);
    await expect(promise).resolves.toBe(true);
  });
});
