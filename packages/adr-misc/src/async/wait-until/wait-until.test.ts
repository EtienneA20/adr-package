import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TimeoutError } from "../timeout-error";
import { waitUntil } from "./wait-until";

describe("waitUntil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("se résout immédiatement si la condition est déjà vraie", async () => {
    const predicate = vi.fn(() => true);
    await expect(waitUntil(predicate)).resolves.toBeUndefined();
    expect(predicate).toHaveBeenCalledOnce();
  });

  it("vérifie la condition à intervalle régulier jusqu'à ce qu'elle soit vraie", async () => {
    let checks = 0;
    const predicate = vi.fn(() => {
      checks += 1;
      return checks >= 3;
    });
    const promise = waitUntil(predicate, { intervalMs: 100 });

    await vi.advanceTimersByTimeAsync(199);
    expect(predicate).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBeUndefined();
    expect(predicate).toHaveBeenCalledTimes(3);
  });

  it("accepte une condition asynchrone", async () => {
    let done = false;
    const promise = waitUntil(() => Promise.resolve(done), { intervalMs: 50 });

    await vi.advanceTimersByTimeAsync(100);
    done = true;
    await vi.advanceTimersByTimeAsync(50);
    await expect(promise).resolves.toBeUndefined();
  });

  it("rejette avec une TimeoutError à l'expiration du délai", async () => {
    const predicate = vi.fn(() => false);
    const promise = waitUntil(predicate, { timeoutMs: 100, intervalMs: 50 });
    await Promise.all([
      expect(promise).rejects.toThrow(
        new TimeoutError("La condition n'a pas été remplie en 100 ms."),
      ),

      vi.advanceTimersByTimeAsync(100),
    ]);
    expect(predicate).toHaveBeenCalledTimes(3);
  });

  it("utilise le message fourni", async () => {
    const promise = waitUntil(() => false, { timeoutMs: 0, message: "Import non terminé." });
    await expect(promise).rejects.toThrow(new TimeoutError("Import non terminé."));
  });

  it("transmet l'erreur levée par la condition", async () => {
    const error = new Error("Serveur indisponible");
    await expect(
      waitUntil(() => {
        throw error;
      }),
    ).rejects.toBe(error);
  });

  it.each([{ timeoutMs: -1 }, { intervalMs: Number.NaN }])(
    "rejette des options invalides (%j)",
    async (options) => {
      await expect(waitUntil(() => true, options)).rejects.toThrow(RangeError);
    },
  );
});
