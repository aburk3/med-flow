import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { Appointment } from "@/types/api";
import { formatAppointmentDate } from "@/helpers/appointments";
import {
  GlassPanel,
  GlassTable,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  SectionTitle,
} from "@/styles/glass";
import { PATIENT_DETAIL_TEXT } from "@/pages/patients/patient/constants";

const ClickableRow = styled(GlassTableRow)`
  cursor: pointer;
  transition: background 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

type PatientAppointmentsTableProps = {
  appointments: Appointment[];
};

const PatientAppointmentsTable = ({
  appointments,
}: PatientAppointmentsTableProps) => {
  const navigate = useNavigate();

  return (
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
          {appointments.map((appointment) => (
            <ClickableRow
              key={appointment.id}
              onClick={() => navigate(`/appointments/${appointment.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate(`/appointments/${appointment.id}`);
                }
              }}
            >
              <GlassTableCell>
                {formatAppointmentDate(appointment.date)}
              </GlassTableCell>
              <GlassTableCell>{appointment.type}</GlassTableCell>
              <GlassTableCell>{appointment.location}</GlassTableCell>
              <GlassTableCell>{appointment.status}</GlassTableCell>
            </ClickableRow>
          ))}
        </tbody>
      </GlassTable>
    </GlassPanel>
  );
};

export { PatientAppointmentsTable };
