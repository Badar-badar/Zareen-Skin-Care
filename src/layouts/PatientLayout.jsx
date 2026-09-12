import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  History,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { mockPatientProfile } from '../data/appointments';
import Logo from '../components/brand/Logo';

const patientNavLinks = [
  { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
  { name: 'Upcoming Appointments', path: '/patient/appointments', icon: CalendarDays },
  { name: 'Appointment History', path: '/patient/history', icon: History },
  { name: 'My Profile', path: '/patient/profile', icon: User },
  { name: 'Settings', path: '/patient/settings', icon: Settings },
];

export const PatientLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* ========================================================================= */}
      {/* 1. DESKTOP PERMANENT SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 z-30 justify-between">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-taupe-200/70 flex items-center justify-between">
            <Logo to="/" subtitle="Patient Portal" size="sm" />
          </div>

          {/* Quick Find Specialist CTA Button */}
          <div className="px-4 pt-4">
            <Link
              to="/specialists"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-teal-50 border border-teal-100 text-teal-800 text-xs font-bold hover:bg-teal-100/70 transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-teal-600" />
                <span>Find a Specialist</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-teal-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Patient Menu
            </span>
            {patientNavLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Patient Summary Card & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <img
              src={mockPatientProfile.avatar}
              alt={mockPatientProfile.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {mockPatientProfile.name}
              </p>
              <p className="text-[11px] text-teal-700 font-medium truncate">
                {mockPatientProfile.skinType.split('/')[0]}
              </p>
            </div>
            <Link
              to="/patient/profile"
              className="p-1 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-white transition-colors"
              title="Edit Profile"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <Link
            to="/auth/login"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE DRAWER NAVIGATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl flex flex-col justify-between lg:hidden"
            >
              <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <Logo
                    to="/"
                    subtitle="Patient Portal"
                    size="xs"
                    onClick={() => setIsSidebarOpen(false)}
                  />

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close navigation menu"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4">
                  <Link
                    to="/specialists"
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Find Skin Specialist</span>
                  </Link>
                </div>

                <nav className="p-4 space-y-1">
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Patient Navigation
                  </span>
                  {patientNavLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-teal-50 text-teal-800 shadow-2xs font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-slate-100">
                <Link
                  to="/auth/login"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT WRAPPER */}
      {/* ========================================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Topbar Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                Patient Portal
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                Logged in as Patient
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Find Specialist Shortcut */}
            <Link
              to="/specialists"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50/60 text-teal-800 text-xs font-semibold hover:bg-teal-100/80 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-teal-600" />
              <span>Browse Specialists</span>
            </Link>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setHasUnreadNotification(false)}
              aria-label="View notifications"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadNotification && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
              )}
            </button>

            <div className="h-5 w-px bg-slate-200"></div>

            {/* User Avatar */}
            <Link
              to="/patient/profile"
              className="flex items-center gap-2 group p-1 -mr-1 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <img
                src={mockPatientProfile.avatar}
                alt={mockPatientProfile.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-teal-600/20"
              />
              <span className="text-xs font-bold text-slate-800 hidden md:inline group-hover:text-teal-700">
                {mockPatientProfile.name}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
