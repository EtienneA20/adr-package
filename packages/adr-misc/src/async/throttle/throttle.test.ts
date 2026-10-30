import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { throttle } from "./throttle";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exécute immédiatement le premier appel", () => {
    const fn = vi.fn();
    const track = throttle(fn, 1000);

    track(1);
    expect(fn).toHaveBeenCalledExactlyOnceWith(1);
  });

  it("exécute le dernier appel de la fenêtre à la fin de celle-ci", () => {
    const fn = vi.fn();
    const track = throttle(fn, 1000);

    track(1);
    track(2);
    track(3);
    expect(fn).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(1000);
    expect(fn.mock.calls).toEqual([[1], [3]]);
  });

  it("ouvre une nouvelle fenêtre après l'appel différé", () => {
    const fn = vi.fn();
    const track = throttle(fn, 1000);

    track(1);
    track(2);
    vi.advanceTimersByTime(1000); // exécute 2 et ouvre une fenêtre
    track(3);
    vi.advanceTimersByTime(999);
    expect(fn.mock.calls).toEqual([[1], [2]]);
    vi.advanceTimersByTime(1);
    expect(fn.mock.calls).toEqual([[1], [2], [3]]);
  });

  it("exécute immédiatement un appel après une fenêtre sans appel différé", () => {
    const fn = vi.fn();
    const track = throttle(fn, 1000);

    track(1);
    vi.advanceTimersByTime(1000);
    track(2);
    expect(fn.mock.calls).toEqual([[1], [2]]);
  });

  it("annule l'appel différé avec cancel()", () => {
    const fn = vi.fn();
    const track = throttle(fn, 1000);

    track(1);
    track(2);
    track.cancel();
    vi.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledOnce();

    track(3);
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it("lève une RangeError pour un délai invalide", () => {
    expect(() => throttle(vi.fn(), Number.NaN)).toThrow(RangeError);
  });
});
