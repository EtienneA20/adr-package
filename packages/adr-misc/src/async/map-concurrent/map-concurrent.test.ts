import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sleep } from "../sleep";
import { mapConcurrent } from "./map-concurrent";

describe("mapConcurrent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renvoie les résultats dans l'ordre des éléments", async () => {
    const promise = mapConcurrent(
      [300, 100, 200],
      async (ms, index) => {
        await sleep(ms);
        return `${index}:${ms}`;
      },
      2,
    );

    await vi.advanceTimersByTimeAsync(400);
    await expect(promise).resolves.toEqual(["0:300", "1:100", "2:200"]);
  });

  it("ne dépasse jamais la limite de concurrence", async () => {
    let running = 0;
    let maxRunning = 0;
    const promise = mapConcurrent(
      [1, 2, 3, 4, 5, 6, 7],
      async (value) => {
        running += 1;
        maxRunning = Math.max(maxRunning, running);
        await sleep(100);
        running -= 1;
        return value * 2;
      },
      3,
    );

    await vi.advanceTimersByTimeAsync(300);
    await expect(promise).resolves.toEqual([2, 4, 6, 8, 10, 12, 14]);
    expect(maxRunning).toBe(3);
  });

  it("accepte un mapper synchrone et une limite supérieure au nombre d'éléments", async () => {
    await expect(mapConcurrent(["a", "b"], (value) => value.toUpperCase(), 10)).resolves.toEqual([
      "A",
      "B",
    ]);
  });

  it("renvoie un tableau vide pour une liste vide", async () => {
    const mapper = vi.fn();
    await expect(mapConcurrent([], mapper, 2)).resolves.toEqual([]);
    expect(mapper).not.toHaveBeenCalled();
  });

  it("rejette à la première erreur sans lancer de nouvel appel", async () => {
    const mapper = vi.fn(async (value: number) => {
      await sleep(10);
      if (value === 2) {
        throw new Error(`Échec ${value}`);
      }
      return value;
    });
    const promise = mapConcurrent([1, 2, 3, 4, 5], mapper, 2);
    await Promise.all([
      expect(promise).rejects.toThrow("Échec 2"),

      vi.advanceTimersByTimeAsync(100),
    ]);
    expect(mapper.mock.calls.map(([value]) => value)).toEqual([1, 2, 3]);
  });

  it.each([0, -1, 1.5, Number.NaN])("rejette une concurrence invalide (%d)", async (value) => {
    await expect(mapConcurrent([1], (item) => item, value)).rejects.toThrow(RangeError);
  });
});
