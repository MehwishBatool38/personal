import { Navigate, Route, Routes } from "react-router-dom";
import ConfirmModal from "./components/ConfirmModal";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastHost from "./components/ToastHost";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import {
  AmbulancePage,
  BillingPage,
  DoctorsPage,
  LaboratoryPage,
  PatientsPage,
  PharmacyPage,
  PrescriptionsPage,
  RoomsPage
} from "./pages/ResourcePages";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="laboratory" element={<LaboratoryPage />} />
            <Route path="pharmacy" element={<PharmacyPage />} />
            <Route path="ambulance" element={<AmbulancePage />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ConfirmModal />
      <ToastHost />
    </ErrorBoundary>
  );
}
