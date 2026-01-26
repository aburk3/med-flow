import { NAV_LABELS } from "@/constants/navigation";
import { Nav, NavItem } from "./styles";

const SidebarNav = () => {
  return (
    <Nav>
      <NavItem to="/">{NAV_LABELS.dashboard}</NavItem>
      <NavItem to="/patients">{NAV_LABELS.patients}</NavItem>
    </Nav>
  );
};

export { SidebarNav };
