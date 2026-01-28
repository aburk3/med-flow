import type { Patient, Physician } from "@/types/api";
import { handleRowKeyDown } from "@/helpers/keyboard";
import { formatPatientName, formatPhysicianName } from "@/helpers/names";
import {
  GlassPanel,
  GlassTable,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  SectionTitle,
} from "@/styles/glass";
import { ClickableRow } from "@/pages/Patients/styles";
import { PATIENTS_TEXT } from "@/pages/Patients/constants";

type PatientsTableProps = {
  patients: Patient[];
  primaryPhysician?: Physician;
  onNavigate: (patientId: string) => void;
};

const PatientsTable = ({
  onNavigate,
  patients,
  primaryPhysician,
}: PatientsTableProps) => {
  return (
    <GlassPanel>
      <SectionTitle>{PATIENTS_TEXT.detailTitle}</SectionTitle>
      <GlassTable>
        <thead>
          <GlassTableRow>
            <GlassTableHeader>
              {PATIENTS_TEXT.tableHeaders.patient}
            </GlassTableHeader>
            <GlassTableHeader>
              {PATIENTS_TEXT.tableHeaders.stage}
            </GlassTableHeader>
            <GlassTableHeader>
              {PATIENTS_TEXT.tableHeaders.primaryPhysician}
            </GlassTableHeader>
          </GlassTableRow>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <ClickableRow
              key={patient.id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate(patient.id)}
              onKeyDown={(event) =>
                handleRowKeyDown(event, () => onNavigate(patient.id))
              }
            >
              <GlassTableCell>{formatPatientName(patient)}</GlassTableCell>
              <GlassTableCell>{patient.stage}</GlassTableCell>
              <GlassTableCell>
                {primaryPhysician
                  ? formatPhysicianName(primaryPhysician)
                  : PATIENTS_TEXT.assignedPhysicianFallback}
              </GlassTableCell>
            </ClickableRow>
          ))}
        </tbody>
      </GlassTable>
    </GlassPanel>
  );
};

export { PatientsTable };
