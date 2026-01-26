import type { Patient } from "../../types.js";
import { applyRiskToPatients, buildNoShowCounts } from "../patientRisk.js";
import { appointments } from "./appointments.js";
import { physician } from "./physician.js";

const basePatients: Omit<Patient, "risk" | "riskReason">[] = [
  {
    id: "patient-001",
    name: "Sophia Ramirez",
    stage: "Initial Contact",
    primaryPhysicianId: physician.id,
  },
  {
    id: "patient-002",
    name: "Liam Patel",
    stage: "First Meeting",
    primaryPhysicianId: physician.id,
  },
  {
    id: "patient-003",
    name: "Noah Kim",
    stage: "Scheduled Surgery",
    primaryPhysicianId: physician.id,
  },
  {
    id: "patient-004",
    name: "Mia Thompson",
    stage: "Pre-Op Clearance",
    primaryPhysicianId: physician.id,
  },
  {
    id: "patient-005",
    name: "Ethan Brooks",
    stage: "Post-Op Follow Up",
    primaryPhysicianId: physician.id,
  },
];

export const noShowCountByPatient = buildNoShowCounts(appointments);

export const patients: Patient[] = applyRiskToPatients(
  basePatients,
  noShowCountByPatient
);
