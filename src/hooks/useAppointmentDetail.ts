import { useCallback, useEffect, useState } from "react";
import {
  createAppointmentFlowStep,
  deleteAppointmentFlowStep,
  fetchAppointmentDetail,
  reorderAppointmentFlowStep,
  updateAppointmentFlowStep,
} from "@/lib/api";
import type {
  AppointmentDetail,
  AppointmentFlow,
  AppointmentFlowStepStatus,
} from "@/types/api";

enum AppointmentDetailStatus {
  Loading = "loading",
  Ready = "ready",
  NotFound = "not-found",
  Error = "error",
}

const useAppointmentDetail = (id: string | undefined) => {
  const [detail, setDetail] = useState<AppointmentDetail | null>(null);
  const [status, setStatus] = useState<AppointmentDetailStatus>(
    AppointmentDetailStatus.Loading
  );

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      return () => {
        isMounted = false;
      };
    }

    setStatus(AppointmentDetailStatus.Loading);
    setDetail(null);

    fetchAppointmentDetail(id)
      .then((response) => {
        if (!isMounted) {
          return;
        }
        setDetail(response);
        setStatus(AppointmentDetailStatus.Ready);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        if (error instanceof Error && error.message.includes("404")) {
          setStatus(AppointmentDetailStatus.NotFound);
          return;
        }
        setStatus(AppointmentDetailStatus.Error);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const updateStep = useCallback(
    async (
      stepId: string,
      updates: { status?: AppointmentFlowStepStatus; title?: string }
    ): Promise<AppointmentFlow | null> => {
      if (!detail) {
        return null;
      }

      const previousFlow = detail.flow;
      setDetail((current) =>
        current
          ? {
              ...current,
              flow: {
                ...current.flow,
                steps: current.flow.steps.map((step) =>
                  step.id === stepId ? { ...step, ...updates } : step
                ),
              },
            }
          : current
      );

      try {
        const updatedFlow = await updateAppointmentFlowStep(
          detail.appointment.id,
          stepId,
          updates
        );
        setDetail((current) =>
          current ? { ...current, flow: updatedFlow } : current
        );
        return updatedFlow;
      } catch {
        setDetail((current) =>
          current ? { ...current, flow: previousFlow } : current
        );
        return null;
      }
    },
    [detail]
  );

  const updateStepStatus = useCallback(
    (stepId: string, nextStatus: AppointmentFlowStepStatus) =>
      updateStep(stepId, { status: nextStatus }),
    [updateStep]
  );

  const updateStepTitle = useCallback(
    (stepId: string, title: string) => updateStep(stepId, { title }),
    [updateStep]
  );

  const createStep = useCallback(
    async (title: string): Promise<AppointmentFlow | null> => {
      if (!detail) {
        return null;
      }

      const previousFlow = detail.flow;
      const nextOrder =
        detail.flow.steps.reduce((max, step) => Math.max(max, step.order), 0) + 1;
      const tempId = `temp-${Date.now()}`;

      setDetail((current) =>
        current
          ? {
              ...current,
              flow: {
                ...current.flow,
                steps: [
                  ...current.flow.steps,
                  {
                    id: tempId,
                    title,
                    order: nextOrder,
                    status: "not_started",
                  },
                ],
              },
            }
          : current
      );

      try {
        const updatedFlow = await createAppointmentFlowStep(
          detail.appointment.id,
          { title }
        );
        setDetail((current) =>
          current ? { ...current, flow: updatedFlow } : current
        );
        return updatedFlow;
      } catch {
        setDetail((current) =>
          current ? { ...current, flow: previousFlow } : current
        );
        return null;
      }
    },
    [detail]
  );

  const deleteStep = useCallback(
    async (stepId: string): Promise<AppointmentFlow | null> => {
      if (!detail) {
        return null;
      }

      const previousFlow = detail.flow;
      const remainingSteps = detail.flow.steps
        .filter((step) => step.id !== stepId)
        .sort((a, b) => a.order - b.order)
        .map((step, index) => ({ ...step, order: index + 1 }));

      setDetail((current) =>
        current
          ? {
              ...current,
              flow: {
                ...current.flow,
                steps: remainingSteps,
              },
            }
          : current
      );

      try {
        const updatedFlow = await deleteAppointmentFlowStep(
          detail.appointment.id,
          stepId
        );
        setDetail((current) =>
          current ? { ...current, flow: updatedFlow } : current
        );
        return updatedFlow;
      } catch {
        setDetail((current) =>
          current ? { ...current, flow: previousFlow } : current
        );
        return null;
      }
    },
    [detail]
  );

  const reorderStep = useCallback(
    async (orderedStepIds: string[]): Promise<AppointmentFlow | null> => {
      if (!detail) {
        return null;
      }

      const previousFlow = detail.flow;
      const orderMap = new Map(
        orderedStepIds.map((id, index) => [id, index + 1])
      );
      const nextSteps = detail.flow.steps.map((step) => ({
        ...step,
        order: orderMap.get(step.id) ?? step.order,
      }));

      setDetail((current) =>
        current
          ? {
              ...current,
              flow: {
                ...current.flow,
                steps: nextSteps,
              },
            }
          : current
      );

      try {
        const updatedFlow = await reorderAppointmentFlowStep(
          detail.appointment.id,
          orderedStepIds
        );
        setDetail((current) =>
          current ? { ...current, flow: updatedFlow } : current
        );
        return updatedFlow;
      } catch {
        setDetail((current) =>
          current ? { ...current, flow: previousFlow } : current
        );
        return null;
      }
    },
    [detail]
  );

  const effectiveStatus = id ? status : AppointmentDetailStatus.NotFound;

  return {
    detail,
    effectiveStatus,
    createStep,
    deleteStep,
    reorderStep,
    updateStepStatus,
    updateStep,
    updateStepTitle,
  };
};

export { AppointmentDetailStatus, useAppointmentDetail };
