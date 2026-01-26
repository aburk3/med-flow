import type {
  AppointmentStatus,
  PatientFlowStage,
} from "../types.js";
import type {
  AppointmentStatus as PrismaAppointmentStatus,
  PatientFlowStage as PrismaPatientFlowStage,
} from "@prisma/client";

const patientStageToPrisma = {
  "Initial Contact": "InitialContact",
  "First Meeting": "FirstMeeting",
  "Scheduled Surgery": "ScheduledSurgery",
  "Pre-Op Clearance": "PreOpClearance",
  "Post-Op Follow Up": "PostOpFollowUp",
} satisfies Record<PatientFlowStage, PrismaPatientFlowStage>;

const patientStageToApi = {
  InitialContact: "Initial Contact",
  FirstMeeting: "First Meeting",
  ScheduledSurgery: "Scheduled Surgery",
  PreOpClearance: "Pre-Op Clearance",
  PostOpFollowUp: "Post-Op Follow Up",
} satisfies Record<PrismaPatientFlowStage, PatientFlowStage>;

export const toPrismaPatientFlowStage = (
  stage: PatientFlowStage
): PrismaPatientFlowStage => patientStageToPrisma[stage];

export const toApiPatientFlowStage = (
  stage: PrismaPatientFlowStage
): PatientFlowStage => patientStageToApi[stage];

const appointmentStatusToPrisma = {
  completed: "completed",
  canceled: "canceled",
  "no-show": "no_show",
  rescheduled: "rescheduled",
  scheduled: "scheduled",
} satisfies Record<AppointmentStatus, PrismaAppointmentStatus>;

const appointmentStatusToApi = {
  completed: "completed",
  canceled: "canceled",
  no_show: "no-show",
  rescheduled: "rescheduled",
  scheduled: "scheduled",
} satisfies Record<PrismaAppointmentStatus, AppointmentStatus>;

export const toPrismaAppointmentStatus = (
  status: AppointmentStatus
): PrismaAppointmentStatus => appointmentStatusToPrisma[status];

export const toApiAppointmentStatus = (
  status: PrismaAppointmentStatus
): AppointmentStatus => appointmentStatusToApi[status];
