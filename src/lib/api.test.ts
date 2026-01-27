import { afterEach, describe, expect, it, vi } from "vitest";
import type { DashboardPayload } from "@/types/api";
import { fetchDashboard, fetchPatients } from "@/lib/api";

const createFetchResponse = <T,>(payload: T, ok = true) => ({
  ok,
  status: ok ? 200 : 500,
  json: () => Promise.resolve(payload),
});

describe("api helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it("builds dashboard query parameters", async () => {
    const payload: DashboardPayload = {
      physician: null,
      patients: [],
      appointments: [],
      noShowCountsByPatient: {},
      appointmentsTotal: 0,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createFetchResponse(payload));
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const fromDate = new Date("2026-01-28T00:00:00.000Z");
    await fetchDashboard({ fromDate });

    const query = new URLSearchParams({
      from: fromDate.toISOString(),
    }).toString();

    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:4000/api/dashboard?${query}`,
      { cache: "no-store" }
    );
  });

  it("throws when response is not ok", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createFetchResponse({}, false));
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    await expect(fetchPatients()).rejects.toThrow("Request failed: 500");
  });
});
