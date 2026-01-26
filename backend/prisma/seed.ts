import { PrismaClient } from "@prisma/client";
import { mockData } from "../src/data/mockData/index.js";
import {
  toPrismaAppointmentStatus,
  toPrismaPatientFlowStage,
} from "../src/data/prismaMappings.js";

const prisma = new PrismaClient();

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
