import styled from "styled-components";
import { RISK_COLORS } from "@/constants/patientRisk";
import type { PatientRisk } from "@/types/api";

const RiskSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) => theme.media.phone} {
    gap: 6px;
  }
`;

const RiskIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  ${({ theme }) => theme.media.phone} {
    gap: 8px;
  }
`;

const RiskTone = styled.span<{ $tone: PatientRisk }>`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${({ $tone }) => RISK_COLORS[$tone]};
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.28);

  ${({ theme }) => theme.media.phone} {
    width: 10px;
    height: 10px;
  }
`;

const RiskLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};

  ${({ theme }) => theme.media.phone} {
    font-size: 14px;
  }
`;

const IntakeStatusRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IntakeStatusLabel = styled.label`
  font-size: 12px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const IntakeStatusSelect = styled.select`
  appearance: none;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  padding: 10px 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export {
  IntakeStatusLabel,
  IntakeStatusRow,
  IntakeStatusSelect,
  RiskIndicator,
  RiskLabel,
  RiskSummary,
  RiskTone,
};
