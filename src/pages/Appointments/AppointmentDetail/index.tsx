import { Fragment, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarNav } from "@/components/Layout/SidebarNav";
import { Header, Main, Page, Sidebar, Title } from "@/components/Layout/styles";
import {
  GlassPanel,
  SectionTitle,
  SubtleText,
} from "@/styles/glass";
import type { AppointmentFlowStep, AppointmentFlowStepStatus } from "@/types/api";
import {
  AppointmentDetailStatus,
  useAppointmentDetail,
} from "@/hooks/useAppointmentDetail";
import { formatPatientName, formatPhysicianName } from "@/helpers/names";
import { APPOINTMENT_DETAIL_TEXT } from "./constants";
import {
  DetailBlock,
  DetailLabel,
  DetailValue,
  DetailsGrid,
  FlowActionButton,
  FlowAddInput,
  FlowAddRow,
  FlowConnector,
  FlowDangerButton,
  FlowDragHandle,
  FlowDragTooltip,
  FlowHeaderActions,
  FlowHeaderRow,
  FlowStatusPill,
  FlowStatusSelect,
  FlowStepActions,
  FlowStepCard,
  FlowStepMeta,
  FlowStepTitleRow,
  FlowTitleInput,
  FlowTitleText,
  FlowTrack,
} from "./styles";

const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatStatusLabel = (status: AppointmentFlowStepStatus) =>
  status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    detail,
    effectiveStatus,
    createStep,
    deleteStep,
    reorderStep,
    updateStep,
  } = useAppointmentDetail(id);
  const [isEditingFlow, setIsEditingFlow] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [draggedStepId, setDraggedStepId] = useState<string | null>(null);
  const [dragOverStepId, setDragOverStepId] = useState<string | null>(null);
  const [dragInsertPosition, setDragInsertPosition] = useState<
    "before" | "after" | null
  >(null);
  const [draftSteps, setDraftSteps] = useState<AppointmentFlowStep[]>([]);
  const [originalSteps, setOriginalSteps] = useState<AppointmentFlowStep[]>([]);
  const [isSavingFlow, setIsSavingFlow] = useState(false);

  const subtitle =
    effectiveStatus === AppointmentDetailStatus.NotFound
      ? APPOINTMENT_DETAIL_TEXT.notFound
      : effectiveStatus === AppointmentDetailStatus.Error
        ? APPOINTMENT_DETAIL_TEXT.errorDetails
        : APPOINTMENT_DETAIL_TEXT.subtitle;

  const flowSteps = useMemo(
    () =>
      detail?.flow.steps
        ? detail.flow.steps.slice().sort((a, b) => a.order - b.order)
        : [],
    [detail?.flow.steps]
  );

  const visibleSteps = isEditingFlow ? draftSteps : flowSteps;

  const normalizeSteps = (steps: AppointmentFlowStep[]) =>
    steps.map((step, index) => ({ ...step, order: index + 1 }));

  const hasDraftChanges = useMemo(() => {
    if (!isEditingFlow) {
      return false;
    }
    if (draftSteps.length !== originalSteps.length) {
      return true;
    }
    return draftSteps.some((step, index) => {
      const original = originalSteps[index];
      return (
        !original ||
        step.id !== original.id ||
        step.title !== original.title ||
        step.status !== original.status
      );
    });
  }, [draftSteps, isEditingFlow, originalSteps]);

  const sidebarLines = useMemo(() => {
    if (effectiveStatus !== AppointmentDetailStatus.Ready || !detail) {
      return [subtitle];
    }

    return [
      formatPatientName(detail.patient),
      detail.patient.phoneNumber,
      detail.patient.emergencyContact,
    ];
  }, [detail, effectiveStatus, subtitle]);

  const handleStartEditing = () => {
    if (!detail) {
      return;
    }
    const seeded = flowSteps.map((step) => ({ ...step }));
    setDraftSteps(seeded);
    setOriginalSteps(seeded);
    setIsEditingFlow(true);
    setNewStepTitle("");
  };

  const handleCancelEditing = () => {
    setIsEditingFlow(false);
    setDraftSteps([]);
    setOriginalSteps([]);
    setNewStepTitle("");
    setDraggedStepId(null);
    setDragOverStepId(null);
    setDragInsertPosition(null);
  };

  const handleSaveFlow = async () => {
    if (!detail || !hasDraftChanges) {
      handleCancelEditing();
      return;
    }

    setIsSavingFlow(true);
    const originalById = new Map(originalSteps.map((step) => [step.id, step]));
    const baseFlowIds = new Set(originalSteps.map((step) => step.id));
    const tempIdMap = new Map<string, string>();
    let currentFlow = detail.flow;

    try {
      const normalizedDraft = normalizeSteps(draftSteps);
      const newSteps = normalizedDraft.filter((step) => step.id.startsWith("temp-"));

      for (const step of newSteps) {
        const updatedFlow = await createStep(step.title);
        if (!updatedFlow) {
          throw new Error("Failed to create flow step.");
        }
        const previousIds = new Set(currentFlow.steps.map((item) => item.id));
        const created = updatedFlow.steps.find((item) => !previousIds.has(item.id));
        if (created) {
          tempIdMap.set(step.id, created.id);
        }
        currentFlow = updatedFlow;
      }

      const resolvedDraft = normalizedDraft.map((step) => ({
        ...step,
        id: tempIdMap.get(step.id) ?? step.id,
      }));

      for (const step of resolvedDraft) {
        if (!baseFlowIds.has(step.id)) {
          continue;
        }
        const original = originalById.get(step.id);
        if (!original) {
          continue;
        }
        const updates: { title?: string; status?: AppointmentFlowStepStatus } = {};
        if (original.title !== step.title) {
          updates.title = step.title;
        }
        if (original.status !== step.status) {
          updates.status = step.status;
        }
        if (Object.keys(updates).length > 0) {
          const updatedFlow = await updateStep(step.id, updates);
          if (updatedFlow) {
            currentFlow = updatedFlow;
          }
        }
      }

      const resolvedIds = new Set(resolvedDraft.map((step) => step.id));
      const removedSteps = originalSteps.filter((step) => !resolvedIds.has(step.id));
      for (const step of removedSteps) {
        const updatedFlow = await deleteStep(step.id);
        if (updatedFlow) {
          currentFlow = updatedFlow;
        }
      }

      const orderedIds = resolvedDraft.map((step) => step.id);
      if (orderedIds.length > 0) {
        const updatedFlow = await reorderStep(orderedIds);
        if (updatedFlow) {
          currentFlow = updatedFlow;
        }
      }

      setDraftSteps([]);
      setOriginalSteps([]);
      setIsEditingFlow(false);
      setNewStepTitle("");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save appointment flow.", error);
    } finally {
      setIsSavingFlow(false);
    }
  };

  return (
    <Page>
      <Sidebar>
        <GlassPanel>
          <SectionTitle>{APPOINTMENT_DETAIL_TEXT.detailsTitle}</SectionTitle>
          {sidebarLines.map((line) => (
            <SubtleText key={line}>{line}</SubtleText>
          ))}
        </GlassPanel>
        <SidebarNav />
      </Sidebar>
      <Main>
        <Header>
          <div>
            <Title>{APPOINTMENT_DETAIL_TEXT.title}</Title>
            <SubtleText>{subtitle}</SubtleText>
          </div>
        </Header>

        <GlassPanel>
          <FlowHeaderRow>
            <SectionTitle>{APPOINTMENT_DETAIL_TEXT.flowTitle}</SectionTitle>
            <FlowHeaderActions>
              {isEditingFlow ? (
                <>
                  <FlowActionButton
                    type="button"
                    onClick={handleCancelEditing}
                    disabled={isSavingFlow}
                  >
                    Cancel
                  </FlowActionButton>
                  <FlowActionButton
                    type="button"
                    onClick={handleSaveFlow}
                    disabled={!hasDraftChanges || isSavingFlow}
                  >
                    Save
                  </FlowActionButton>
                </>
              ) : (
                <FlowActionButton type="button" onClick={handleStartEditing}>
                  Manage flow
                </FlowActionButton>
              )}
            </FlowHeaderActions>
          </FlowHeaderRow>
          {effectiveStatus === AppointmentDetailStatus.Ready ? (
            <>
              {isEditingFlow ? (
                <FlowAddRow>
                  <FlowAddInput
                    value={newStepTitle}
                    placeholder="New step title"
                    onChange={(event) => setNewStepTitle(event.target.value)}
                  />
                  <FlowActionButton
                    type="button"
                    onClick={() => {
                      const trimmed = newStepTitle.trim();
                      if (!trimmed) {
                        return;
                      }
                      const nextId = `temp-${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 6)}`;
                      setDraftSteps((current) =>
                        normalizeSteps([
                          ...current,
                          {
                            id: nextId,
                            title: trimmed,
                            order: current.length + 1,
                            status: "not_started",
                          },
                        ])
                      );
                      setNewStepTitle("");
                    }}
                    disabled={isSavingFlow}
                  >
                    Add step
                  </FlowActionButton>
                </FlowAddRow>
              ) : null}
              <FlowTrack>
                {visibleSteps.map((step, index) => {
                  const isDragging = draggedStepId === step.id;
                  const isDragOver = dragOverStepId === step.id;

                  return (
                    <Fragment key={step.id}>
                      <FlowStepCard
                        $isDragging={isDragging}
                        $isDragOver={isDragOver}
                        $dragPosition={isDragOver ? dragInsertPosition : null}
                        $isEditable={isEditingFlow}
                        data-flow-step-id={step.id}
                        onDragOver={(event) => {
                          if (!isEditingFlow || !draggedStepId) {
                            return;
                          }
                          event.preventDefault();
                          setDragOverStepId(step.id);
                          const bounds = event.currentTarget.getBoundingClientRect();
                          const midpoint = bounds.left + bounds.width / 2;
                          setDragInsertPosition(
                            event.clientX < midpoint ? "before" : "after"
                          );
                        }}
                        onDragLeave={() => {
                          if (dragOverStepId === step.id) {
                            setDragOverStepId(null);
                            setDragInsertPosition(null);
                          }
                        }}
                        onDrop={(event) => {
                          if (!isEditingFlow) {
                            return;
                          }
                          event.preventDefault();
                          const draggedId =
                            event.dataTransfer.getData("text/plain") || draggedStepId;
                          if (!draggedId || draggedId === step.id) {
                            setDragOverStepId(null);
                            setDragInsertPosition(null);
                            return;
                          }

                          const orderedIds = visibleSteps.map((flowStep) => flowStep.id);
                          const fromIndex = orderedIds.indexOf(draggedId);
                          const rawTargetIndex = orderedIds.indexOf(step.id);
                          if (fromIndex < 0 || rawTargetIndex < 0) {
                            setDragOverStepId(null);
                            setDragInsertPosition(null);
                            return;
                          }
                          const bounds = event.currentTarget.getBoundingClientRect();
                          const midpoint = bounds.left + bounds.width / 2;
                          const targetIndex =
                            rawTargetIndex + (event.clientX < midpoint ? 0 : 1);
                          const nextOrder = [...orderedIds];
                          const [moved] = nextOrder.splice(fromIndex, 1);
                          const adjustedIndex =
                            fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
                          nextOrder.splice(adjustedIndex, 0, moved);

                          setDraftSteps(
                            normalizeSteps(
                              nextOrder
                                .map((id) =>
                                  visibleSteps.find((flowStep) => flowStep.id === id)
                                )
                                .filter(Boolean) as AppointmentFlowStep[]
                            )
                          );
                          setDraggedStepId(null);
                          setDragOverStepId(null);
                          setDragInsertPosition(null);
                        }}
                      >
                        <FlowStepTitleRow>
                          {isEditingFlow ? (
                            <>
                              <FlowDragHandle
                                draggable
                                onDragStart={(event) => {
                                  const card = event.currentTarget.closest(
                                    "[data-flow-step-id]"
                                  );
                                  if (card instanceof HTMLElement) {
                                    const bounds = card.getBoundingClientRect();
                                    event.dataTransfer.setDragImage(
                                      card,
                                      event.clientX - bounds.left,
                                      event.clientY - bounds.top
                                    );
                                  }
                                  event.dataTransfer.setData("text/plain", step.id);
                                  event.dataTransfer.effectAllowed = "move";
                                  setDraggedStepId(step.id);
                                }}
                                onDragEnd={() => {
                                  setDraggedStepId(null);
                                  setDragOverStepId(null);
                                  setDragInsertPosition(null);
                                }}
                                aria-label="Reorder"
                                role="button"
                                tabIndex={0}
                              >
                                |||
                                <FlowDragTooltip>Reorder</FlowDragTooltip>
                              </FlowDragHandle>
                              <FlowTitleInput
                                value={step.title}
                                onChange={(event) => {
                                  const nextTitle = event.target.value;
                                  setDraftSteps((current) =>
                                    current.map((item) =>
                                      item.id === step.id
                                        ? { ...item, title: nextTitle }
                                        : item
                                    )
                                  );
                                }}
                                disabled={isSavingFlow}
                              />
                            </>
                          ) : (
                            <FlowTitleText>{step.title}</FlowTitleText>
                          )}
                        </FlowStepTitleRow>
                        <FlowStepMeta>
                          {isEditingFlow ? (
                            <FlowStatusSelect
                              value={step.status}
                              onChange={(event) => {
                                const nextStatus =
                                  event.target.value as AppointmentFlowStepStatus;
                                setDraftSteps((current) =>
                                  current.map((item) =>
                                    item.id === step.id
                                      ? { ...item, status: nextStatus }
                                      : item
                                  )
                                );
                              }}
                              aria-label={`${step.title} status`}
                              disabled={isSavingFlow}
                            >
                              <option value="not_started">Not started</option>
                              <option value="in_progress">In progress</option>
                              <option value="incomplete">Incomplete</option>
                              <option value="complete">Complete</option>
                            </FlowStatusSelect>
                          ) : (
                            <FlowStatusPill $status={step.status}>
                              {formatStatusLabel(step.status)}
                            </FlowStatusPill>
                          )}
                        </FlowStepMeta>
                        {isEditingFlow ? (
                          <FlowStepActions>
                            <FlowDangerButton
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Delete this flow step? This cannot be undone."
                                  )
                                ) {
                                  setDraftSteps((current) =>
                                    normalizeSteps(
                                      current.filter((item) => item.id !== step.id)
                                    )
                                  );
                                }
                              }}
                              disabled={isSavingFlow}
                            >
                              Delete
                            </FlowDangerButton>
                          </FlowStepActions>
                        ) : null}
                      </FlowStepCard>
                      {index < visibleSteps.length - 1 ? <FlowConnector /> : null}
                    </Fragment>
                  );
                })}
              </FlowTrack>
            </>
          ) : (
            <SubtleText>{APPOINTMENT_DETAIL_TEXT.loadingDetails}</SubtleText>
          )}
        </GlassPanel>

        <GlassPanel>
          <SectionTitle>{APPOINTMENT_DETAIL_TEXT.detailsTitle}</SectionTitle>
          {detail ? (
            <DetailsGrid>
              <DetailBlock>
                <DetailLabel>{APPOINTMENT_DETAIL_TEXT.patientLabel}</DetailLabel>
                <DetailValue>{formatPatientName(detail.patient)}</DetailValue>
              </DetailBlock>
              <DetailBlock>
                <DetailLabel>{APPOINTMENT_DETAIL_TEXT.physicianLabel}</DetailLabel>
                <DetailValue>{formatPhysicianName(detail.physician)}</DetailValue>
              </DetailBlock>
              <DetailBlock>
                <DetailLabel>{APPOINTMENT_DETAIL_TEXT.dateLabel}</DetailLabel>
                <DetailValue>{formatDateTime(detail.appointment.date)}</DetailValue>
              </DetailBlock>
              <DetailBlock>
                <DetailLabel>{APPOINTMENT_DETAIL_TEXT.typeLabel}</DetailLabel>
                <DetailValue>{detail.appointment.type}</DetailValue>
              </DetailBlock>
              <DetailBlock>
                <DetailLabel>{APPOINTMENT_DETAIL_TEXT.locationLabel}</DetailLabel>
                <DetailValue>{detail.appointment.location}</DetailValue>
              </DetailBlock>
              <DetailBlock>
                <DetailLabel>{APPOINTMENT_DETAIL_TEXT.statusLabel}</DetailLabel>
                <DetailValue>{detail.appointment.status}</DetailValue>
              </DetailBlock>
            </DetailsGrid>
          ) : (
            <SubtleText>{APPOINTMENT_DETAIL_TEXT.loadingDetails}</SubtleText>
          )}
        </GlassPanel>
      </Main>
    </Page>
  );
};

export default AppointmentDetail;
