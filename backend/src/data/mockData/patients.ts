import type { Patient } from "../../types.js";
import { applyRiskToPatients, buildNoShowCounts } from "../patientRisk.js";
import { appointments } from "./appointments.js";
import { physician } from "./physician.js";

const basePatients: Omit<Patient, "risk" | "riskReason">[] = [
  {
    id: "a1b2c3d4-1111-4aaa-9bbb-111111111111",
    firstName: "Sophia",
    lastName: "Ramirez",
    stage: "Initial Contact",
    dateOfBirth: "1991-02-14",
    phoneNumber: "(415) 555-0142",
    emergencyContact: "Miguel Ramirez · (415) 555-0177",
    intakeStatus: "sent",
    primaryPhysicianId: physician.id,
  },
  {
    id: "b2c3d4e5-2222-4bbb-8ccc-222222222222",
    firstName: "Liam",
    lastName: "Patel",
    stage: "First Meeting",
    dateOfBirth: "1987-08-22",
    phoneNumber: "(415) 555-0128",
    emergencyContact: "Asha Patel · (415) 555-0194",
    intakeStatus: "complete",
    primaryPhysicianId: physician.id,
  },
  {
    id: "c3d4e5f6-3333-4ccc-8ddd-333333333333",
    firstName: "Noah",
    lastName: "Kim",
    stage: "Scheduled Surgery",
    dateOfBirth: "1979-11-05",
    phoneNumber: "(415) 555-0113",
    emergencyContact: "Hana Kim · (415) 555-0133",
    intakeStatus: "incomplete",
    primaryPhysicianId: physician.id,
  },
  {
    id: "d4e5f6a7-4444-4ddd-8eee-444444444444",
    firstName: "Mia",
    lastName: "Thompson",
    stage: "Pre-Op Clearance",
    dateOfBirth: "1993-06-30",
    phoneNumber: "(415) 555-0151",
    emergencyContact: "Jordan Thompson · (415) 555-0168",
    intakeStatus: "complete",
    primaryPhysicianId: physician.id,
  },
  {
    id: "e5f6a7b8-5555-4eee-8fff-555555555555",
    firstName: "Ethan",
    lastName: "Brooks",
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
