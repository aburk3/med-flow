-- Add patient intake and contact fields
ALTER TABLE "patients"
ADD COLUMN "date_of_birth" DATE,
ADD COLUMN "phone_number" TEXT,
ADD COLUMN "emergency_contact" TEXT,
ADD COLUMN "intake_status" TEXT DEFAULT 'sent';

-- Add patient intake status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PatientIntakeStatus') THEN
    CREATE TYPE "PatientIntakeStatus" AS ENUM ('sent', 'complete', 'incomplete');
  END IF;
END $$;

ALTER TABLE "patients"
ALTER COLUMN "intake_status" DROP DEFAULT;

ALTER TABLE "patients"
ALTER COLUMN "intake_status" TYPE "PatientIntakeStatus"
USING "intake_status"::"PatientIntakeStatus";

ALTER TABLE "patients"
ALTER COLUMN "intake_status" SET DEFAULT 'sent'::"PatientIntakeStatus";

UPDATE "patients"
SET "date_of_birth" = COALESCE("date_of_birth", '1970-01-01'::DATE),
    "phone_number" = COALESCE("phone_number", 'Unknown'),
    "emergency_contact" = COALESCE("emergency_contact", 'Unknown'),
    "intake_status" = COALESCE("intake_status", 'sent'::"PatientIntakeStatus");

ALTER TABLE "patients"
ALTER COLUMN "date_of_birth" SET NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL,
ALTER COLUMN "emergency_contact" SET NOT NULL,
ALTER COLUMN "intake_status" SET NOT NULL;

-- Appointment flow status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AppointmentFlowStepStatus') THEN
    CREATE TYPE "AppointmentFlowStepStatus" AS ENUM ('not_started', 'in_progress', 'incomplete', 'complete');
  END IF;
END $$;

-- Appointment flows tables
CREATE TABLE IF NOT EXISTS "appointment_flows" (
  "id" TEXT PRIMARY KEY,
  "appointment_id" TEXT NOT NULL UNIQUE REFERENCES "appointments" ("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "appointment_flow_steps" (
  "id" TEXT PRIMARY KEY,
  "flow_id" TEXT NOT NULL REFERENCES "appointment_flows" ("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "status" "AppointmentFlowStepStatus" NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("flow_id", "order")
);

CREATE INDEX IF NOT EXISTS "appointment_flow_steps_flow_id_idx" ON "appointment_flow_steps" ("flow_id");
