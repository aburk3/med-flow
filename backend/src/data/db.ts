import type {
  Appointment,
  DashboardPayload,
  Patient,
  Physician,
} from "../types.js";
import type {
  Appointment as PrismaAppointment,
  Patient as PrismaPatient,
  Physician as PrismaPhysician,
} from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { applyRiskToPatients, buildNoShowCounts } from "./patientRisk.js";
import {
  toApiAppointmentStatus,
  toApiPatientFlowStage,
} from "./prismaMappings.js";

const toApiPhysician = (physician: PrismaPhysician): Physician => ({
  id: physician.id,
  name: physician.name,
  specialty: physician.specialty,
  location: physician.location,
});

const toApiPatientBase = (
  patient: PrismaPatient
): Omit<Patient, "risk" | "riskReason"> => ({
  id: patient.id,
  name: patient.name,
  stage: toApiPatientFlowStage(patient.stage),
  primaryPhysicianId: patient.primaryPhysicianId,
});

const toApiAppointment = (appointment: PrismaAppointment): Appointment => ({
  id: appointment.id,
  patientId: appointment.patientId,
  physicianId: appointment.physicianId,
  date: appointment.date.toISOString(),
  type: appointment.type,
  location: appointment.location,
  status: toApiAppointmentStatus(appointment.status),
});

const buildNoShowCountsFromAppointments = (
  appointments: PrismaAppointment[]
): Record<string, number> =>
  buildNoShowCounts(
    appointments.map((appointment) => ({
      patientId: appointment.patientId,
      status: toApiAppointmentStatus(appointment.status),
    }))
  );

export const getPhysicians = async (): Promise<Physician[]> => {
  const physicians = await prisma.physician.findMany();
  return physicians.map(toApiPhysician);
};

export const getPatients = async (): Promise<Patient[]> => {
  const [patients, noShowAppointments] = await Promise.all([
    prisma.patient.findMany(),
    prisma.appointment.findMany({
      where: {
        status: "no_show",
      },
    }),
  ]);

  const noShowCounts = buildNoShowCountsFromAppointments(noShowAppointments);
  const patientBases = patients.map(toApiPatientBase);

  return applyRiskToPatients(patientBases, noShowCounts);
};

export const getAppointments = async (
  fromDate?: Date
): Promise<Appointment[]> => {
  const appointments = await prisma.appointment.findMany({
    where: fromDate
      ? {
          date: {
            gte: fromDate,
          },
        }
      : undefined,
  });

  return appointments.map(toApiAppointment);
};

type DashboardOptions = {
  fromDate?: Date;
};

export const getDashboardData = async (
  options: DashboardOptions = {}
): Promise<DashboardPayload> => {
  const [physician, patients, appointments] = await Promise.all([
    prisma.physician.findFirst(),
    prisma.patient.findMany(),
    prisma.appointment.findMany(),
  ]);

  if (!physician) {
    throw new Error("No physician found.");
  }

  const noShowCounts = buildNoShowCountsFromAppointments(appointments);
  const patientBases = patients.map(toApiPatientBase);
  const patientsWithRisk = applyRiskToPatients(patientBases, noShowCounts);
  const filteredAppointments = options.fromDate
    ? appointments.filter(
        (appointment) =>
          appointment.date.getTime() >= options.fromDate.getTime()
      )
    : appointments;

  return {
    physician: toApiPhysician(physician),
    patients: patientsWithRisk,
    appointments: filteredAppointments.map(toApiAppointment),
    noShowCountsByPatient: noShowCounts,
    appointmentsTotal: appointments.length,
  };
};
