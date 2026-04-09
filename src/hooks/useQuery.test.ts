import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useQuery } from "./useQuery";

describe("useQuery", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("transitions idle -> submitting -> completed", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "completed",
        thread_id: "t1",
        result: { summary: "done" },
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useQuery());
    expect(result.current.state).toBe("idle");

    act(() => {
      result.current.submit("hello", "t1");
    });
    expect(result.current.state).toBe("submitting");

    await waitFor(() => expect(result.current.state).toBe("completed"));
    expect(result.current.messages[1].summary).toBe("done");
  });
});
