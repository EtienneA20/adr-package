import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sleep } from "./sleep";

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("se résout après le délai indiqué", async () => {
    const done = vi.fn();
    const promise = sleep(1000).then(done);

    await vi.advanceTimersByTimeAsync(999);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await promise;
    expect(done).toHaveBeenCalledOnce();
  });

  it("accepte un délai nul", async () => {
    const promise = sleep(0);
    await vi.advanceTimersByTimeAsync(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejette la promesse pour le délai %d",
    async (ms) => {
      await expect(sleep(ms)).rejects.toThrow(RangeError);
    },
  );
});
