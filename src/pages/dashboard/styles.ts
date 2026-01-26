import { Link } from "react-router-dom";
import styled from "styled-components";
import { GlassTableRow } from "@/components/Glass";
import type { PatientRisk } from "@/types/api";

const Page = styled.main`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  padding: 32px;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NavItem = styled(Link)`
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`;

const Main = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
`;

const CardRow = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const CardValue = styled.div`
  margin: 8px 0;
  font-size: 32px;
  font-weight: 600;
`;

const ClickableRow = styled(GlassTableRow)`
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const RiskCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const RiskDot = styled.span<{ $tone: PatientRisk }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $tone }) => {
    if ($tone === "high") {
      return "#ef4444";
    }
    if ($tone === "medium") {
      return "#f59e0b";
    }
    return "#22c55e";
  }};
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
`;

export {
  CardRow,
  CardTitle,
  CardValue,
  ClickableRow,
  Header,
  Main,
  Nav,
  NavItem,
  Page,
  RiskCell,
  RiskDot,
  Sidebar,
  Title,
};
