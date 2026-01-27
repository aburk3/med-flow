import type { Patient } from "../../types.js";
import { applyRiskToPatients, buildNoShowCounts } from "../patientRisk.js";
import { appointments } from "./appointments.js";
import { physician } from "./physician.js";

const basePatients: Omit<Patient, "risk" | "riskReason">[] = [
  {
    id: "patient-001",
    name: "Sophia Ramirez",
    stage: "Initial Contact",
    dateOfBirth: "1991-02-14",
    phoneNumber: "(415) 555-0142",
    emergencyContact: "Miguel Ramirez · (415) 555-0177",
    intakeStatus: "sent",
    primaryPhysicianId: physician.id,
  },
  {
    id: "patient-002",
    name: "Liam Patel",
    stage: "First Meeting",
    dateOfBirth: "1987-08-22",
    phoneNumber: "(415) 555-0128",
    emergencyContact: "Asha Patel · (415) 555-0194",
    intakeStatus: "complete",
    primaryPhysicianId: physician.id,
  },
  {
    id: "patient-003",
    name: "Noah Kim",
    stage: "Scheduled Surgery",
    dateOfBirth: "1979-11-05",
    phoneNumber: "(415) 555-0113",
    emergencyContact: "Hana Kim · (415) 555-0133",
    intakeStatus: "incomplete",
    primaryPhysicianId: physician.id,
  },
  {
    id: "patient-004",
    name: "Mia Thompson",
    stage: "Pre-Op Clearance",
    dateOfBirth: "1993-06-30",
    phoneNumber: "(415) 555-0151",
    emergencyContact: "Jordan Thompson · (415) 555-0168",
    intakeStatus: "complete",
    primaryPhysicianId: physician.id,
  },
  {
    id: "patient-005",
    name: "Ethan Brooks",
    stage: "Post-Op Follow Up",
    dateOfBirth: "1982-03-12",
    phoneNumber: "(415) 555-0104",
    emergencyContact: "Riley Brooks · (415) 555-0182",
    intakeStatus: "sent",
    primaryPhysicianId: physician.id,
  },
];

export const noShowCountByPatient = buildNoShowCounts(appointments);

export const patients: Patient[] = applyRiskToPatients(
  basePatients,
  noShowCountByPatient
);
