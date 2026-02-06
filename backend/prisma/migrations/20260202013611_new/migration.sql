/*
  Warnings:

  - The values [sent] on the enum `PatientIntakeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PatientIntakeStatus_new" AS ENUM ('in_progress', 'complete', 'incomplete');
ALTER TABLE "patients" ALTER COLUMN "intake_status" DROP DEFAULT;
ALTER TABLE "patients" ALTER COLUMN "intake_status" TYPE "PatientIntakeStatus_new" USING ("intake_status"::text::"PatientIntakeStatus_new");
ALTER TYPE "PatientIntakeStatus" RENAME TO "PatientIntakeStatus_old";
ALTER TYPE "PatientIntakeStatus_new" RENAME TO "PatientIntakeStatus";
DROP TYPE "PatientIntakeStatus_old";
ALTER TABLE "patients" ALTER COLUMN "intake_status" SET DEFAULT 'incomplete';
COMMIT;
