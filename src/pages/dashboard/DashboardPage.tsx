import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, SubtleText } from "@/styles/glass";
import { DEFAULT_PATIENT_RISK } from "@/constants/patientRisk";
import { useDashboardData } from "@/hooks/useDashboardData";
import { sortAppointmentsByDateDesc } from "@/helpers/appointments";
import { Header, Main, Page, Title } from "@/components/Layout/styles";
import { DASHBOARD_TEXT, DEFAULT_PATIENT_STAGE } from "./constants";
import { DashboardCards } from "./components/DashboardCards";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { ScheduleEntry, ScheduleTable } from "./components/ScheduleTable";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { dashboard, error } = useDashboardData();

  const schedule = useMemo<ScheduleEntry[]>(() => {
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
  const appointmentsTotal =
    dashboard?.appointmentsTotal ?? appointments.length;

  return (
    <Page>
      <DashboardSidebar physician={physician} />

      <Main>
        <Header>
          <div>
            <Title>{DASHBOARD_TEXT.title}</Title>
            <SubtleText>{error ?? DASHBOARD_TEXT.subtitle}</SubtleText>
          </div>
          <Badge>{DASHBOARD_TEXT.liveScheduleBadge}</Badge>
        </Header>

        <DashboardCards
          patientsCount={patients.length}
          appointmentsTotal={appointmentsTotal}
        />

        <ScheduleTable
          schedule={schedule}
          onNavigate={(patientId) => navigate(`/patients/${patientId}`)}
        />
      </Main>
    </Page>
  );
};

export default DashboardPage;
