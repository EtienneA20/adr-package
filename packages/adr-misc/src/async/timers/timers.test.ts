import { afterEach, describe, expect, it, vi } from "vitest";

import { getTimers } from "./timers";

describe("getTimers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("utilise les minuteries simulées installées après l'import", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    getTimers().setTimeout(callback, 100);

    vi.advanceTimersByTime(99);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledOnce();
  });

  it("annule une minuterie planifiée", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const timers = getTimers();
    const handle = timers.setTimeout(callback, 100);

    timers.clearTimeout(handle);
    vi.advanceTimersByTime(100);
    expect(callback).not.toHaveBeenCalled();
  });
});
