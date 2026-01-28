import type {
  Appointment,
  AppointmentDetail,
  AppointmentFlow,
  AppointmentFlowStep,
  AppointmentFlowStepStatus,
  DashboardPayload,
  Patient,
  Physician,
} from "../types.js";
import type {
  Appointment as PrismaAppointment,
  AppointmentFlow as PrismaAppointmentFlow,
  AppointmentFlowStep as PrismaAppointmentFlowStep,
  Patient as PrismaPatient,
  Physician as PrismaPhysician,
} from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { applyRiskToPatients, buildNoShowCounts } from "./patientRisk.js";
import {
  toApiAppointmentStatus,
  toApiAppointmentFlowStepStatus,
  toApiPatientFlowStage,
  toApiPatientIntakeStatus,
  toPrismaAppointmentFlowStepStatus,
} from "./prismaMappings.js";
import { getNextAppointmentFlowStepId } from "./idFactory.js";

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
  dateOfBirth: patient.dateOfBirth.toISOString(),
  phoneNumber: patient.phoneNumber,
  emergencyContact: patient.emergencyContact,
  intakeStatus: toApiPatientIntakeStatus(patient.intakeStatus),
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

const toApiAppointmentFlowStep = (
  step: PrismaAppointmentFlowStep
): AppointmentFlowStep => ({
  id: step.id,
  title: step.title,
  order: step.order,
  status: toApiAppointmentFlowStepStatus(step.status),
});

const toApiAppointmentFlow = (
  flow: PrismaAppointmentFlow & { steps: PrismaAppointmentFlowStep[] }
): AppointmentFlow => ({
  id: flow.id,
  appointmentId: flow.appointmentId,
  steps: flow.steps
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(toApiAppointmentFlowStep),
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

export const getAppointmentDetail = async (
  appointmentId: string
): Promise<AppointmentDetail | null> => {
  const [appointment, noShowAppointments] = await Promise.all([
    prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        physician: true,
        flow: {
          include: {
            steps: true,
          },
        },
      },
    }),
    prisma.appointment.findMany({
      where: {
        status: "no_show",
      },
    }),
  ]);

  if (!appointment || !appointment.flow) {
    return null;
  }

  const noShowCounts = buildNoShowCountsFromAppointments(noShowAppointments);
  const [patientWithRisk] = applyRiskToPatients(
    [toApiPatientBase(appointment.patient)],
    noShowCounts
  );

  return {
    appointment: toApiAppointment(appointment),
    patient: patientWithRisk,
    physician: toApiPhysician(appointment.physician),
    flow: toApiAppointmentFlow(appointment.flow),
  };
};

export const updateAppointmentFlowStepStatus = async (
  appointmentId: string,
  stepId: string,
  status: AppointmentFlowStepStatus
): Promise<AppointmentFlow | null> => {
  return updateAppointmentFlowStep(appointmentId, stepId, { status });
};

export const updateAppointmentFlowStep = async (
  appointmentId: string,
  stepId: string,
  updates: { status?: AppointmentFlowStepStatus; title?: string }
): Promise<AppointmentFlow | null> => {
  const flowStep = await prisma.appointmentFlowStep.findFirst({
    where: {
      id: stepId,
      flow: {
        appointmentId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!flowStep) {
    return null;
  }

  const data: {
    status?: AppointmentFlowStepStatus;
    title?: string;
  } = {};

  if (updates.status) {
    data.status = toPrismaAppointmentFlowStepStatus(updates.status);
  }
  if (updates.title !== undefined) {
    data.title = updates.title;
  }

  if (Object.keys(data).length === 0) {
    return null;
  }

  await prisma.appointmentFlowStep.update({
    where: { id: stepId },
    data,
  });

  const flow = await prisma.appointmentFlow.findUnique({
    where: { appointmentId },
    include: {
      steps: true,
    },
  });

  if (!flow) {
    return null;
  }

  return toApiAppointmentFlow(flow);
};

export const createAppointmentFlowStep = async (
  appointmentId: string,
  title: string,
  status: AppointmentFlowStepStatus = "not_started"
): Promise<AppointmentFlow | null> => {
  const flow = await prisma.appointmentFlow.findUnique({
    where: { appointmentId },
    include: { steps: true },
  });

  if (!flow) {
    return null;
  }

  const nextOrder =
    flow.steps.reduce((max, step) => Math.max(max, step.order), 0) + 1;
  const nextId = await getNextAppointmentFlowStepId();

  await prisma.appointmentFlowStep.create({
    data: {
      id: nextId,
      flowId: flow.id,
      title,
      order: nextOrder,
      status: toPrismaAppointmentFlowStepStatus(status),
    },
  });

  const updatedFlow = await prisma.appointmentFlow.findUnique({
    where: { appointmentId },
    include: { steps: true },
  });

  return updatedFlow ? toApiAppointmentFlow(updatedFlow) : null;
};

export const deleteAppointmentFlowStep = async (
  appointmentId: string,
  stepId: string
): Promise<AppointmentFlow | null> => {
  const flow = await prisma.appointmentFlow.findUnique({
    where: { appointmentId },
  });

  if (!flow) {
    return null;
  }

  const flowStep = await prisma.appointmentFlowStep.findFirst({
    where: {
      id: stepId,
      flowId: flow.id,
    },
  });

  if (!flowStep) {
    return null;
  }

  await prisma.appointmentFlowStep.delete({
    where: { id: stepId },
  });

  const remainingSteps = await prisma.appointmentFlowStep.findMany({
    where: { flowId: flow.id },
    orderBy: { order: "asc" },
  });

  await prisma.$transaction(
    remainingSteps.map((step, index) =>
      prisma.appointmentFlowStep.update({
        where: { id: step.id },
        data: { order: index + 1 },
      })
    )
  );

  const updatedFlow = await prisma.appointmentFlow.findUnique({
    where: { appointmentId },
    include: { steps: true },
  });

  return updatedFlow ? toApiAppointmentFlow(updatedFlow) : null;
};

export const reorderAppointmentFlowStep = async (
  appointmentId: string,
  orderedStepIds: string[]
): Promise<AppointmentFlow | null> => {
  const flow = await prisma.appointmentFlow.findUnique({
    where: { appointmentId },
    include: { steps: true },
  });

  if (!flow) {
    return null;
  }

  const flowStepIds = flow.steps.map((step) => step.id);
  if (orderedStepIds.length !== flowStepIds.length) {
    return null;
  }

  const idSet = new Set(flowStepIds);
  const isValidOrder =
    orderedStepIds.every((id) => idSet.has(id)) &&
    new Set(orderedStepIds).size === flowStepIds.length;

  if (!isValidOrder) {
    return null;
  }

  const orderOffset = orderedStepIds.length;

  await prisma.$transaction([
    prisma.appointmentFlowStep.updateMany({
      where: { flowId: flow.id },
      data: { order: { increment: orderOffset } },
    }),
    ...orderedStepIds.map((id, index) =>
      prisma.appointmentFlowStep.update({
        where: { id },
        data: { order: index + 1 },
      })
    ),
  ]);

  const updatedFlow = await prisma.appointmentFlow.findUnique({
    where: { appointmentId },
    include: { steps: true },
  });

  return updatedFlow ? toApiAppointmentFlow(updatedFlow) : null;
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
  const { fromDate } = options;
  const filteredAppointments = fromDate
    ? appointments.filter(
        (appointment) => appointment.date.getTime() >= fromDate.getTime()
      )
    : appointments;

  return {
    physician: toApiPhysician(physician),
    patients: patientsWithRisk,
    appointments: filteredAppointments.map(toApiAppointment),
    noShowCountsByPatient: noShowCounts,
    appointmentsTotal: filteredAppointments.length,
  };
};
