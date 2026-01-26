import { describe, expect, it } from "vitest";
import {
  formatAppointmentDate,
  sortAppointmentsByDateDesc,
} from "@/helpers/appointments";

describe("appointments helpers", () => {
  it("sorts appointments by date desc", () => {
    const input = [
      { id: "a", date: "2026-01-10T12:00:00.000Z" },
      { id: "b", date: "2026-02-01T12:00:00.000Z" },
      { id: "c", date: "2026-01-15T12:00:00.000Z" },
    ];

    const result = sortAppointmentsByDateDesc(input);

    expect(result.map((item) => item.id)).toEqual(["b", "c", "a"]);
  });

  it("formats appointment dates with year", () => {
    const formatted = formatAppointmentDate("2026-01-28T14:30:00.000Z");

    expect(formatted).toContain("2026");
  });
});
