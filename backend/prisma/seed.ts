import { PrismaClient } from "@prisma/client";
import { mockData } from "../src/data/mockData/index.js";
import {
  toPrismaAppointmentStatus,
  toPrismaPatientFlowStage,
  toPrismaAppointmentFlowStepStatus,
  toPrismaPatientIntakeStatus,
} from "../src/data/prismaMappings.js";

const prisma = new PrismaClient();

const buildPrefixedId = (prefix: string, index: number) =>
  `${prefix}-${String(index).padStart(3, "0")}`;

const seed = async () => {
  await prisma.physician.upsert({
    where: { id: mockData.physician.id },
    update: {
      name: mockData.physician.name,
      specialty: mockData.physician.specialty,
      location: mockData.physician.location,
    },
    create: {
      id: mockData.physician.id,
      name: mockData.physician.name,
      specialty: mockData.physician.specialty,
      location: mockData.physician.location,
    },
  });

  await prisma.patient.createMany({
    data: mockData.patients.map((patient) => ({
      id: patient.id,
      name: patient.name,
      stage: toPrismaPatientFlowStage(patient.stage),
      dateOfBirth: new Date(patient.dateOfBirth),
      phoneNumber: patient.phoneNumber,
      emergencyContact: patient.emergencyContact,
      intakeStatus: toPrismaPatientIntakeStatus(patient.intakeStatus),
      primaryPhysicianId: patient.primaryPhysicianId,
    })),
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

  for (const [appointmentIndex, appointment] of mockData.appointments.entries()) {
    await prisma.appointmentFlow.deleteMany({
      where: { appointmentId: appointment.id },
    });

    const flow = await prisma.appointmentFlow.create({
      data: {
        id: buildPrefixedId("flow", appointmentIndex + 1),
        appointmentId: appointment.id,
      },
    });

    await prisma.appointmentFlowStep.createMany({
      data: flowStepsTemplate.map((step, stepIndex) => ({
        id: buildPrefixedId("flowstep", appointmentIndex * 10 + stepIndex + 1),
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
