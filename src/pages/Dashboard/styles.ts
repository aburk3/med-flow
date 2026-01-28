import styled from "styled-components";
import { GlassTableRow } from "@/styles/glass";
import { RISK_COLORS } from "@/constants/patientRisk";
import type { PatientRisk } from "@/types/api";

const CardRow = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const CardValue = styled.div`
  margin: 8px 0;
  font-size: 32px;
  font-weight: 600;
`;

const ClickableRow = styled(GlassTableRow)`
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const RiskCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const RiskDot = styled.span<{ $tone: PatientRisk }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $tone }) => RISK_COLORS[$tone]};
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
`;

export {
  CardRow,
  CardTitle,
  CardValue,
  ClickableRow,
  RiskCell,
  RiskDot,
};
