import { prisma } from "../db/prisma.js";

const buildPrefixedId = (prefix: string, index: number) =>
  `${prefix}-${String(index).padStart(3, "0")}`;

const parsePrefixedId = (id: string, prefix: string): number | null => {
  if (!id.startsWith(`${prefix}-`)) {
    return null;
  }

  const numeric = Number.parseInt(id.slice(prefix.length + 1), 10);
  return Number.isNaN(numeric) ? null : numeric;
};

const getNextPrefixedId = async (
  prefix: string,
  findLatest: () => Promise<{ id: string } | null>
): Promise<string> => {
  const latest = await findLatest();
  const latestNumber = latest ? parsePrefixedId(latest.id, prefix) : null;
  const nextIndex = typeof latestNumber === "number" ? latestNumber + 1 : 1;
  return buildPrefixedId(prefix, nextIndex);
};

export const getNextAppointmentFlowId = () =>
  getNextPrefixedId("flow", () =>
    prisma.appointmentFlow.findFirst({
      where: {
        id: {
          startsWith: "flow-",
        },
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
      },
    })
  );

export const getNextAppointmentFlowStepId = () =>
  getNextPrefixedId("flowstep", () =>
    prisma.appointmentFlowStep.findFirst({
      where: {
        id: {
          startsWith: "flowstep-",
        },
      },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
      },
    })
  );
