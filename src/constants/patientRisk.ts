import type { PatientRisk } from "@/types/api";

const RISK_LABELS: Record<PatientRisk, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

const DEFAULT_PATIENT_RISK: PatientRisk = "low";

export { DEFAULT_PATIENT_RISK, RISK_LABELS };
