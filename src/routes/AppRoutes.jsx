import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import SpecialistLayout from '../layouts/SpecialistLayout';
import PatientLayout from '../layouts/PatientLayout';
import HomePage from '../pages/home/HomePage';
import SpecialistsPage from '../pages/specialists/SpecialistsPage';
import SpecialistProfilePage from '../pages/specialist/SpecialistProfilePage';
import SpecialistDashboardPage from '../pages/specialist/SpecialistDashboardPage';
import SpecialistAppointmentsPage from '../pages/specialist/SpecialistAppointmentsPage';
import SpecialistCalendarPage from '../pages/specialist/SpecialistCalendarPage';
import SpecialistServicesPage from '../pages/specialist/SpecialistServicesPage';
import SpecialistAvailabilityPage from '../pages/specialist/SpecialistAvailabilityPage';
import SpecialistProfileEditPage from '../pages/specialist/SpecialistProfileEditPage';
import SpecialistSettingsPage from '../pages/specialist/SpecialistSettingsPage';
import PatientDashboardPage from '../pages/patient/PatientDashboardPage';
import PatientAppointmentsPage from '../pages/patient/PatientAppointmentsPage';
import PatientHistoryPage from '../pages/patient/PatientHistoryPage';
import PatientProfilePage from '../pages/patient/PatientProfilePage';
import PatientSettingsPage from '../pages/patient/PatientSettingsPage';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminSpecialistsPage from '../pages/admin/AdminSpecialistsPage';
import AdminPatientsPage from '../pages/admin/AdminPatientsPage';
import AdminAppointmentsPage from '../pages/admin/AdminAppointmentsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import AboutPage from '../pages/about/AboutPage';
import HowItWorksPage from '../pages/how-it-works/HowItWorksPage';
import FaqPage from '../pages/faq/FaqPage';
import ContactPage from '../pages/contact/ContactPage';
import TermsPage from '../pages/legal/TermsPage';
import PrivacyPage from '../pages/legal/PrivacyPage';
import BookingPage from '../pages/booking/BookingPage';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

// Generic placeholder page for secondary routes during Phase 1 setup
const GenericPlaceholderPage = ({ title, subtitle, badge }) => (
  <section className="flex-1 flex items-center justify-center py-16 sm:py-24">
    <Container size="sm">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-6">
        <SectionHeading
          badge={badge || "Coming Soon"}
          title={title}
          subtitle={subtitle || "This section is currently being prepared for the upcoming phases."}
          align="center"
        />
        <div className="pt-2">
          <Button to="/" variant="outline" size="md">
            Return Home
          </Button>
        </div>
      </div>
    </Container>
  </section>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Pages wrapped in PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/specialists" element={<SpecialistsPage />} />
        <Route path="/specialists/:id" element={<SpecialistProfilePage />} />
        <Route path="/specialist/:id" element={<SpecialistProfilePage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/for-specialists" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* 2. Authentication Pages wrapped in AuthLayout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* 3. Specialist Dashboard Hub wrapped in SpecialistLayout */}
      <Route path="/specialist" element={<SpecialistLayout />}>
        <Route index element={<Navigate to="/specialist/dashboard" replace />} />
        <Route path="dashboard" element={<SpecialistDashboardPage />} />
        <Route path="appointments" element={<SpecialistAppointmentsPage />} />
        <Route path="calendar" element={<SpecialistCalendarPage />} />
        <Route path="services" element={<SpecialistServicesPage />} />
        <Route path="availability" element={<SpecialistAvailabilityPage />} />
        <Route path="profile" element={<SpecialistProfileEditPage />} />
        <Route path="settings" element={<SpecialistSettingsPage />} />
      </Route>

      {/* 4. Patient Portal Hub wrapped in PatientLayout */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboardPage />} />
        <Route path="appointments" element={<PatientAppointmentsPage />} />
        <Route path="history" element={<PatientHistoryPage />} />
        <Route path="profile" element={<PatientProfilePage />} />
        <Route path="settings" element={<PatientSettingsPage />} />
      </Route>

      {/* 5. Admin Control Center wrapped in AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="specialists" element={<AdminSpecialistsPage />} />
        <Route path="patients" element={<AdminPatientsPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 6. 404 Catch-All */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <GenericPlaceholderPage
              badge="404 Error"
              title="Page Not Found"
              subtitle="The page you are looking for does not exist or has been moved."
            />
          </PublicLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
