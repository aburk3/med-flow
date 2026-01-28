import styled from "styled-components";

const Page = styled.main`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  padding: 32px;
  min-height: 100vh;

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  ${({ theme }) => theme.media.phone} {
    gap: 16px;
    padding: 20px;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  ${({ theme }) => theme.media.phone} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Main = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${({ theme }) => theme.media.phone} {
    gap: 20px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  ${({ theme }) => theme.media.phone} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;

  ${({ theme }) => theme.media.tablet} {
    font-size: 28px;
  }

  ${({ theme }) => theme.media.phone} {
    font-size: 24px;
  }
`;

export { Header, Main, Page, Sidebar, Title };
