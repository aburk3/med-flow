import { DetailCard } from "@/components/DetailCard";
import { DetailBadge } from "@/components/DetailCard/type";
import { Sidebar } from "@/components/Layout/styles";
import { SidebarNav } from "@/components/Layout/SidebarNav";

type PageSidebarProps = {
  badge: DetailBadge;
  title: string;
  lines: string[];
};

const PageSidebar = ({ badge, title, lines }: PageSidebarProps) => {
  return (
    <Sidebar>
      <DetailCard badge={badge} title={title} lines={lines} />
      <SidebarNav />
    </Sidebar>
  );
};

export { PageSidebar };
