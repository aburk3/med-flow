import { DetailBadge } from "@/components/DetailCard/type";

const PATIENTS_TEXT = {
  detailBadge: DetailBadge.Patients,
  detailTitle: "Patient Stage",
  detailLine: "Review status across the care journey.",
  title: "Patients",
  subtitle: "Each patient is mapped to a stage in the flow.",
  error: "Unable to load patients.",
  activeBadgeSuffix: "Active",
  tableHeaders: {
    patient: "Patient",
    stage: "Stage",
    primaryPhysician: "Primary Physician",
  },
  assignedPhysicianFallback: "Assigned Physician",
} as const;

export { PATIENTS_TEXT };
