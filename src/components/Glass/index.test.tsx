import { screen } from "@testing-library/react";
import { Badge, GlassPanel, SectionTitle, SubtleText } from "@/components/Glass";
import { renderWithProviders } from "@/test/test-utils";

describe("Glass components", () => {
  it("renders shared UI primitives", () => {
    renderWithProviders(
      <GlassPanel>
        <Badge>Active</Badge>
        <SectionTitle>Schedule</SectionTitle>
        <SubtleText>Next appointment details.</SubtleText>
      </GlassPanel>
    );

    expect(screen.getByText("Active")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Schedule" })
    ).toBeVisible();
    expect(screen.getByText("Next appointment details.")).toBeVisible();
  });
});
