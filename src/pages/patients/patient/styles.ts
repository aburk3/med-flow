import styled from "styled-components";
import { RISK_COLORS } from "@/constants/patientRisk";
import type { PatientRisk } from "@/types/api";

const RiskSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RiskIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const RiskTone = styled.span<{ $tone: PatientRisk }>`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${({ $tone }) => RISK_COLORS[$tone]};
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.28);
`;

const RiskLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export {
  RiskIndicator,
  RiskLabel,
  RiskSummary,
  RiskTone,
};
