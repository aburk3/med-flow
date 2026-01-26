import { DetailCard } from "@/components/DetailCard/DetailCard";
import { Sidebar } from "@/components/Layout/styles";
import { SidebarNav } from "@/components/Layout/SidebarNav";
import { PATIENTS_TEXT } from "@/pages/patients/constants";

const PatientsSidebar = () => {
  return (
    <Sidebar>
      <DetailCard
        badge={PATIENTS_TEXT.detailBadge}
        title={PATIENTS_TEXT.detailTitle}
        lines={[PATIENTS_TEXT.detailLine]}
      />
      <SidebarNav />
    </Sidebar>
  );
};

export { PatientsSidebar };
