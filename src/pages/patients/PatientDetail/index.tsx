import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SubtleText } from "@/styles/glass";
import { Header, Main, Page, Title } from "@/components/Layout/styles";
import { PageSidebar } from "@/components/PageSidebar";
import { DEFAULT_PATIENT_RISK, RISK_LABELS } from "@/constants/patientRisk";
import { sortAppointmentsByDateDesc } from "@/helpers/appointments";
import { formatPatientName, formatPhysicianName } from "@/helpers/names";
import { usePatientDetail } from "@/hooks/usePatientDetail";
import { PatientDetailStatus } from "@/pages/Patients/PatientDetail/type";
import { PATIENT_DETAIL_TEXT } from "@/pages/Patients/PatientDetail/constants";
import { PatientRiskSummary } from "@/pages/Patients/PatientDetail/PatientRiskSummary";
import { PatientAppointmentsTable } from "@/pages/Patients/PatientDetail/PatientAppointmentsTable";

const formatIntakeStatus = (status: string) =>
  status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { appointments, effectiveStatus, patient, physician } = usePatientDetail(id);

  const detailLines = useMemo(() => {
    if (effectiveStatus === PatientDetailStatus.NotFound) {
      return [PATIENT_DETAIL_TEXT.notFound];
    }

    if (!patient) {
      return [PATIENT_DETAIL_TEXT.loadingDetails];
    }

    return [
      `${PATIENT_DETAIL_TEXT.dobLabel} ${formatDate(patient.dateOfBirth)}`,
      `${PATIENT_DETAIL_TEXT.phoneLabel} ${patient.phoneNumber}`,
      `${PATIENT_DETAIL_TEXT.emergencyContactLabel} ${patient.emergencyContact}`,
      `${PATIENT_DETAIL_TEXT.intakeLabel} ${formatIntakeStatus(
        patient.intakeStatus
      )}`,
      `${PATIENT_DETAIL_TEXT.stageLabel} ${patient.stage}`,
      physician
        ? formatPhysicianName(physician)
        : PATIENT_DETAIL_TEXT.assignedPhysicianFallback,
    ];
  }, [effectiveStatus, patient, physician]);

  const subtitle =
    effectiveStatus === PatientDetailStatus.NotFound
      ? PATIENT_DETAIL_TEXT.notFound
      : effectiveStatus === PatientDetailStatus.Error
        ? PATIENT_DETAIL_TEXT.errorDetails
        : PATIENT_DETAIL_TEXT.subtitle;

  const riskSummary = useMemo(() => {
    if (effectiveStatus === PatientDetailStatus.NotFound) {
      return {
        tone: DEFAULT_PATIENT_RISK,
        label: PATIENT_DETAIL_TEXT.riskUnavailable,
        reason: PATIENT_DETAIL_TEXT.riskUnavailable,
      };
    }

    if (effectiveStatus === PatientDetailStatus.Error) {
      return {
        tone: DEFAULT_PATIENT_RISK,
        label: PATIENT_DETAIL_TEXT.riskUnavailable,
        reason: PATIENT_DETAIL_TEXT.errorDetails,
      };
    }

    if (!patient) {
      return {
        tone: DEFAULT_PATIENT_RISK,
        label: PATIENT_DETAIL_TEXT.riskLoading,
        reason: PATIENT_DETAIL_TEXT.riskLoading,
      };
    }

    return {
      tone: patient.risk,
      label: RISK_LABELS[patient.risk],
      reason: patient.riskReason || PATIENT_DETAIL_TEXT.riskReasonFallback,
    };
  }, [effectiveStatus, patient]);

  const sortedAppointments = useMemo(
    () => sortAppointmentsByDateDesc(appointments),
    [appointments]
  );

  return (
    <Page>
      <PageSidebar
        badge={PATIENT_DETAIL_TEXT.detailBadge}
        title={
          patient ? formatPatientName(patient) : PATIENT_DETAIL_TEXT.detailTitleFallback
        }
        lines={detailLines}
      />

      <Main>
        <Header>
          <div>
            <Title>{PATIENT_DETAIL_TEXT.title}</Title>
            <SubtleText>{subtitle}</SubtleText>
          </div>
        </Header>

        <PatientRiskSummary
          label={riskSummary.label}
          reason={riskSummary.reason}
          tone={riskSummary.tone}
        />

        <PatientAppointmentsTable appointments={sortedAppointments} />
      </Main>
    </Page>
  );
};

export default PatientDetail;
