import type { PatientRisk } from "@/types/api";

const RISK_LABELS: Record<PatientRisk, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

const DEFAULT_PATIENT_RISK: PatientRisk = "low";

const RISK_COLORS: Record<PatientRisk, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

export { DEFAULT_PATIENT_RISK, RISK_COLORS, RISK_LABELS };
