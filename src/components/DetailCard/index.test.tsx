import { screen } from "@testing-library/react";
import { DetailCard } from "@/components/DetailCard";
import { DetailBadge } from "@/components/DetailCard/type";
import { renderWithProviders } from "@/test/test-utils";

describe("DetailCard", () => {
  it("renders badge, title, and lines", () => {
    renderWithProviders(
      <DetailCard
        badge={DetailBadge.Patient}
        title="Patient Overview"
        lines={["Stage: Scheduled Surgery", "Dr. Avery Chen"]}
      />
    );

    expect(screen.getByText("Patient")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Patient Overview" })
    ).toBeVisible();
    expect(screen.getByText("Stage: Scheduled Surgery")).toBeVisible();
    expect(screen.getByText("Dr. Avery Chen")).toBeVisible();
  });
});
