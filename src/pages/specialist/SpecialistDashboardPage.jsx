import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Sliders,
  Phone,
  Mail,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockSpecialistAppointments } from '../../data/appointments';

export const SpecialistDashboardPage = () => {
  const [appointments, setAppointments] = useState(mockSpecialistAppointments);

  const todayAppointments = appointments.filter((apt) => apt.date === 'Today');
  const upcomingAppointments = appointments.filter((apt) => apt.date !== 'Today' && apt.status !== 'completed');

  const handleMarkComplete = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'completed' } : apt))
    );
  };

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. WELCOME BANNER */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-200 border border-white/15 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Specialist Dashboard Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, Dr. Sophia
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl">
            You have <strong>{todayAppointments.length} appointments</strong> scheduled for today. Review upcoming patient consultations and manage your clinic slots below.
          </p>
        </div>

        {/* Quick Action Top Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            to="/specialist/calendar"
            variant="secondary"
            size="md"
            icon={Calendar}
            className="bg-white text-teal-900 hover:bg-teal-50"
          >
            Open Calendar
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS OVERVIEW CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Today's Appointments */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today&apos;s Schedule</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {todayAppointments.length}
          </p>
          <p className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Next at 09:30 AM</span>
          </p>
        </motion.div>

        {/* Stat 2: Upcoming Appointments */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Slots</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">28</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14% from last week</span>
          </p>
        </motion.div>

        {/* Stat 3: Total Consultations */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Consultations</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">184</p>
          <p className="text-[11px] text-slate-400 font-medium">Completed & Active</p>
        </motion.div>

        {/* Stat 4: Total Patients */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered Patients</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">142</p>
          <p className="text-[11px] text-teal-700 font-medium">Zero platform commission</p>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK ACTIONS BAR */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            to="/specialist/services"
            variant="outline"
            size="md"
            icon={Plus}
            className="justify-center border-dashed hover:border-teal-400 hover:bg-teal-50/50"
          >
            Add New Service
          </Button>

          <Button
            to="/specialist/availability"
            variant="outline"
            size="md"
            icon={Sliders}
            className="justify-center hover:border-teal-400 hover:bg-teal-50/50"
          >
            Set Working Hours
          </Button>

          <Button
            to="/specialist/calendar"
            variant="outline"
            size="md"
            icon={Calendar}
            className="justify-center hover:border-teal-400 hover:bg-teal-50/50"
          >
            View Live Calendar
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TODAY'S APPOINTMENTS LIST */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today&apos;s Appointments</h2>
            <p className="text-xs text-slate-500">
              Patients scheduled for consultation today, Wednesday, Sep 9
            </p>
          </div>
          <Link
            to="/specialist/appointments"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>View All ({appointments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {todayAppointments.map((apt) => {
            const isDone = apt.status === 'completed';
            const inProgress = apt.status === 'in-progress';

            return (
              <div
                key={apt.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                    : inProgress
                    ? 'bg-amber-50/40 border-amber-200 ring-1 ring-amber-300'
                    : 'bg-white border-slate-200/80 hover:border-teal-200 hover:shadow-xs'
                }`}
              >
                {/* Left: Time & Patient Details */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 text-center shrink-0 min-w-[72px]">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                    <span className="text-xs font-bold block">{apt.time}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-slate-200 text-slate-700'
                            : inProgress
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isDone ? 'Completed' : inProgress ? 'In Progress' : 'Confirmed'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        • {apt.type}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-teal-700">
                      {apt.serviceName} ({apt.serviceDuration}) • {apt.servicePrice}
                    </p>

                    <p className="text-[11px] text-slate-500 italic max-w-lg">
                      &ldquo;{apt.notes}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <a
                    href={`tel:${apt.patientPhone}`}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-teal-700 hover:bg-slate-50"
                    title={apt.patientPhone}
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <a
                    href={`mailto:${apt.patientEmail}`}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-teal-700 hover:bg-slate-50"
                    title={apt.patientEmail}
                  >
                    <Mail className="w-4 h-4" />
                  </a>

                  {!isDone && (
                    <button
                      type="button"
                      onClick={() => handleMarkComplete(apt.id)}
                      className="px-3 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-2xs"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. UPCOMING APPOINTMENTS PREVIEW */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upcoming Appointments</h2>
            <p className="text-xs text-slate-500">Next scheduled patients this week</p>
          </div>
          <Link
            to="/specialist/appointments"
            className="text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            Manage Schedule →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingAppointments.slice(0, 3).map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-teal-300 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{apt.date}</span>
                <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  {apt.time}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{apt.serviceName}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>{apt.type}</span>
                <span className="font-bold text-slate-800">{apt.servicePrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboardPage;
