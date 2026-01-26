const appointmentDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const formatAppointmentDate = (value: string) =>
  appointmentDateFormatter.format(new Date(value));

const sortAppointmentsByDateDesc = <T extends { date: string }>(
  appointments: T[]
): T[] =>
  [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

export { formatAppointmentDate, sortAppointmentsByDateDesc };
