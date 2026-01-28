-- AlterTable
ALTER TABLE "appointment_flow_steps" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "appointment_flows" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "physicians" ALTER COLUMN "id" DROP DEFAULT;
