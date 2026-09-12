import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  CheckCircle2,
  Calendar,
  XCircle,
  Eye,
  FileText,
  X,
  Sparkles,
  AlertCircle,
  Filter,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockPatientAppointments } from '../../data/appointments';

export const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState(mockPatientAppointments);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'confirmed' | 'upcoming'

  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('2026-09-18');
  const [newRescheduleTime, setNewRescheduleTime] = useState('02:00 PM');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered upcoming appointments
  const upcomingList = useMemo(() => {
    return appointments.filter((apt) => {
      // Must be upcoming or confirmed
      if (apt.status !== 'confirmed' && apt.status !== 'upcoming') return false;

      // Status sub-filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDoctor = apt.specialistName.toLowerCase().includes(q);
        const matchService = apt.serviceName.toLowerCase().includes(q);
        const matchSpecialty = apt.specialistSpecialty.toLowerCase().includes(q);
        if (!matchDoctor && !matchService && !matchSpecialty) return false;
      }

      return true;
    });
  }, [appointments, statusFilter, searchQuery]);

  // Handlers
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
    <div className="space-y-6">
      {/* Toast Feedback */}
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
            <span>Consultation Schedule</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Upcoming Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, reschedule, or manage your scheduled dermatology visits.
          </p>
        </div>

        <Button to="/specialists" variant="primary" size="md" icon={Search}>
          Book New Consultation
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor, clinic, or treatment name..."
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
            >
              <option value="all">All Upcoming Statuses</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="upcoming">Pending / Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List / Grid */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {upcomingList.length > 0 ? (
            upcomingList.map((apt) => (
              <motion.div
                layout
                key={apt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Doctor + Service */}
                  <div className="flex items-start gap-4">
                    <img
                      src={apt.specialistImage}
                      alt={apt.specialistName}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                    />

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {apt.specialistName}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          • {apt.type}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-teal-700">
                        {apt.serviceName} ({apt.serviceDuration}) • <span className="text-slate-800 font-bold">{apt.servicePrice}</span>
                      </p>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{apt.clinicName}, {apt.clinicAddress}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Time badge + Actions */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-800 text-center min-w-[120px] border border-teal-100">
                      <span className="text-xs font-bold block">{apt.time}</span>
                      <span className="text-[11px] text-teal-700 block font-medium">
                        {apt.dateLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(apt)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-teal-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAppointmentToReschedule(apt);
                          setNewRescheduleDate(apt.dateStr);
                          setNewRescheduleTime(apt.time);
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-teal-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAppointmentToCancel(apt)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Cancel Appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {apt.preparationInstructions && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Preparation:</strong> {apt.preparationInstructions}
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-4">
              <Filter className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900">No Upcoming Appointments Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You don't have any appointments matching your filters. Book a consultation with a verified skin specialist today.
                </p>
              </div>
              <Button to="/specialists" variant="primary" size="md" icon={Search}>
                Browse Specialists
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* 1. DETAILS MODAL */}
      {/* ========================================================================= */}
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

              {/* Doctor Card */}
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
                  View Doctor
                </Link>
              </div>

              {/* Consultation Details */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Date & Time</span>
                    <span className="font-bold text-slate-800">
                      {selectedAppointment.dateLabel} • {selectedAppointment.time}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Visit Type</span>
                    <span className="font-bold text-slate-800">{selectedAppointment.type}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Treatment</span>
                    <span className="font-bold text-slate-800">
                      {selectedAppointment.serviceName} ({selectedAppointment.serviceDuration})
                    </span>
                  </div>
                  <span className="font-bold text-teal-700 text-sm">{selectedAppointment.servicePrice}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                  <span className="text-teal-900 font-bold block">Patient Notes:</span>
                  <p className="text-slate-700 leading-relaxed italic">
                    &ldquo;{selectedAppointment.intakeNotes}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
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

      {/* ========================================================================= */}
      {/* 2. RESCHEDULE MODAL */}
      {/* ========================================================================= */}
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
                  <h3 className="text-lg font-bold text-slate-900">Reschedule Consultation</h3>
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
                  <label htmlFor="reschedule-new-date" className="block font-semibold text-slate-700">
                    Select New Date
                  </label>
                  <input
                    id="reschedule-new-date"
                    type="date"
                    required
                    value={newRescheduleDate}
                    onChange={(e) => setNewRescheduleDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reschedule-new-time" className="block font-semibold text-slate-700">
                    Select Available Time Slot
                  </label>
                  <select
                    id="reschedule-new-time"
                    value={newRescheduleTime}
                    onChange={(e) => setNewRescheduleTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
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

      {/* ========================================================================= */}
      {/* 3. CANCEL MODAL */}
      {/* ========================================================================= */}
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

export default PatientAppointmentsPage;
