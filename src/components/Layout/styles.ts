import { Link } from "react-router-dom";
import styled from "styled-components";

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

export { Header, Main, Nav, NavItem, Page, Sidebar, Title };
