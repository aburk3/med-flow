import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SubtleText } from "@/styles/glass";
import { Header, Main, Page, Title } from "@/components/Layout/styles";
import { DEFAULT_PATIENT_RISK, RISK_LABELS } from "@/constants/patientRisk";
import { sortAppointmentsByDateDesc } from "@/helpers/appointments";
import { usePatientDetail } from "@/hooks/usePatientDetail";
import { PatientDetailStatus } from "@/pages/patients/patient/type";
import { PATIENT_DETAIL_TEXT } from "@/pages/patients/patient/constants";
import { PatientSidebar } from "@/pages/patients/patient/components/PatientSidebar";
import { PatientRiskSummary } from "@/pages/patients/patient/components/PatientRiskSummary";
import { PatientAppointmentsTable } from "@/pages/patients/patient/components/PatientAppointmentsTable";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { appointments, effectiveStatus, patient, physician } =
    usePatientDetail(id);

  const detailLines = useMemo(() => {
    if (effectiveStatus === PatientDetailStatus.NotFound) {
      return [PATIENT_DETAIL_TEXT.notFound];
    }

    if (!patient) {
      return [PATIENT_DETAIL_TEXT.loadingDetails];
    }

    return [
      `${PATIENT_DETAIL_TEXT.stageLabel} ${patient.stage}`,
      physician?.name ?? PATIENT_DETAIL_TEXT.assignedPhysicianFallback,
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
      <PatientSidebar
        title={patient?.name ?? PATIENT_DETAIL_TEXT.detailTitleFallback}
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

export default PatientDetailPage;
