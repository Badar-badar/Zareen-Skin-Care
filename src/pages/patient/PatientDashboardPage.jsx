import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  XCircle,
  Eye,
  FileText,
  X,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockPatientAppointments, mockPatientProfile } from '../../data/appointments';

export const PatientDashboardPage = () => {
  const [appointments, setAppointments] = useState(mockPatientAppointments);

  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('2026-09-15');
  const [newRescheduleTime, setNewRescheduleTime] = useState('11:00 AM');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Next Appointment (first upcoming or confirmed)
  const nextAppointment = appointments.find(
    (apt) => apt.status === 'confirmed' || apt.status === 'upcoming'
  );

  // Remaining upcoming
  const otherUpcoming = appointments
    .filter(
      (apt) =>
        (apt.status === 'confirmed' || apt.status === 'upcoming') &&
        (!nextAppointment || apt.id !== nextAppointment.id)
    )
    .slice(0, 3);

  // Completed appointments
  const completedAppointments = appointments
    .filter((apt) => apt.status === 'completed')
    .slice(0, 2);

  // Action handlers
  const handleConfirmCancel = () => {
    if (!appointmentToCancel) return;
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentToCancel.id ? { ...apt, status: 'cancelled' } : apt
      )
    );
    showToast(`Appointment with ${appointmentToCancel.specialistName} has been cancelled.`);
    if (selectedAppointment && selectedAppointment.id === appointmentToCancel.id) {
      setSelectedAppointment((prev) => ({ ...prev, status: 'cancelled' }));
    }
    setAppointmentToCancel(null);
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!appointmentToReschedule) return;

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentToReschedule.id
          ? {
              ...apt,
              dateStr: newRescheduleDate,
              dateLabel: `Rescheduled (${newRescheduleDate})`,
              time: newRescheduleTime,
              status: 'confirmed',
            }
          : apt
      )
    );
    showToast(`Appointment rescheduled to ${newRescheduleDate} at ${newRescheduleTime}.`);
    setAppointmentToReschedule(null);
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

      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Skin Health Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {mockPatientProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track upcoming consultations, review doctor notes, and manage your skin care appointments.
          </p>
        </div>

        {/* Quick Action: Find Specialist */}
        <Button
          to="/specialists"
          variant="primary"
          size="md"
          icon={Search}
          className="shadow-md shadow-teal-700/20"
        >
          Find a Specialist
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 1. NEXT APPOINTMENT FEATURED HERO CARD */}
      {/* ========================================================================= */}
      {nextAppointment ? (
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-700/60 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
                  Next Scheduled Appointment
                </span>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-700/60 text-teal-100 border border-teal-600/50 w-fit">
                {nextAppointment.dateLabel} • {nextAppointment.time}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Specialist Info */}
              <div className="lg:col-span-7 flex items-start gap-4">
                <img
                  src={nextAppointment.specialistImage}
                  alt={nextAppointment.specialistName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-teal-400/40 shadow-md shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {nextAppointment.specialistName}
                    </h2>
                    <span className="text-[11px] font-medium text-teal-200 px-2 py-0.5 rounded-md bg-teal-800/80">
                      {nextAppointment.specialistSpecialty}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-teal-100">
                    {nextAppointment.serviceName} ({nextAppointment.serviceDuration})
                  </p>
                  <p className="text-xs text-teal-200/80 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-teal-400" />
                    <span>{nextAppointment.clinicName} — {nextAppointment.clinicAddress}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-teal-700/60">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(nextAppointment)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppointmentToReschedule(nextAppointment);
                    setNewRescheduleDate(nextAppointment.dateStr);
                    setNewRescheduleTime(nextAppointment.time);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reschedule</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppointmentToCancel(nextAppointment)}
                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 text-xs font-bold transition-all border border-red-500/30"
                  title="Cancel Consultation"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preparation notice if present */}
            {nextAppointment.preparationInstructions && (
              <div className="p-3.5 rounded-2xl bg-teal-950/50 border border-teal-700/50 flex items-start gap-2.5 text-xs text-teal-200">
                <AlertCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Preparation:</strong> {nextAppointment.preparationInstructions}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Upcoming Appointments</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              You do not have any active appointments scheduled. Browse top-rated dermatologists and book a consultation online for free.
            </p>
          </div>
          <Button to="/specialists" variant="primary" size="md" icon={Search}>
            Browse Skin Specialists
          </Button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. UPCOMING APPOINTMENTS LIST */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upcoming Consultations</h2>
            <p className="text-xs text-slate-500">Your scheduled visits and treatment appointments</p>
          </div>
          <Link
            to="/patient/appointments"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {otherUpcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherUpcoming.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.specialistImage}
                        alt={apt.specialistName}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{apt.specialistName}</h3>
                        <p className="text-xs text-teal-700 font-medium">{apt.specialistSpecialty}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {apt.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <p className="font-bold text-slate-800">
                      {apt.serviceName} ({apt.serviceDuration})
                    </p>
                    <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                      <span className="flex items-center gap-1 font-semibold text-teal-800">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {apt.dateLabel} at {apt.time}
                      </span>
                      <span className="font-bold text-slate-800">{apt.servicePrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedAppointment(apt)}
                    className="font-semibold text-slate-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAppointmentToReschedule(apt);
                        setNewRescheduleDate(apt.dateStr);
                        setNewRescheduleTime(apt.time);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:text-teal-700 transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppointmentToCancel(apt)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Cancel"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-3xl border border-slate-200/70 text-center text-xs text-slate-500">
            No additional upcoming consultations scheduled.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. RECENTLY COMPLETED APPOINTMENTS & DOCTOR RECOMMENDATIONS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recently Completed Visits</h2>
            <p className="text-xs text-slate-500">Review clinical notes and follow-up recommendations</p>
          </div>
          <Link
            to="/patient/history"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            <span>Full History</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={apt.specialistImage}
                    alt={apt.specialistName}
                    className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{apt.specialistName}</h3>
                    <p className="text-[11px] text-slate-500">{apt.dateLabel}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Completed
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/40 border border-teal-100/70 text-xs space-y-1">
                <p className="font-bold text-teal-900">{apt.serviceName}</p>
                {apt.summaryNotes && (
                  <p className="text-slate-600 italic line-clamp-2">
                    &ldquo;{apt.summaryNotes}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <Link
                  to={`/specialists/${apt.specialistId}`}
                  className="font-bold text-teal-700 hover:text-teal-800"
                >
                  Book Follow-up
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(apt)}
                  className="text-slate-500 hover:text-slate-800 font-semibold"
                >
                  View Summary
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS (DETAILS, RESCHEDULE, CANCEL) */}
      {/* ========================================================================= */}
      {/* Details Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppointment(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Appointment Overview</h3>
                    <p className="text-[11px] text-slate-400">Ref: {selectedAppointment.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  aria-label="Close modal"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Specialist Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAppointment.specialistImage}
                    alt={selectedAppointment.specialistName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedAppointment.specialistName}
                    </h4>
                    <p className="text-xs text-teal-700 font-medium">{selectedAppointment.specialistSpecialty}</p>
                    <p className="text-[11px] text-slate-500">{selectedAppointment.clinicName}</p>
                  </div>
                </div>

                <Link
                  to={`/specialists/${selectedAppointment.specialistId}`}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-teal-700 transition-colors"
                >
                  Profile
                </Link>
              </div>

              {/* Appointment Specifics */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Date & Time</span>
                    <span className="font-bold text-slate-800">
                      {selectedAppointment.dateLabel} • {selectedAppointment.time}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Visit Mode</span>
                    <span className="font-bold text-slate-800">{selectedAppointment.type}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Selected Treatment</span>
                    <span className="font-bold text-slate-800">
                      {selectedAppointment.serviceName} ({selectedAppointment.serviceDuration})
                    </span>
                  </div>
                  <span className="font-bold text-teal-700 text-sm">{selectedAppointment.servicePrice}</span>
                </div>

                {selectedAppointment.intakeNotes && (
                  <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                    <span className="text-teal-900 font-bold block">Intake Notes:</span>
                    <p className="text-slate-700 leading-relaxed italic">
                      &ldquo;{selectedAppointment.intakeNotes}&rdquo;
                    </p>
                  </div>
                )}

                {selectedAppointment.summaryNotes && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                    <span className="text-emerald-900 font-bold block">Doctor Consultation Summary:</span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedAppointment.summaryNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Status: {selectedAppointment.status}
                </span>

                <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {appointmentToReschedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAppointmentToReschedule(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-bold text-slate-900">Reschedule Appointment</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAppointmentToReschedule(null)}
                  aria-label="Close modal"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <p className="font-bold text-slate-800">
                    Specialist: {appointmentToReschedule.specialistName}
                  </p>
                  <p className="text-slate-500">
                    Current: {appointmentToReschedule.dateLabel} at {appointmentToReschedule.time}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="p-reschedule-date" className="block font-semibold text-slate-700">
                    Select New Date
                  </label>
                  <input
                    id="p-reschedule-date"
                    type="date"
                    required
                    value={newRescheduleDate}
                    onChange={(e) => setNewRescheduleDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="p-reschedule-time" className="block font-semibold text-slate-700">
                    Select Available Time Slot
                  </label>
                  <select
                    id="p-reschedule-time"
                    value={newRescheduleTime}
                    onChange={(e) => setNewRescheduleTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setAppointmentToReschedule(null)}
                  >
                    Keep Existing
                  </Button>
                  <Button type="submit" variant="primary" size="md">
                    Confirm Reschedule
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {appointmentToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAppointmentToCancel(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Cancel Consultation?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to cancel your appointment with <strong>{appointmentToCancel.specialistName}</strong> on {appointmentToCancel.dateLabel}?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setAppointmentToCancel(null)}
                >
                  Keep Booking
                </Button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-2xs"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientDashboardPage;
