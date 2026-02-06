UPDATE "patients"
SET "intake_status" = 'in_progress'
WHERE "intake_status" = 'sent';

ALTER TABLE "patients"
ALTER COLUMN "intake_status" SET DEFAULT 'incomplete';
