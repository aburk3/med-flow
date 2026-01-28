import type { Patient, Physician } from "@/types/api";

const joinName = (firstName?: string, lastName?: string) =>
  [firstName, lastName].filter(Boolean).join(" ");

export const formatPatientName = (patient: Patient) =>
  joinName(patient.firstName, patient.lastName);

const formatPhysicianPrefix = (prefix: Physician["prefix"]) => {
  switch (prefix) {
    case "Dr":
      return "Dr.";
    case "NursePractitioner":
      return "Nurse Practitioner";
    default:
      return "";
  }
};

export const formatPhysicianName = (physician: Physician) => {
  const name = joinName(physician.firstName, physician.lastName);
  const prefix = formatPhysicianPrefix(physician.prefix);
  return prefix ? `${prefix} ${name}` : name;
};
