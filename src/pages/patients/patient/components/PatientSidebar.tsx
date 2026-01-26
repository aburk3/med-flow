import { DetailCard } from "@/components/DetailCard/DetailCard";
import { Sidebar } from "@/components/Layout/styles";
import { SidebarNav } from "@/components/Layout/SidebarNav";
import { PATIENT_DETAIL_TEXT } from "@/pages/patients/patient/constants";

type PatientSidebarProps = {
  lines: string[];
  title: string;
};

const PatientSidebar = ({ lines, title }: PatientSidebarProps) => {
  return (
    <Sidebar>
      <DetailCard
        badge={PATIENT_DETAIL_TEXT.detailBadge}
        title={title}
        lines={lines}
      />
      <SidebarNav />
    </Sidebar>
  );
};

export { PatientSidebar };
