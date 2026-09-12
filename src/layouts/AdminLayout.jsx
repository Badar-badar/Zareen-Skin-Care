import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bell,
  Search,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../components/brand/Logo';

const adminNavLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Specialists', path: '/admin/specialists', icon: UserCheck },
  { name: 'Patients', path: '/admin/patients', icon: Users },
  { name: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
  { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
  { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(true);
  const [isSystemActive, setIsSystemActive] = useState(true);

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
      {/* 1. DESKTOP PERMANENT SIDEBAR (MATCHING SPECIALIST SIDEBAR DESIGN) */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 z-30 justify-between">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-taupe-200/70 flex items-center justify-between">
            <Logo to="/" subtitle="Admin Console" size="sm" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </span>
            {adminNavLinks.map((item) => {
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

        {/* Bottom Profile Summary Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sage-700 text-white font-bold flex items-center justify-center text-xs shadow-sm ring-1 ring-sage-500/30">
              <ShieldCheck className="w-5 h-5 text-gold-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">Super Admin</p>
              <p className="text-[11px] text-teal-700 truncate font-medium">All Privileges Active</p>
            </div>
          </div>

          <Link
            to="/auth/login"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE DRAWER SIDEBAR */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Sidebar drawer sheet */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10"
            >
              <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <Logo
                    to="/"
                    subtitle="Admin Console"
                    size="xs"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close navigation menu"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="p-4 space-y-1.5 flex-1">
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Menu
                  </span>
                  {adminNavLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-teal-50 text-teal-800 font-bold'
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

              <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
                <Link
                  to="/auth/login"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE WITH TOPBAR (MATCHING SPECIALIST TOPBAR) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 sm:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Welcome Context */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar navigation"
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden sm:block">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Platform Administration
              </h2>
              <p className="text-[11px] text-slate-500">
                System Governance • Global Controls & Analytics
              </p>
            </div>
          </div>

          {/* Right: Status Toggle, Live Directory, Notifications & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live System Status Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsSystemActive((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isSystemActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSystemActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="hidden sm:inline">
                {isSystemActive ? 'All Services Operational' : 'Maintenance Mode'}
              </span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setHasUnreadAlerts(false)}
                aria-label="System Alerts"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {hasUnreadAlerts && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>
            </div>

            {/* Live Directory Link Button */}
            <Link
              to="/specialists"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>View Public Portal</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
