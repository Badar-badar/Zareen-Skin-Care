import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Users,
  CalendarDays,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Eye,
  Activity,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import {
  mockAdminStats,
  mockAdminSpecialists,
  mockAdminAppointments,
  mockAdminReportsData,
} from '../../data/admin';

export const AdminDashboardPage = () => {
  const [specialists, setSpecialists] = useState(mockAdminSpecialists);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Pending verification specialists
  const pendingSpecialists = specialists.filter((s) => !s.isVerified || s.status === 'pending');

  const handleVerifySpecialist = (id, name) => {
    setSpecialists((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isVerified: true, status: 'active' } : s))
    );
    showToast(`${name} has been verified and approved.`);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center gap-3 text-xs border border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Platform Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Executive Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time platform metrics, specialist verifications, and cross-clinic appointment tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            to="/admin/reports"
            variant="outline"
            size="md"
            icon={Activity}
          >
            Full Analytics
          </Button>
          <Button
            to="/admin/specialists"
            variant="primary"
            size="md"
            icon={UserCheck}
          >
            Manage Specialists
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP STATS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Specialists */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Specialists
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {mockAdminStats.totalSpecialists}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{mockAdminStats.specialistsGrowth}</span>
            </p>
          </div>
        </div>

        {/* Total Patients */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Patients
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {mockAdminStats.totalPatients.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{mockAdminStats.patientsGrowth}</span>
            </p>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Bookings
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {mockAdminStats.totalAppointments.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{mockAdminStats.appointmentsGrowth}</span>
            </p>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's Visits
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {mockAdminStats.todayAppointments}
            </p>
            <p className="text-xs text-teal-700 font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              <span>{mockAdminStats.todayGrowth}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHARTS & METRICS OVERVIEW */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Booking Velocity Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform Booking Velocity</h2>
              <p className="text-xs text-slate-500">Monthly consultation volume across all clinics</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
              2026 Trend
            </span>
          </div>

          {/* Bar Visualizer */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-9 gap-2 items-end h-44 border-b border-slate-100 pb-2">
              {mockAdminReportsData.monthlyAppointments.map((m) => {
                const maxVal = 700;
                const heightPct = Math.round((m.appointments / maxVal) * 100);

                return (
                  <div key={m.month} className="flex flex-col items-center h-full justify-end group">
                    <div className="text-[10px] font-bold text-teal-800 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {m.appointments}
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-xl bg-gradient-to-t from-teal-600 to-teal-400 group-hover:from-teal-700 group-hover:to-teal-500 transition-all shadow-2xs"
                    ></div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                      {m.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>0 bookings</span>
              <span>350 avg</span>
              <span>700+ peak</span>
            </div>
          </div>
        </div>

        {/* Status Distribution Meter */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Booking Status Ratio</h2>
            <p className="text-xs text-slate-500">Lifetime distribution of consultation outcomes</p>
          </div>

          <div className="space-y-4">
            {mockAdminReportsData.statusDistribution.map((st) => (
              <div key={st.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{st.label}</span>
                  <span className="font-bold text-slate-900">
                    {st.percentage}% ({st.count.toLocaleString()})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${st.percentage}%` }}
                    className={`h-full rounded-full ${st.color}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-semibold">Completion Rate</span>
            <span className="font-bold text-emerald-700">91.4% (Industry Top)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NEW SPECIALISTS AWAITING APPROVAL */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              New Specialists Awaiting Approval ({pendingSpecialists.length})
            </h2>
            <p className="text-xs text-slate-500">Review medical licenses and verify practitioner credentials</p>
          </div>
          <Link
            to="/admin/specialists"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            <span>All Specialists</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {pendingSpecialists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSpecialists.map((spec) => (
              <div
                key={spec.id}
                className="bg-white rounded-3xl p-5 border border-amber-200/80 bg-amber-50/15 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={spec.image}
                      alt={spec.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900">{spec.name}</h3>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-teal-700 font-medium">{spec.specialty}</p>
                      <p className="text-[11px] text-slate-500">{spec.clinicName} • {spec.location}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200/70 text-xs flex items-center justify-between">
                  <span className="text-slate-500">License: <strong>{spec.licenseNumber}</strong></span>
                  <span className="text-slate-500">Applied: {spec.joinedDate}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <Link
                    to={`/specialists/${spec.id}`}
                    className="font-semibold text-slate-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Public Page</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleVerifySpecialist(spec.id, spec.name)}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Verify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-3xl border border-slate-200/70 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All specialist applications are up to date and verified.</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. RECENT SYSTEM-WIDE BOOKINGS LOG */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Platform Bookings</h2>
            <p className="text-xs text-slate-500">Cross-clinic patient appointment stream</p>
          </div>
          <Link
            to="/admin/appointments"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            <span>All Bookings</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4 pl-6">Patient</th>
                  <th className="p-4">Specialist</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockAdminAppointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">
                      <div>{apt.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{apt.patientEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{apt.specialistName}</div>
                      <div className="text-[11px] text-teal-700">{apt.specialistSpecialty}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{apt.serviceName}</td>
                    <td className="p-4 font-semibold text-slate-800">
                      {apt.dateLabel} • {apt.time}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right font-bold text-slate-900">
                      {apt.serviceFee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
