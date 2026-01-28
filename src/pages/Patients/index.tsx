import { Badge, SubtleText } from "@/styles/glass";
import { useNavigate } from "react-router-dom";
import { Header, Main, Page, Title } from "@/components/Layout/styles";
import { PageSidebar } from "@/components/PageSidebar";
import { usePatientsData } from "@/hooks/usePatientsData";
import { PATIENTS_TEXT } from "./constants";
import { PatientsTable } from "./PatientsTable";

const Patients = () => {
  const navigate = useNavigate();
  const { error, patients, physicians } = usePatientsData();
  const primaryPhysician = physicians[0];

  return (
    <Page>
      <PageSidebar
        badge={PATIENTS_TEXT.detailBadge}
        title={PATIENTS_TEXT.detailTitle}
        lines={[PATIENTS_TEXT.detailLine]}
      />

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

export default Patients;
