import styled from "styled-components";
import type { AppointmentFlowStepStatus } from "@/types/api";

type FlowDragPosition = "before" | "after" | null;

type FlowStepCardProps = {
  $isDragging?: boolean;
  $isDragOver?: boolean;
  $dragPosition?: FlowDragPosition;
  $isEditable?: boolean;
};

const FlowTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  overflow-x: auto;
  overflow-y: visible;
  padding: 16px 0 4px;

  ${({ theme }) => theme.media.phone} {
    gap: 12px;
    padding: 12px 0 2px;
  }
`;

const FlowHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;

  ${({ theme }) => theme.media.phone} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FlowHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  ${({ theme }) => theme.media.phone} {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

const FlowStepCard = styled.div<FlowStepCardProps>`
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
    transform: ${({ $isEditable }) =>
      $isEditable ? "translateY(-1px)" : "none"};
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

  ${({ theme }) => theme.media.phone} {
    min-width: 170px;
    padding: 14px;
  }
`;

const FlowStepTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;

  ${({ theme }) => theme.media.phone} {
    flex-direction: column;
    align-items: flex-start;
  }
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

  ${({ theme }) => theme.media.phone} {
    font-size: 13px;
  }
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

  ${({ theme }) => theme.media.phone} {
    width: 100%;
  }
`;

const FlowStepMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  ${({ theme }) => theme.media.phone} {
    flex-direction: column;
    align-items: flex-start;
  }
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

  ${({ theme }) => theme.media.phone} {
    width: 100%;
  }
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

  ${({ theme }) => theme.media.phone} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FlowAddInput = styled(FlowTitleInput)`
  min-width: 220px;

  ${({ theme }) => theme.media.phone} {
    min-width: 0;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;

  ${({ theme }) => theme.media.phone} {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
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

export {
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
};
