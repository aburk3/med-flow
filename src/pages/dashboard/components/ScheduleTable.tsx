import type { PatientRisk } from "@/types/api";
import { RISK_LABELS } from "@/constants/patientRisk";
import { formatAppointmentDate } from "@/helpers/appointments";
import { handleRowKeyDown } from "@/helpers/keyboard";
import {
  GlassPanel,
  GlassTable,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  SectionTitle,
} from "@/styles/glass";
import { ClickableRow, RiskCell, RiskDot } from "@/pages/dashboard/styles";
import { DASHBOARD_TEXT } from "@/pages/dashboard/constants";

type ScheduleEntry = {
  id: string;
  patientId: string;
  patientName: string;
  stage: string;
  risk: PatientRisk;
  missedAppointments: number;
  date: string;
  location: string;
};

type ScheduleTableProps = {
  schedule: ScheduleEntry[];
  onNavigate: (patientId: string) => void;
};

const ScheduleTable = ({ schedule, onNavigate }: ScheduleTableProps) => {
  return (
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
              onClick={() => onNavigate(appointment.patientId)}
              onKeyDown={(event) =>
                handleRowKeyDown(event, () =>
                  onNavigate(appointment.patientId)
                )
              }
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
  );
};

export type { ScheduleEntry };
export { ScheduleTable };
