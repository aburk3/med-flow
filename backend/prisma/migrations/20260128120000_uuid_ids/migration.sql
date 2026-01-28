-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing foreign keys
ALTER TABLE "appointment_flow_steps" DROP CONSTRAINT "appointment_flow_steps_flow_id_fkey";
ALTER TABLE "appointment_flows" DROP CONSTRAINT "appointment_flows_appointment_id_fkey";
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patient_id_fkey";
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_physician_id_fkey";
ALTER TABLE "patients" DROP CONSTRAINT "patients_primary_physician_id_fkey";

-- Drop indexes tied to old ID columns
DROP INDEX IF EXISTS "patients_primary_physician_id_idx";
DROP INDEX IF EXISTS "appointments_patient_id_idx";
DROP INDEX IF EXISTS "appointments_physician_id_idx";
DROP INDEX IF EXISTS "appointment_flow_steps_flow_id_idx";

-- Add UUID columns
ALTER TABLE "physicians" ADD COLUMN "id_uuid" UUID;
UPDATE "physicians" SET "id_uuid" = gen_random_uuid();
ALTER TABLE "physicians" ALTER COLUMN "id_uuid" SET NOT NULL;

ALTER TABLE "patients" ADD COLUMN "id_uuid" UUID;
ALTER TABLE "patients" ADD COLUMN "primary_physician_id_uuid" UUID;
UPDATE "patients" SET "id_uuid" = gen_random_uuid();
UPDATE "patients"
SET "primary_physician_id_uuid" = physician."id_uuid"
FROM "physicians" AS physician
WHERE "patients"."primary_physician_id" = physician."id";
ALTER TABLE "patients" ALTER COLUMN "id_uuid" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "primary_physician_id_uuid" SET NOT NULL;

ALTER TABLE "appointments" ADD COLUMN "id_uuid" UUID;
ALTER TABLE "appointments" ADD COLUMN "patient_id_uuid" UUID;
ALTER TABLE "appointments" ADD COLUMN "physician_id_uuid" UUID;
UPDATE "appointments" SET "id_uuid" = gen_random_uuid();
UPDATE "appointments"
SET "patient_id_uuid" = patient."id_uuid"
FROM "patients" AS patient
WHERE "appointments"."patient_id" = patient."id";
UPDATE "appointments"
SET "physician_id_uuid" = physician."id_uuid"
FROM "physicians" AS physician
WHERE "appointments"."physician_id" = physician."id";
ALTER TABLE "appointments" ALTER COLUMN "id_uuid" SET NOT NULL;
ALTER TABLE "appointments" ALTER COLUMN "patient_id_uuid" SET NOT NULL;
ALTER TABLE "appointments" ALTER COLUMN "physician_id_uuid" SET NOT NULL;

ALTER TABLE "appointment_flows" ADD COLUMN "id_uuid" UUID;
ALTER TABLE "appointment_flows" ADD COLUMN "appointment_id_uuid" UUID;
UPDATE "appointment_flows" SET "id_uuid" = gen_random_uuid();
UPDATE "appointment_flows"
SET "appointment_id_uuid" = appointment."id_uuid"
FROM "appointments" AS appointment
WHERE "appointment_flows"."appointment_id" = appointment."id";
ALTER TABLE "appointment_flows" ALTER COLUMN "id_uuid" SET NOT NULL;
ALTER TABLE "appointment_flows" ALTER COLUMN "appointment_id_uuid" SET NOT NULL;

ALTER TABLE "appointment_flow_steps" ADD COLUMN "id_uuid" UUID;
ALTER TABLE "appointment_flow_steps" ADD COLUMN "flow_id_uuid" UUID;
UPDATE "appointment_flow_steps" SET "id_uuid" = gen_random_uuid();
UPDATE "appointment_flow_steps"
SET "flow_id_uuid" = flow."id_uuid"
FROM "appointment_flows" AS flow
WHERE "appointment_flow_steps"."flow_id" = flow."id";
ALTER TABLE "appointment_flow_steps" ALTER COLUMN "id_uuid" SET NOT NULL;
ALTER TABLE "appointment_flow_steps" ALTER COLUMN "flow_id_uuid" SET NOT NULL;

-- Drop primary keys so old ID columns can be removed
ALTER TABLE "appointment_flow_steps" DROP CONSTRAINT "appointment_flow_steps_pkey";
ALTER TABLE "appointment_flows" DROP CONSTRAINT "appointment_flows_pkey";
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_pkey";
ALTER TABLE "patients" DROP CONSTRAINT "patients_pkey";
ALTER TABLE "physicians" DROP CONSTRAINT "physicians_pkey";

-- Drop old ID columns
ALTER TABLE "appointment_flow_steps" DROP COLUMN "id", DROP COLUMN "flow_id";
ALTER TABLE "appointment_flows" DROP COLUMN "id", DROP COLUMN "appointment_id";
ALTER TABLE "appointments" DROP COLUMN "id", DROP COLUMN "patient_id", DROP COLUMN "physician_id";
ALTER TABLE "patients" DROP COLUMN "id", DROP COLUMN "primary_physician_id";
ALTER TABLE "physicians" DROP COLUMN "id";

-- Rename UUID columns to standard names
ALTER TABLE "physicians" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "patients" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "patients" RENAME COLUMN "primary_physician_id_uuid" TO "primary_physician_id";
ALTER TABLE "appointments" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "appointments" RENAME COLUMN "patient_id_uuid" TO "patient_id";
ALTER TABLE "appointments" RENAME COLUMN "physician_id_uuid" TO "physician_id";
ALTER TABLE "appointment_flows" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "appointment_flows" RENAME COLUMN "appointment_id_uuid" TO "appointment_id";
ALTER TABLE "appointment_flow_steps" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "appointment_flow_steps" RENAME COLUMN "flow_id_uuid" TO "flow_id";

-- Defaults for UUID primary keys
ALTER TABLE "physicians" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "patients" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "appointments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "appointment_flows" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "appointment_flow_steps" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Recreate primary keys
ALTER TABLE "physicians" ADD CONSTRAINT "physicians_pkey" PRIMARY KEY ("id");
ALTER TABLE "patients" ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");
ALTER TABLE "appointment_flows" ADD CONSTRAINT "appointment_flows_pkey" PRIMARY KEY ("id");
ALTER TABLE "appointment_flow_steps" ADD CONSTRAINT "appointment_flow_steps_pkey" PRIMARY KEY ("id");

-- Recreate unique constraints
ALTER TABLE "appointment_flows"
ADD CONSTRAINT "appointment_flows_appointment_id_key" UNIQUE ("appointment_id");
ALTER TABLE "appointment_flow_steps"
ADD CONSTRAINT "appointment_flow_steps_flow_id_order_key" UNIQUE ("flow_id", "order");

-- Recreate foreign keys
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

-- Recreate indexes
CREATE INDEX "patients_primary_physician_id_idx" ON "patients"("primary_physician_id");
CREATE INDEX "appointments_patient_id_idx" ON "appointments"("patient_id");
CREATE INDEX "appointments_physician_id_idx" ON "appointments"("physician_id");
CREATE INDEX "appointment_flow_steps_flow_id_idx" ON "appointment_flow_steps"("flow_id");
