import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("n'exécute que le dernier appel d'une rafale, après le délai", () => {
    const fn = vi.fn();
    const search = debounce(fn, 300);

    search("ger");
    vi.advanceTimersByTime(200);
    search("germ");
    vi.advanceTimersByTime(200);
    search("germinal");
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledExactlyOnceWith("germinal");
  });

  it("exécute à nouveau après une période d'inactivité", () => {
    const fn = vi.fn();
    const search = debounce(fn, 100);

    search("a");
    vi.advanceTimersByTime(100);
    search("b");
    vi.advanceTimersByTime(100);
    expect(fn.mock.calls).toEqual([["a"], ["b"]]);
  });

  it("annule l'appel en attente avec cancel()", () => {
    const fn = vi.fn();
    const search = debounce(fn, 100);

    search("a");
    search.cancel();
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
    expect(() => {
      search.cancel();
    }).not.toThrow();
  });

  it("exécute immédiatement l'appel en attente avec flush()", () => {
    const fn = vi.fn();
    const save = debounce(fn, 500);

    save("Brouillon", 2);
    save.flush();
    expect(fn).toHaveBeenCalledExactlyOnceWith("Brouillon", 2);

    vi.advanceTimersByTime(500);
    save.flush();
    expect(fn).toHaveBeenCalledOnce();
  });

  it("lève une RangeError pour un délai invalide", () => {
    expect(() => debounce(vi.fn(), -1)).toThrow(RangeError);
  });
});
