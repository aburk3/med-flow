import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  GlassCard,
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
import { fetchDashboard } from "@/lib/api";
import {
  formatAppointmentDate,
  sortAppointmentsByDateDesc,
} from "@/helpers/appointments";
import type { DashboardPayload } from "@/types/api";
import {
  ClickableRow,
  CardRow,
  CardTitle,
  CardValue,
  Header,
  Main,
  Nav,
  NavItem,
  Page,
  RiskCell,
  RiskDot,
  Sidebar,
  Title,
} from "@/pages/dashboard/styles";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_TEXT, DEFAULT_PATIENT_STAGE } from "./constants";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchDashboard({ fromDate: new Date() })
      .then((payload) => {
        if (isMounted) {
          setDashboard(payload);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(DASHBOARD_TEXT.error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const schedule = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    const { patients, appointments, noShowCountsByPatient } = dashboard;

    return sortAppointmentsByDateDesc(
      appointments.map((appointment) => {
        const patient = patients.find(
          (item) => item.id === appointment.patientId
        );
        const missedAppointments =
          noShowCountsByPatient[appointment.patientId] ?? 0;
        return {
          ...appointment,
          patientName: patient?.name ?? DASHBOARD_TEXT.unknownPatient,
          stage: patient?.stage ?? DEFAULT_PATIENT_STAGE,
          risk: patient?.risk ?? DEFAULT_PATIENT_RISK,
          missedAppointments,
        };
      })
    );
  }, [dashboard]);

  const physician = dashboard?.physician ?? null;
  const patients = dashboard?.patients ?? [];
  const appointments = dashboard?.appointments ?? [];
  const appointmentsTotal = dashboard?.appointmentsTotal ?? appointments.length;

  return (
    <Page>
      <Sidebar>
        <DetailCard
          badge={DASHBOARD_TEXT.detailBadge}
          title={physician?.name ?? DASHBOARD_TEXT.detailLoadingTitle}
          lines={
            physician
              ? [physician.specialty, physician.location]
              : [DASHBOARD_TEXT.detailLoadingLine]
          }
        />
        <Nav>
          <NavItem to="/">{NAV_LABELS.dashboard}</NavItem>
          <NavItem to="/patients">{NAV_LABELS.patients}</NavItem>
        </Nav>
      </Sidebar>

      <Main>
        <Header>
          <div>
            <Title>{DASHBOARD_TEXT.title}</Title>
            <SubtleText>{error ?? DASHBOARD_TEXT.subtitle}</SubtleText>
          </div>
          <Badge>{DASHBOARD_TEXT.liveScheduleBadge}</Badge>
        </Header>

        <CardRow>
          <GlassCard>
            <CardTitle>{DASHBOARD_TEXT.patientsCardTitle}</CardTitle>
            <CardValue>{patients.length}</CardValue>
            <SubtleText>{DASHBOARD_TEXT.patientsCardSubtitle}</SubtleText>
          </GlassCard>
          <GlassCard>
            <CardTitle>{DASHBOARD_TEXT.appointmentsCardTitle}</CardTitle>
            <CardValue>{appointmentsTotal}</CardValue>
            <SubtleText>{DASHBOARD_TEXT.appointmentsCardSubtitle}</SubtleText>
          </GlassCard>
        </CardRow>

        <GlassPanel>
          <SectionTitle>{DASHBOARD_TEXT.scheduleTitle}</SectionTitle>
          <GlassTable>
            <thead>
              <GlassTableRow>
                <GlassTableHeader>
                  {DASHBOARD_TEXT.scheduleHeaders.risk}
                </GlassTableHeader>
                <GlassTableHeader>
                  {DASHBOARD_TEXT.scheduleHeaders.patient}
                </GlassTableHeader>
                <GlassTableHeader>
                  {DASHBOARD_TEXT.scheduleHeaders.stage}
                </GlassTableHeader>
                <GlassTableHeader>
                  {DASHBOARD_TEXT.scheduleHeaders.appointment}
                </GlassTableHeader>
                <GlassTableHeader>
                  {DASHBOARD_TEXT.scheduleHeaders.location}
                </GlassTableHeader>
              </GlassTableRow>
            </thead>
            <tbody>
              {schedule.map((appointment) => (
                <ClickableRow
                  key={appointment.id}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate(`/patients/${appointment.patientId}`)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/patients/${appointment.patientId}`);
                    }
                  }}
                >
                  <GlassTableCell>
                    <RiskCell>
                      <RiskDot
                        $tone={appointment.risk}
                        title={`${RISK_LABELS[appointment.risk]} - ${appointment.missedAppointments} ${DASHBOARD_TEXT.missedAppointmentsLabel}`}
                        aria-label={`${RISK_LABELS[appointment.risk]} - ${appointment.missedAppointments} ${DASHBOARD_TEXT.missedAppointmentsLabel}`}
                        role="img"
                      />
                    </RiskCell>
                  </GlassTableCell>
                  <GlassTableCell>{appointment.patientName}</GlassTableCell>
                  <GlassTableCell>{appointment.stage}</GlassTableCell>
                  <GlassTableCell>
                    {formatAppointmentDate(appointment.date)}
                  </GlassTableCell>
                  <GlassTableCell>{appointment.location}</GlassTableCell>
                </ClickableRow>
              ))}
            </tbody>
          </GlassTable>
        </GlassPanel>
      </Main>
    </Page>
  );
};

export default Dashboard;
