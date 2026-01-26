import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styles/global";
import { theme } from "@/styles/theme";

type RenderOptions = {
  route?: string;
  path?: string;
};

export const renderWithProviders = (
  ui: ReactElement,
  { route = "/", path = "/" }: RenderOptions = {}
) =>
  render(
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
