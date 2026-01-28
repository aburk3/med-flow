import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { mockData } from "../src/data/mockData/index.js";
import {
  toPrismaAppointmentStatus,
  toPrismaPatientFlowStage,
  toPrismaAppointmentFlowStepStatus,
  toPrismaPatientIntakeStatus,
} from "../src/data/prismaMappings.js";

const prisma = new PrismaClient();

const seed = async () => {
  const physicianUpdate = {
    prefix: mockData.physician.prefix,
    firstName: mockData.physician.firstName,
    lastName: mockData.physician.lastName,
    specialty: mockData.physician.specialty,
    location: mockData.physician.location,
  } as Prisma.PhysicianUncheckedUpdateInput;

  const physicianCreate = {
    id: mockData.physician.id,
    prefix: mockData.physician.prefix,
    firstName: mockData.physician.firstName,
    lastName: mockData.physician.lastName,
    specialty: mockData.physician.specialty,
    location: mockData.physician.location,
  } as unknown as Prisma.PhysicianUncheckedCreateInput;

  await prisma.physician.upsert({
    where: { id: mockData.physician.id },
    update: physicianUpdate,
    create: physicianCreate,
  });

  const patientRows = mockData.patients.map((patient) => ({
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    stage: toPrismaPatientFlowStage(patient.stage),
    dateOfBirth: new Date(patient.dateOfBirth),
    phoneNumber: patient.phoneNumber,
    emergencyContact: patient.emergencyContact,
    intakeStatus: toPrismaPatientIntakeStatus(patient.intakeStatus),
    primaryPhysicianId: patient.primaryPhysicianId,
  })) as unknown as Prisma.PatientCreateManyInput[];

  await prisma.patient.createMany({
    data: patientRows,
    skipDuplicates: true,
  });

  await prisma.appointment.createMany({
    data: mockData.appointments.map((appointment) => ({
      id: appointment.id,
      patientId: appointment.patientId,
      physicianId: appointment.physicianId,
      date: new Date(appointment.date),
      type: appointment.type,
      location: appointment.location,
      status: toPrismaAppointmentStatus(appointment.status),
    })),
    skipDuplicates: true,
  });

  const flowStepsTemplate = [
    { title: "Scheduled", order: 1 },
    { title: "Appointment Confirmed", order: 2 },
    { title: "Appointment", order: 3 },
    { title: "Follow Up", order: 4 },
  ] as const;

  for (const appointment of mockData.appointments) {
    await prisma.appointmentFlow.deleteMany({
      where: { appointmentId: appointment.id },
    });

    const flow = await prisma.appointmentFlow.create({
      data: {
        id: randomUUID(),
        appointmentId: appointment.id,
      },
    });

    await prisma.appointmentFlowStep.createMany({
      data: flowStepsTemplate.map((step) => ({
        id: randomUUID(),
        flowId: flow.id,
        title: step.title,
        order: step.order,
        status: toPrismaAppointmentFlowStepStatus(
          step.order === 1 ? "in_progress" : "not_started"
        ),
      })),
    });
  }
};

seed()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to seed database.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
