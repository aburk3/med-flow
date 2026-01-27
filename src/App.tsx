import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styles/global";
import { theme } from "@/styles/theme";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import PatientsPage from "@/pages/patients/PatientsPage";
import PatientDetailPage from "@/pages/patients/patient/PatientDetailPage";
import AppointmentDetailPage from "@/pages/appointments/appointment/AppointmentDetailPage";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
