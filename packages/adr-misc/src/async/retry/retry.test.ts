import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { retry } from "./retry";

function failingTimes(count: number, value = "ok"): (attempt: number) => Promise<string> {
  return vi.fn((attempt: number) =>
    attempt <= count ? Promise.reject(new Error(`Échec ${attempt}`)) : Promise.resolve(value),
  );
}

describe("retry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renvoie la valeur dès la première tentative réussie", async () => {
    const fn = failingTimes(0);
    await expect(retry(fn)).resolves.toBe("ok");
    expect(fn).toHaveBeenCalledExactlyOnceWith(1);
  });

  it("relance après un échec avec un délai exponentiel", async () => {
    const fn = failingTimes(2);
    const onRetry = vi.fn();
    const promise = retry(fn, { delayMs: 100, factor: 3, onRetry });

    await vi.advanceTimersByTimeAsync(100);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(299);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBe("ok");

    expect(onRetry).toHaveBeenNthCalledWith(1, new Error("Échec 1"), 1, 100);
    expect(onRetry).toHaveBeenNthCalledWith(2, new Error("Échec 2"), 2, 300);
  });

  it("plafonne le délai à maxDelayMs", async () => {
    const onRetry = vi.fn();
    const promise = retry(failingTimes(3), {
      attempts: 4,
      delayMs: 100,
      maxDelayMs: 150,
      onRetry,
    });

    await vi.advanceTimersByTimeAsync(400);
    await expect(promise).resolves.toBe("ok");
    expect(onRetry.mock.calls.map(([, , delay]) => delay as number)).toEqual([100, 150, 150]);
  });

  it("relève la dernière erreur quand toutes les tentatives échouent", async () => {
    const fn = failingTimes(10);
    const promise = retry(fn, { attempts: 3, delayMs: 10 });
    await Promise.all([
      expect(promise).rejects.toThrow("Échec 3"),

      vi.advanceTimersByTimeAsync(100),
    ]);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("ne relance pas quand shouldRetry renvoie false", async () => {
    const fn = failingTimes(10);
    const shouldRetry = vi.fn(() => false);

    await expect(retry(fn, { shouldRetry })).rejects.toThrow("Échec 1");
    expect(fn).toHaveBeenCalledOnce();
    expect(shouldRetry).toHaveBeenCalledExactlyOnceWith(new Error("Échec 1"), 1);
  });

  it("accepte une seule tentative", async () => {
    await expect(retry(failingTimes(1), { attempts: 1 })).rejects.toThrow("Échec 1");
  });

  it.each([
    [{ attempts: 0 }, "attempts doit être un entier supérieur ou égal à 1 (reçu : 0)."],
    [{ attempts: 1.5 }, "attempts doit être un entier supérieur ou égal à 1 (reçu : 1.5)."],
    [{ factor: 0.5 }, "factor doit être un nombre fini supérieur ou égal à 1 (reçu : 0.5)."],
    [
      { factor: Number.POSITIVE_INFINITY },
      "factor doit être un nombre fini supérieur ou égal à 1 (reçu : Infinity).",
    ],
    [{ delayMs: -1 }, "delayMs doit être un nombre fini positif ou nul (reçu : -1)."],
    [{ maxDelayMs: -1 }, "maxDelayMs doit être un nombre fini positif ou nul (reçu : -1)."],
  ])("rejette des options invalides (%j)", async (options, message) => {
    const fn = failingTimes(0);
    await expect(retry(fn, options)).rejects.toThrow(new RangeError(message));
    expect(fn).not.toHaveBeenCalled();
  });
});
