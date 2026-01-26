import type { DashboardPayload } from "../../types.js";
import { appointments } from "./appointments.js";
import { noShowCountByPatient, patients } from "./patients.js";
import { physician } from "./physician.js";

export const mockData = Object.freeze({
  physician,
  patients,
  appointments,
  noShowCountsByPatient: noShowCountByPatient,
});

const filterAppointmentsFrom = (
  fromDate: Date,
  items: typeof appointments
) =>
  items.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate.getTime() >= fromDate.getTime();
  });

type DashboardOptions = {
  fromDate?: Date;
};

export const getDashboardData = (
  options: DashboardOptions = {}
): DashboardPayload => {
  const filteredAppointments = options.fromDate
    ? filterAppointmentsFrom(options.fromDate, appointments)
    : appointments;

  return {
    physician,
    patients,
    appointments: filteredAppointments,
    noShowCountsByPatient: noShowCountByPatient,
    appointmentsTotal: appointments.length,
  };
};
