import "dotenv/config";
import cors from "cors";
import express from "express";
import type { Response } from "express";
import {
  getAppointments,
  getAppointmentDetail,
  getDashboardData,
  getPatients,
  getPhysicians,
  createAppointmentFlowStep,
  deleteAppointmentFlowStep,
  reorderAppointmentFlowStep,
  updateAppointmentFlowStep,
} from "./data/db.js";
import type { AppointmentFlowStepStatus } from "./types.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const defaultOrigins = ["http://localhost:3100", "http://localhost:3000"];
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : defaultOrigins;

app.use(
  cors({
    origin: corsOrigins,
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

const parseFromDate = (value: unknown): Date | null => {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const handleError = (response: Response, error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("Database request failed.", error);
  response.status(500).json({ error: "Database request failed." });
};

const isAppointmentFlowStepStatus = (
  value: unknown
): value is AppointmentFlowStepStatus =>
  typeof value === "string" &&
  ["not_started", "in_progress", "incomplete", "complete"].includes(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

app.get("/api/dashboard", async (request, response) => {
  const fromDate = parseFromDate(request.query.from);
  try {
    const payload = await getDashboardData({ fromDate: fromDate ?? undefined });
    response.json(payload);
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/physicians", async (_request, response) => {
  try {
    const physicians = await getPhysicians();
    response.json(physicians);
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/patients", async (_request, response) => {
  try {
    const patients = await getPatients();
    response.json(patients);
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/appointments", async (request, response) => {
  const fromDate = parseFromDate(request.query.from);
  try {
    const appointments = await getAppointments(fromDate ?? undefined);
    response.json(appointments);
  } catch (error) {
    handleError(response, error);
  }
});

app.get("/api/appointments/:id", async (request, response) => {
  try {
    const detail = await getAppointmentDetail(request.params.id);
    if (!detail) {
      response.status(404).json({ error: "Appointment not found." });
      return;
    }
    response.json(detail);
  } catch (error) {
    handleError(response, error);
  }
});

app.post("/api/appointments/:id/flow/steps", async (request, response) => {
  const title = request.body?.title;
  const status = request.body?.status;

  if (!isNonEmptyString(title)) {
    response.status(400).json({ error: "Step title is required." });
    return;
  }

  if (status && !isAppointmentFlowStepStatus(status)) {
    response.status(400).json({ error: "Invalid step status." });
    return;
  }

  try {
    const flow = await createAppointmentFlowStep(
      request.params.id,
      title.trim(),
      status ?? "not_started"
    );
    if (!flow) {
      response.status(404).json({ error: "Appointment flow not found." });
      return;
    }
    response.json(flow);
  } catch (error) {
    handleError(response, error);
  }
});

app.patch("/api/appointments/:id/flow/steps/reorder", async (request, response) => {
  const orderedStepIds = request.body?.orderedStepIds;

  if (!isStringArray(orderedStepIds) || orderedStepIds.length === 0) {
    response.status(400).json({ error: "Ordered step ids are required." });
    return;
  }

  try {
    const flow = await reorderAppointmentFlowStep(
      request.params.id,
      orderedStepIds
    );
    if (!flow) {
      response.status(404).json({ error: "Flow step not found." });
      return;
    }
    response.json(flow);
  } catch (error) {
    handleError(response, error);
  }
});

app.patch("/api/appointments/:id/flow/steps/:stepId", async (request, response) => {
  const status = request.body?.status;
  const title = request.body?.title;

  const hasStatus = status !== undefined;
  const hasTitle = title !== undefined;

  if (!hasStatus && !hasTitle) {
    response.status(400).json({ error: "No step updates provided." });
    return;
  }

  if (hasStatus && !isAppointmentFlowStepStatus(status)) {
    response.status(400).json({ error: "Invalid step status." });
    return;
  }

  if (hasTitle && !isNonEmptyString(title)) {
    response.status(400).json({ error: "Invalid step title." });
    return;
  }

  try {
    const flow = await updateAppointmentFlowStep(request.params.id, request.params.stepId, {
      status,
      title: hasTitle ? title.trim() : undefined,
    });
    if (!flow) {
      response.status(404).json({ error: "Flow step not found." });
      return;
    }
    response.json(flow);
  } catch (error) {
    handleError(response, error);
  }
});

app.delete(
  "/api/appointments/:id/flow/steps/:stepId",
  async (request, response) => {
    try {
      const flow = await deleteAppointmentFlowStep(
        request.params.id,
        request.params.stepId
      );
      if (!flow) {
        response.status(404).json({ error: "Flow step not found." });
        return;
      }
      response.json(flow);
    } catch (error) {
      handleError(response, error);
    }
  }
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock backend running on http://localhost:${port}`);
});
