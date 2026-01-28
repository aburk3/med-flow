import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  }

  ${({ theme }) => theme.media.phone} {
    flex-direction: column;
  }
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

  ${({ theme }) => theme.media.tablet} {
    padding: 10px 14px;
    font-size: 14px;
  }

  ${({ theme }) => theme.media.phone} {
    width: 100%;
  }
`;

export { Nav, NavItem };
