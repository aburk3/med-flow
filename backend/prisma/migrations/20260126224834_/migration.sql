-- DropForeignKey
ALTER TABLE "appointment_flow_steps" DROP CONSTRAINT "appointment_flow_steps_flow_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment_flows" DROP CONSTRAINT "appointment_flows_appointment_id_fkey";

-- AlterTable
ALTER TABLE "appointment_flow_steps" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "appointment_flows" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "appointment_flows" ADD CONSTRAINT "appointment_flows_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_flow_steps" ADD CONSTRAINT "appointment_flow_steps_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "appointment_flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
