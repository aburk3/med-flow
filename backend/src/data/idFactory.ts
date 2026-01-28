import { randomUUID } from "crypto";

export const getNextAppointmentFlowStepId = async () => randomUUID();
