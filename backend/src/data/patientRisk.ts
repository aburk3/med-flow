import type { AppointmentStatus, Patient, PatientRisk } from "../types.js";

type AppointmentLike = {
  patientId: string;
  status: AppointmentStatus;
};

type PatientBase = Omit<Patient, "risk" | "riskReason">;

export const buildNoShowCounts = (
  appointments: AppointmentLike[]
): Record<string, number> =>
  appointments.reduce<Record<string, number>>((accumulator, appointment) => {
    if (appointment.status === "no-show") {
      accumulator[appointment.patientId] =
        (accumulator[appointment.patientId] ?? 0) + 1;
    }
    return accumulator;
  }, {});

const calculateRisk = (noShowCount: number): PatientRisk => {
  if (noShowCount > 3) {
    return "high";
  }

  if (noShowCount >= 1) {
    return "medium";
  }

  return "low";
};

const buildRiskReason = (noShowCount: number): string => {
  if (noShowCount > 3) {
    return `Missed ${noShowCount} appointments.`;
  }

  if (noShowCount >= 1) {
    const noun = noShowCount === 1 ? "appointment" : "appointments";
    return `Missed ${noShowCount} ${noun}.`;
  }

  return "No missed appointments.";
};

export const applyRiskToPatients = (
  patients: PatientBase[],
  noShowCounts: Record<string, number>
): Patient[] =>
  patients.map((patient) => {
    const noShowCount = noShowCounts[patient.id] ?? 0;

    return {
      ...patient,
      risk: calculateRisk(noShowCount),
      riskReason: buildRiskReason(noShowCount),
    };
  });
