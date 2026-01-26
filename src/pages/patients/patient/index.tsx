import { useEffect, useMemo, useState } from "react";
import {
  GlassPanel,
  GlassTable,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  SectionTitle,
  SubtleText,
} from "@/components/Glass";
import { DetailCard } from "@/components/DetailCard";
import { NAV_LABELS } from "@/constants/navigation";
import {
  DEFAULT_PATIENT_RISK,
  RISK_LABELS,
} from "@/constants/patientRisk";
import {
  formatAppointmentDate,
  sortAppointmentsByDateDesc,
} from "@/helpers/appointments";
import {
  fetchAppointments,
  fetchPatients,
  fetchPhysicians,
} from "@/lib/api";
import type { Appointment, Patient, Physician } from "@/types/api";
import {
  Header,
  Main,
  Nav,
  NavItem,
  Page,
  RiskIndicator,
  RiskLabel,
  RiskSummary,
  RiskTone,
  Sidebar,
  Title,
} from "@/pages/patients/patient/styles";
import { useParams } from "react-router-dom";
import { PatientDetailStatus } from "./type";
import { PATIENT_DETAIL_TEXT } from "./constants";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [physician, setPhysician] = useState<Physician | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<PatientDetailStatus>(
    PatientDetailStatus.Loading
  );
  const effectiveStatus = id ? status : PatientDetailStatus.NotFound;

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      return () => {
        isMounted = false;
      };
    }

    setStatus(PatientDetailStatus.Loading);
    setPatient(null);
    setPhysician(null);
    setAppointments([]);

    Promise.all([fetchPatients(), fetchPhysicians(), fetchAppointments()])
      .then(([patients, physicians, appointments]) => {
        if (!isMounted) {
          return;
        }
        const matchingPatient =
          patients.find((item) => item.id === id) ?? null;

        if (!matchingPatient) {
          setStatus(PatientDetailStatus.NotFound);
          return;
        }

        const patientAppointments = appointments.filter(
          (appointment) => appointment.patientId === id
        );
        const assignedPhysician =
          physicians.find(
            (item) => item.id === matchingPatient.primaryPhysicianId
          ) ?? null;

        setPatient(matchingPatient);
        setPhysician(assignedPhysician);
        setAppointments(patientAppointments);
        setStatus(PatientDetailStatus.Ready);
      })
      .catch(() => {
        if (isMounted) {
          setStatus(PatientDetailStatus.Error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

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
      <Sidebar>
        <DetailCard
          badge={PATIENT_DETAIL_TEXT.detailBadge}
          title={patient?.name ?? PATIENT_DETAIL_TEXT.detailTitleFallback}
          lines={detailLines}
        />
        <Nav>
          <NavItem to="/">{NAV_LABELS.dashboard}</NavItem>
          <NavItem to="/patients">{NAV_LABELS.patients}</NavItem>
        </Nav>
      </Sidebar>

      <Main>
        <Header>
          <div>
            <Title>{PATIENT_DETAIL_TEXT.title}</Title>
            <SubtleText>{subtitle}</SubtleText>
          </div>
        </Header>

        <GlassPanel>
          <SectionTitle>{PATIENT_DETAIL_TEXT.riskSectionTitle}</SectionTitle>
          <RiskSummary>
            <RiskIndicator>
              <RiskTone $tone={riskSummary.tone} />
              <RiskLabel>{riskSummary.label}</RiskLabel>
            </RiskIndicator>
            <SubtleText>{riskSummary.reason}</SubtleText>
          </RiskSummary>
        </GlassPanel>

        <GlassPanel>
          <SectionTitle>{PATIENT_DETAIL_TEXT.appointmentsTitle}</SectionTitle>
          <GlassTable>
            <thead>
              <GlassTableRow>
                <GlassTableHeader>
                  {PATIENT_DETAIL_TEXT.appointmentHeader}
                </GlassTableHeader>
                <GlassTableHeader>
                  {PATIENT_DETAIL_TEXT.typeHeader}
                </GlassTableHeader>
                <GlassTableHeader>
                  {PATIENT_DETAIL_TEXT.locationHeader}
                </GlassTableHeader>
                <GlassTableHeader>
                  {PATIENT_DETAIL_TEXT.statusHeader}
                </GlassTableHeader>
              </GlassTableRow>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment) => (
                <GlassTableRow key={appointment.id}>
                  <GlassTableCell>
                    {formatAppointmentDate(appointment.date)}
                  </GlassTableCell>
                  <GlassTableCell>{appointment.type}</GlassTableCell>
                  <GlassTableCell>{appointment.location}</GlassTableCell>
                  <GlassTableCell>{appointment.status}</GlassTableCell>
                </GlassTableRow>
              ))}
            </tbody>
          </GlassTable>
        </GlassPanel>
      </Main>
    </Page>
  );
};

export default PatientDetailPage;
