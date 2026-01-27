import { useEffect, useState } from "react";
import { fetchAppointments, fetchPatients, fetchPhysicians } from "@/lib/api";
import type { Appointment, Patient, Physician } from "@/types/api";
import { PatientDetailStatus } from "@/pages/patients/patient/type";

const usePatientDetail = (id: string | undefined) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [physician, setPhysician] = useState<Physician | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<PatientDetailStatus>(
    PatientDetailStatus.Loading
  );

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
      .then(async ([patients, physicians, appointmentsResponse]) => {
        if (!isMounted) {
          return;
        }
        const matchingPatient =
          patients.find((item) => item.id === id) ?? null;

        if (!matchingPatient) {
          setStatus(PatientDetailStatus.NotFound);
          return;
        }

        const patientAppointments = appointmentsResponse.filter(
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

  const effectiveStatus = id ? status : PatientDetailStatus.NotFound;

  return {
    appointments,
    effectiveStatus,
    patient,
    physician,
  };
};

export { usePatientDetail };
