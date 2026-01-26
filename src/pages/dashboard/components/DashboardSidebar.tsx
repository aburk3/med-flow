import type { DashboardPayload } from "@/types/api";
import { DetailCard } from "@/components/DetailCard/DetailCard";
import { Sidebar } from "@/components/Layout/styles";
import { SidebarNav } from "@/components/Layout/SidebarNav";
import { DASHBOARD_TEXT } from "@/pages/dashboard/constants";

type DashboardSidebarProps = {
  physician: DashboardPayload["physician"] | null;
};

const DashboardSidebar = ({ physician }: DashboardSidebarProps) => {
  const title = physician?.name ?? DASHBOARD_TEXT.detailLoadingTitle;
  const lines = physician
    ? [physician.specialty, physician.location]
    : [DASHBOARD_TEXT.detailLoadingLine];

  return (
    <Sidebar>
      <DetailCard
        badge={DASHBOARD_TEXT.detailBadge}
        title={title}
        lines={lines}
      />
      <SidebarNav />
    </Sidebar>
  );
};

export { DashboardSidebar };
