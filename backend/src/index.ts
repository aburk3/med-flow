import "dotenv/config";
import cors from "cors";
import express from "express";
import type { Response } from "express";
import {
  getAppointments,
  getDashboardData,
  getPatients,
  getPhysicians,
} from "./data/db.js";

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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock backend running on http://localhost:${port}`);
});
