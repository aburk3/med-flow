import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchAppointments,
  fetchPatients,
  fetchPhysicians,
  updatePatientIntakeStatus,
} from "@/lib/api";
import type { Appointment, Patient, PatientIntakeStatus, Physician } from "@/types/api";
import { PatientDetailStatus } from "@/pages/Patients/PatientDetail/type";

const usePatientDetail = (id: string | undefined) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [physician, setPhysician] = useState<Physician | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<PatientDetailStatus>(
    PatientDetailStatus.Loading
  );
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  const handleUpdateIntakeStatus = useCallback(
    async (intakeStatus: PatientIntakeStatus) => {
      if (!id) {
        return null;
      }

      const updatedPatient = await updatePatientIntakeStatus(id, intakeStatus);

      if (isMountedRef.current) {
        setPatient(updatedPatient);
      }

      return updatedPatient;
    },
    [id]
  );

  const effectiveStatus = id ? status : PatientDetailStatus.NotFound;

  return {
    appointments,
    effectiveStatus,
    patient,
    physician,
    updateIntakeStatus: handleUpdateIntakeStatus,
  };
};

export { usePatientDetail };
