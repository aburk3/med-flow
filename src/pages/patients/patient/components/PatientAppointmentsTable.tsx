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

type PatientAppointmentsTableProps = {
  appointments: Appointment[];
};

const PatientAppointmentsTable = ({
  appointments,
}: PatientAppointmentsTableProps) => {
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
  );
};

export { PatientAppointmentsTable };
