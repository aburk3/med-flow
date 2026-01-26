import type { PatientRisk } from "@/types/api";
import { SubtleText, GlassPanel, SectionTitle } from "@/styles/glass";
import {
  RiskIndicator,
  RiskLabel,
  RiskSummary,
  RiskTone,
} from "@/pages/patients/patient/styles";
import { PATIENT_DETAIL_TEXT } from "@/pages/patients/patient/constants";

type PatientRiskSummaryProps = {
  label: string;
  reason: string;
  tone: PatientRisk;
};

const PatientRiskSummary = ({
  label,
  reason,
  tone,
}: PatientRiskSummaryProps) => {
  return (
    <GlassPanel>
      <SectionTitle>{PATIENT_DETAIL_TEXT.riskSectionTitle}</SectionTitle>
      <RiskSummary>
        <RiskIndicator>
          <RiskTone $tone={tone} />
          <RiskLabel>{label}</RiskLabel>
        </RiskIndicator>
        <SubtleText>{reason}</SubtleText>
      </RiskSummary>
    </GlassPanel>
  );
};

export { PatientRiskSummary };
