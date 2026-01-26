import { useEffect, useState } from "react";
import {
  Badge,
  GlassPanel,
  GlassTable,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  SectionTitle,
  SubtleText,
} from "@/components/Glass";
import { DetailCard } from "@/components/DetailCard";
import { NAV_LABELS } from "@/constants/navigation";
import { fetchPatients, fetchPhysicians } from "@/lib/api";
import { PATIENTS_TEXT } from "@/pages/patients/constants";
import type { Patient, Physician } from "@/types/api";
import {
  ClickableRow,
  Header,
  Main,
  Nav,
  NavItem,
  Page,
  Sidebar,
  Title,
} from "@/pages/patients/styles";
import { useNavigate } from "react-router-dom";

const PatientsPage = () => {
  const navigate = useNavigate();
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

  const primaryPhysician = physicians[0];

  return (
    <Page>
      <Sidebar>
        <DetailCard
          badge={PATIENTS_TEXT.detailBadge}
          title={PATIENTS_TEXT.detailTitle}
          lines={[PATIENTS_TEXT.detailLine]}
        />
        <Nav>
          <NavItem to="/">{NAV_LABELS.dashboard}</NavItem>
          <NavItem to="/patients">{NAV_LABELS.patients}</NavItem>
        </Nav>
      </Sidebar>

      <Main>
        <Header>
          <div>
            <Title>{PATIENTS_TEXT.title}</Title>
            <SubtleText>
              {error ?? PATIENTS_TEXT.subtitle}
            </SubtleText>
          </div>
          <Badge>
            {patients.length} {PATIENTS_TEXT.activeBadgeSuffix}
          </Badge>
        </Header>

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
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/patients/${patient.id}`);
                    }
                  }}
                >
                  <GlassTableCell>{patient.name}</GlassTableCell>
                  <GlassTableCell>{patient.stage}</GlassTableCell>
                  <GlassTableCell>
                    {primaryPhysician?.name ??
                      PATIENTS_TEXT.assignedPhysicianFallback}
                  </GlassTableCell>
                </ClickableRow>
              ))}
            </tbody>
          </GlassTable>
        </GlassPanel>
      </Main>
    </Page>
  );
};

export default PatientsPage;
