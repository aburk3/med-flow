import { GlassCard, SubtleText } from "@/styles/glass";
import { CardRow, CardTitle, CardValue } from "@/pages/Dashboard/styles";
import { DASHBOARD_TEXT } from "@/pages/Dashboard/constants";

type DashboardCardsProps = {
  appointmentsTotal: number;
  patientsCount: number;
};

const DashboardCards = ({
  appointmentsTotal,
  patientsCount,
}: DashboardCardsProps) => {
  return (
    <CardRow>
      <GlassCard>
        <CardTitle>{DASHBOARD_TEXT.patientsCardTitle}</CardTitle>
        <CardValue>{patientsCount}</CardValue>
        <SubtleText>{DASHBOARD_TEXT.patientsCardSubtitle}</SubtleText>
      </GlassCard>
      <GlassCard>
        <CardTitle>{DASHBOARD_TEXT.appointmentsCardTitle}</CardTitle>
        <CardValue>{appointmentsTotal}</CardValue>
        <SubtleText>{DASHBOARD_TEXT.appointmentsCardSubtitle}</SubtleText>
      </GlassCard>
    </CardRow>
  );
};

export { DashboardCards };
