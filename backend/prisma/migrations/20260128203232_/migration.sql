-- AlterTable
ALTER TABLE "appointment_flow_steps" RENAME CONSTRAINT "appointment_flow_steps_new_pkey" TO "appointment_flow_steps_pkey";

-- AlterTable
ALTER TABLE "appointment_flows" RENAME CONSTRAINT "appointment_flows_new_pkey" TO "appointment_flows_pkey";

-- AlterTable
ALTER TABLE "appointments" RENAME CONSTRAINT "appointments_new_pkey" TO "appointments_pkey";

-- AlterTable
ALTER TABLE "patients" RENAME CONSTRAINT "patients_new_pkey" TO "patients_pkey";

-- AlterTable
ALTER TABLE "physicians" RENAME CONSTRAINT "physicians_new_pkey" TO "physicians_pkey";

-- RenameIndex
ALTER INDEX "appointment_flow_steps_new_flow_id_order_key" RENAME TO "appointment_flow_steps_flow_id_order_key";

-- RenameIndex
ALTER INDEX "appointment_flows_new_appointment_id_key" RENAME TO "appointment_flows_appointment_id_key";
