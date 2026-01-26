import { Link } from "react-router-dom";
import styled from "styled-components";
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

const RiskSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RiskIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const RiskTone = styled.span<{ $tone: PatientRisk }>`
  width: 12px;
  height: 12px;
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
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.28);
`;

const RiskLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export {
  Header,
  Main,
  Nav,
  NavItem,
  Page,
  RiskIndicator,
  RiskLabel,
  RiskSummary,
  RiskTone,
  Sidebar,
  Title,
};
