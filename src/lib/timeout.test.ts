import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withTimeoutMs } from "./timeout.js";

describe("withTimeoutMs()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves with the promise's value when it settles in time", async () => {
    const result = withTimeoutMs(Promise.resolve("resolved"), 1000);

    await expect(result).resolves.toBe("resolved");
  });

  it("rejects with the original error when the promise rejects in time", async () => {
    const result = withTimeoutMs(Promise.reject(new Error()), 1000);

    await expect(result).rejects.toThrow();
  });

  it("rejects with a timeout error when the promise never settles", async () => {
    const pendingPromise = new Promise(() => {});
    const result = withTimeoutMs(pendingPromise, 1000);

    vi.advanceTimersByTime(1000);

    await expect(result).rejects.toThrow("Timed out after 1000ms");
  });

  it("rejects with a timeout error when the promise resolves too late", async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve("resolved");
      }, 2000);
    });
    const result = withTimeoutMs(promise, 1000);

    vi.advanceTimersByTime(1000);

    await expect(result).rejects.toThrow("Timed out after 1000ms");
  });

  it("clears its timer after the promise settles", async () => {
    const result = withTimeoutMs(Promise.resolve("resolved"), 1000);

    await expect(result).resolves.toBe("resolved");

    expect(vi.getTimerCount()).toBe(0);
  });
});
