import { useEffect, useState } from "react";
import { fetchPatients, fetchPhysicians } from "@/lib/api";
import { PATIENTS_TEXT } from "@/pages/Patients/constants";
import type { Patient, Physician } from "@/types/api";

const usePatientsData = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [physicians, setPhysicians] = useState<Physician[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchPatients(), fetchPhysicians()])
      .then(([patientsResponse, physiciansResponse]) => {
        if (isMounted) {
          setPatients(patientsResponse);
          setPhysicians(physiciansResponse);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(PATIENTS_TEXT.error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { error, patients, physicians };
};

export { usePatientsData };
