import { Fragment, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
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
import { APPOINTMENT_DETAIL_TEXT } from "./constants";

const FlowTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  overflow-x: auto;
  overflow-y: visible;
  padding: 16px 0 4px;
`;

const FlowHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
`;

const FlowHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FlowStepCard = styled.div<{
  $isDragging?: boolean;
  $isDragOver?: boolean;
  $dragPosition?: "before" | "after" | null;
  $isEditable?: boolean;
}>`
  min-width: 200px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid
    ${({ $isDragOver, theme }) =>
      $isDragOver ? "rgba(125, 211, 252, 0.9)" : theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(18px) saturate(160%);
  opacity: ${({ $isDragging }) => ($isDragging ? 0.6 : 1)};
  position: relative;
  cursor: default;
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    transform: ${({ $isEditable }) => ($isEditable ? "translateY(-1px)" : "none")};
    box-shadow: ${({ $isEditable, theme }) =>
      $isEditable ? theme.shadowStrong : theme.shadow};
  }

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 999px;
    background: rgba(125, 211, 252, 0.9);
    opacity: ${({ $isDragOver, $dragPosition }) =>
      $isDragOver && $dragPosition === "before" ? 1 : 0};
    left: -10px;
    transition: opacity 0.15s ease;
  }

  &::after {
    content: "";
    position: absolute;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 999px;
    background: rgba(125, 211, 252, 0.9);
    opacity: ${({ $isDragOver, $dragPosition }) =>
      $isDragOver && $dragPosition === "after" ? 1 : 0};
    right: -10px;
    transition: opacity 0.15s ease;
  }
`;

const FlowStepTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
`;

const FlowDragHandle = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: grab;
  font-size: 12px;
  letter-spacing: 2px;
  opacity: 0.5;
  transition: background 0.2s ease, opacity 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    opacity: 1;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.35);
  }
`;

const FlowDragTooltip = styled.span`
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;

  ${FlowDragHandle}:hover &,
  ${FlowDragHandle}:focus-visible & {
    opacity: 1;
  }
`;

const FlowTitleText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  flex: 1;
`;

const FlowTitleInput = styled.input`
  flex: 1;
  background: rgba(15, 23, 42, 0.6);
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 13px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(125, 211, 252, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(125, 211, 252, 0.8);
    box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.2);
  }
`;

const FlowStepMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const FlowConnector = styled.div`
  height: 2px;
  width: 38px;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.15),
    rgba(125, 211, 252, 0.6),
    rgba(255, 255, 255, 0.15)
  );
  border-radius: 999px;
`;

const FlowStatusPill = styled.span<{ $status: AppointmentFlowStepStatus }>`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
  background: ${({ $status }) => {
    switch ($status) {
      case "complete":
        return "rgba(34, 197, 94, 0.25)";
      case "in_progress":
        return "rgba(125, 211, 252, 0.25)";
      case "incomplete":
        return "rgba(248, 113, 113, 0.25)";
      default:
        return "rgba(255, 255, 255, 0.15)";
    }
  }};
  color: ${({ $status, theme }) =>
    $status === "incomplete" ? "#fecaca" : theme.colors.textPrimary};
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const FlowStatusSelect = styled.select`
  background: rgba(15, 23, 42, 0.6);
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 4px 8px;
  font-size: 12px;
`;

const FlowStepActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;


const FlowActionButton = styled.button`
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: rgba(15, 23, 42, 0.6);
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
    transform: none;
  }
`;

const FlowDangerButton = styled(FlowActionButton)`
  border-color: rgba(248, 113, 113, 0.6);
  color: #fecaca;
`;

const FlowAddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

const FlowAddInput = styled(FlowTitleInput)`
  min-width: 220px;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const DetailBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

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

const AppointmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    detail,
    effectiveStatus,
    createStep,
    deleteStep,
    reorderStep,
    updateStep,
    updateStepStatus,
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
      detail.patient.name,
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
                          <FlowStatusPill $status={step.status}>
                            {formatStatusLabel(step.status)}
                          </FlowStatusPill>
                          <FlowStatusSelect
                            value={step.status}
                            onChange={(event) => {
                              const nextStatus =
                                event.target.value as AppointmentFlowStepStatus;
                              if (isEditingFlow) {
                                setDraftSteps((current) =>
                                  current.map((item) =>
                                    item.id === step.id
                                      ? { ...item, status: nextStatus }
                                      : item
                                  )
                                );
                                return;
                              }
                              void updateStepStatus(step.id, nextStatus);
                            }}
                            aria-label={`${step.title} status`}
                            disabled={isSavingFlow}
                          >
                            <option value="not_started">Not started</option>
                            <option value="in_progress">In progress</option>
                            <option value="incomplete">Incomplete</option>
                            <option value="complete">Complete</option>
                          </FlowStatusSelect>
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
                <DetailValue>{detail.patient.name}</DetailValue>
              </DetailBlock>
              <DetailBlock>
                <DetailLabel>{APPOINTMENT_DETAIL_TEXT.physicianLabel}</DetailLabel>
                <DetailValue>{detail.physician.name}</DetailValue>
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

export default AppointmentDetailPage;
