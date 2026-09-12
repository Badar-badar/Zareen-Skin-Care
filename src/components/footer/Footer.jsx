import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Heart,
  LayoutDashboard,
  ShieldCheck,
  User,
  Calendar,
  Settings,
  ArrowRight,
  Stethoscope,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Logo from '../brand/Logo';

export const Footer = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  const userRole = user?.role || 'patient';

  const getDashboardDetails = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Admin Console',
          path: '/admin/dashboard',
          appointmentsPath: '/admin/appointments',
          settingsPath: '/admin/settings',
          roleBadge: 'Administrator',
          roleColor: 'bg-gold-100 text-gold-900 border-gold-300',
        };
      case 'specialist':
        return {
          title: 'Specialist Hub',
          path: '/specialist/dashboard',
          appointmentsPath: '/specialist/appointments',
          settingsPath: '/specialist/settings',
          roleBadge: 'Verified Specialist',
          roleColor: 'bg-sage-100 text-sage-900 border-sage-300',
        };
      case 'patient':
      default:
        return {
          title: 'Patient Portal',
          path: '/patient/dashboard',
          appointmentsPath: '/patient/appointments',
          settingsPath: '/patient/settings',
          roleBadge: 'Patient Account',
          roleColor: 'bg-blush-100 text-blush-900 border-blush-300',
        };
    }
  };

  const dashboardInfo = getDashboardDetails();

  return (
    <footer className="w-full bg-[#FAF6F0] border-t border-taupe-200/80 mt-auto text-stone-700">
      <Container className="py-12 lg:py-16">
        {/* ========================================================================= */}
        {/* TOP: ACTIVE LOGGED-IN SESSION PANEL (Shown when already authenticated) */}
        {/* ========================================================================= */}
        {isAuthenticated && (
          <div className="mb-12 p-6 sm:p-7 rounded-3xl bg-white/90 border border-taupe-200/90 shadow-sm backdrop-blur-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sage-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sage-700/20">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      Welcome back, {user?.name || 'User'}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${dashboardInfo.roleColor}`}
                    >
                      {dashboardInfo.roleBadge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Quickly access your active consultations, calendar management, and settings.
                  </p>
                </div>
              </div>

              {/* Action Buttons for Logged In User */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  to={dashboardInfo.path}
                  variant="primary"
                  size="sm"
                  icon={LayoutDashboard}
                  iconPosition="left"
                  className="shadow-sm shadow-sage-700/25 font-semibold"
                >
                  Go to {dashboardInfo.title}
                </Button>
                <Button
                  to={dashboardInfo.appointmentsPath}
                  variant="outline"
                  size="sm"
                  icon={Calendar}
                  iconPosition="left"
                >
                  Appointments
                </Button>
                <Button
                  to={dashboardInfo.settingsPath}
                  variant="ghost"
                  size="sm"
                  icon={Settings}
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN FOOTER COLUMNS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo to="/" size="lg" />
            <p className="text-sm text-stone-600 leading-relaxed max-w-sm pt-1">
              A bespoke, 100% free appointment-booking platform connecting patients with certified dermatologists, skincare practitioners, and aesthetic clinics with zero booking fees.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush-50 border border-blush-200/80 text-xs font-medium text-blush-900 shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-blush-600 fill-blush-600/30 shrink-0" />
              <span>100% Free for Specialists & Patients</span>
            </div>
          </div>

          {/* Column 2: Dashboards & Portals (Col 5-7) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-sage-600" />
              <span>Dashboards & Portals</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/patient/dashboard"
                  className="group flex items-center justify-between text-stone-600 hover:text-sage-800 transition-colors"
                >
                  <span>Patient Dashboard</span>
                  <span className="text-[10px] uppercase font-bold text-blush-700 bg-blush-50 px-2 py-0.5 rounded-md border border-blush-200/60 opacity-90 group-hover:opacity-100">
                    Portal
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/specialist/dashboard"
                  className="group flex items-center justify-between text-stone-600 hover:text-sage-800 transition-colors"
                >
                  <span>Specialist Hub</span>
                  <span className="text-[10px] uppercase font-bold text-sage-800 bg-sage-100 px-2 py-0.5 rounded-md border border-sage-200/70 opacity-90 group-hover:opacity-100">
                    Doctors
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="group flex items-center justify-between text-stone-600 hover:text-sage-800 transition-colors"
                >
                  <span>Admin Console</span>
                  <span className="text-[10px] uppercase font-bold text-gold-800 bg-gold-100 px-2 py-0.5 rounded-md border border-gold-200/80 opacity-90 group-hover:opacity-100">
                    Management
                  </span>
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/for-specialists"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage-700 hover:text-sage-900"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Join as Licensed Specialist</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Discovery (Col 8-10) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Platform</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li>
                <Link to="/specialists" className="hover:text-sage-800 transition-colors">
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-sage-800 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sage-800 transition-colors">
                  About Zareen
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-sage-800 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sage-800 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Legal (Col 11-12) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
              <span>Trust & Legal</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li>
                <Link to="/terms" className="hover:text-sage-800 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-sage-800 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sage-800 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-sage-800 transition-colors">
                  Safety & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM COPYRIGHT & DIRECT ACCESS STRIP */}
        {/* ========================================================================= */}
        <div className="mt-12 pt-8 border-t border-taupe-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Zareen Skin Care. All rights reserved.</p>

          {/* Direct Quick Portal Access Bar */}
          <div className="flex flex-wrap items-center gap-3 text-stone-600">
            <span className="text-stone-400">Direct Portals:</span>
            <Link
              to="/patient/dashboard"
              className="hover:text-sage-800 hover:underline transition-colors"
            >
              Patient
            </Link>
            <span className="text-taupe-300">•</span>
            <Link
              to="/specialist/dashboard"
              className="hover:text-sage-800 hover:underline transition-colors"
            >
              Specialist
            </Link>
            <span className="text-taupe-300">•</span>
            <Link
              to="/admin/dashboard"
              className="hover:text-gold-700 hover:underline transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
