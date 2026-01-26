import { Badge, SubtleText } from "@/styles/glass";
import { useNavigate } from "react-router-dom";
import { Header, Main, Page, Title } from "@/components/Layout/styles";
import { usePatientsData } from "@/hooks/usePatientsData";
import { PATIENTS_TEXT } from "@/pages/patients/constants";
import { PatientsSidebar } from "@/pages/patients/components/PatientsSidebar";
import { PatientsTable } from "@/pages/patients/components/PatientsTable";

const PatientsPage = () => {
  const navigate = useNavigate();
  const { error, patients, physicians } = usePatientsData();
  const primaryPhysician = physicians[0];

  return (
    <Page>
      <PatientsSidebar />

      <Main>
        <Header>
          <div>
            <Title>{PATIENTS_TEXT.title}</Title>
            <SubtleText>{error ?? PATIENTS_TEXT.subtitle}</SubtleText>
          </div>
          <Badge>
            {patients.length} {PATIENTS_TEXT.activeBadgeSuffix}
          </Badge>
        </Header>

        <PatientsTable
          patients={patients}
          primaryPhysician={primaryPhysician}
          onNavigate={(patientId) => navigate(`/patients/${patientId}`)}
        />
      </Main>
    </Page>
  );
};

export default PatientsPage;
