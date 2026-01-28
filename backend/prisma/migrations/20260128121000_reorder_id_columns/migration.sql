BEGIN;

-- Drop foreign keys before table rebuilds
ALTER TABLE "appointment_flow_steps" DROP CONSTRAINT "appointment_flow_steps_flow_id_fkey";
ALTER TABLE "appointment_flows" DROP CONSTRAINT "appointment_flows_appointment_id_fkey";
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patient_id_fkey";
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_physician_id_fkey";
ALTER TABLE "patients" DROP CONSTRAINT "patients_primary_physician_id_fkey";

-- Physicians: id first
CREATE TABLE "physicians_new" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "specialty" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id")
);

INSERT INTO "physicians_new" ("id", "name", "specialty", "location", "createdAt", "updatedAt")
SELECT "id", "name", "specialty", "location", "createdAt", "updatedAt"
FROM "physicians";

DROP TABLE "physicians";
ALTER TABLE "physicians_new" RENAME TO "physicians";

-- Patients: id first
CREATE TABLE "patients_new" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "stage" "PatientFlowStage" NOT NULL,
  "date_of_birth" DATE NOT NULL,
  "phone_number" TEXT NOT NULL,
  "emergency_contact" TEXT NOT NULL,
  "intake_status" "PatientIntakeStatus" NOT NULL DEFAULT 'sent',
  "primary_physician_id" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id")
);

INSERT INTO "patients_new" (
  "id",
  "name",
  "stage",
  "date_of_birth",
  "phone_number",
  "emergency_contact",
  "intake_status",
  "primary_physician_id",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "name",
  "stage",
  "date_of_birth",
  "phone_number",
  "emergency_contact",
  "intake_status",
  "primary_physician_id",
  "createdAt",
  "updatedAt"
FROM "patients";

DROP TABLE "patients";
ALTER TABLE "patients_new" RENAME TO "patients";

-- Appointments: id first
CREATE TABLE "appointments_new" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "patient_id" UUID NOT NULL,
  "physician_id" UUID NOT NULL,
  "date" TIMESTAMPTZ(3) NOT NULL,
  "type" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "status" "AppointmentStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id")
);

INSERT INTO "appointments_new" (
  "id",
  "patient_id",
  "physician_id",
  "date",
  "type",
  "location",
  "status",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "patient_id",
  "physician_id",
  "date",
  "type",
  "location",
  "status",
  "createdAt",
  "updatedAt"
FROM "appointments";

DROP TABLE "appointments";
ALTER TABLE "appointments_new" RENAME TO "appointments";

-- Appointment flows: id first
CREATE TABLE "appointment_flows_new" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "appointment_id" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("appointment_id")
);

INSERT INTO "appointment_flows_new" ("id", "appointment_id", "createdAt", "updatedAt")
SELECT "id", "appointment_id", "createdAt", "updatedAt"
FROM "appointment_flows";

DROP TABLE "appointment_flows";
ALTER TABLE "appointment_flows_new" RENAME TO "appointment_flows";

-- Appointment flow steps: id first
CREATE TABLE "appointment_flow_steps_new" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "flow_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "status" "AppointmentFlowStepStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("flow_id", "order")
);

INSERT INTO "appointment_flow_steps_new" (
  "id",
  "flow_id",
  "title",
  "order",
  "status",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "flow_id",
  "title",
  "order",
  "status",
  "createdAt",
  "updatedAt"
FROM "appointment_flow_steps";

DROP TABLE "appointment_flow_steps";
ALTER TABLE "appointment_flow_steps_new" RENAME TO "appointment_flow_steps";

-- Recreate foreign keys and indexes
ALTER TABLE "patients"
  ADD CONSTRAINT "patients_primary_physician_id_fkey"
  FOREIGN KEY ("primary_physician_id") REFERENCES "physicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_physician_id_fkey"
  FOREIGN KEY ("physician_id") REFERENCES "physicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "appointment_flows"
  ADD CONSTRAINT "appointment_flows_appointment_id_fkey"
  FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "appointment_flow_steps"
  ADD CONSTRAINT "appointment_flow_steps_flow_id_fkey"
  FOREIGN KEY ("flow_id") REFERENCES "appointment_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "patients_primary_physician_id_idx" ON "patients"("primary_physician_id");
CREATE INDEX "appointments_patient_id_idx" ON "appointments"("patient_id");
CREATE INDEX "appointments_physician_id_idx" ON "appointments"("physician_id");
CREATE INDEX "appointments_date_idx" ON "appointments"("date");
CREATE INDEX "appointments_status_idx" ON "appointments"("status");
CREATE INDEX "appointment_flow_steps_flow_id_idx" ON "appointment_flow_steps"("flow_id");

COMMIT;
