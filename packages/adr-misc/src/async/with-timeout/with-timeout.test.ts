import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sleep } from "../sleep";
import { TimeoutError } from "../timeout-error";
import { withTimeout } from "./with-timeout";

async function delayed<T>(value: T, ms: number): Promise<T> {
  await sleep(ms);
  return value;
}

describe("withTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renvoie la valeur si la promesse se résout à temps", async () => {
    const promise = withTimeout(delayed("Germinal", 100), 200);
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBe("Germinal");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("transmet le rejet de la promesse s'il survient à temps", async () => {
    const error = new Error("Catalogue indisponible");
    await expect(withTimeout(Promise.reject(error), 200)).rejects.toBe(error);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("rejette avec une TimeoutError au-delà du délai", async () => {
    const promise = withTimeout(delayed("Germinal", 500), 200);
    await Promise.all([
      expect(promise).rejects.toThrow(new TimeoutError("Délai d'attente de 200 ms dépassé.")),
      vi.advanceTimersByTimeAsync(200),
    ]);
  });

  it("utilise le message fourni", async () => {
    const promise = withTimeout(delayed("Germinal", 500), 200, "Le catalogue ne répond pas.");
    await Promise.all([
      expect(promise).rejects.toBeInstanceOf(TimeoutError),
      vi.advanceTimersByTimeAsync(200),
    ]);
    await expect(promise).rejects.toThrow("Le catalogue ne répond pas.");
  });

  it.each([-1, Number.NaN])("rejette la promesse pour le délai %d", async (ms) => {
    await expect(withTimeout(Promise.resolve(1), ms)).rejects.toThrow(RangeError);
  });
});
