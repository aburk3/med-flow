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

export { Header, Main, Page, Sidebar, Title };
