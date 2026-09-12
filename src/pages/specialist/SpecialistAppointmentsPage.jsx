import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Filter,
  Eye,
  Calendar,
  AlertTriangle,
  X,
  Sparkles,
  FileText,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockSpecialistAppointments } from '../../data/appointments';

export const SpecialistAppointmentsPage = () => {
  const [appointments, setAppointments] = useState(mockSpecialistAppointments);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'upcoming' | 'confirmed' | 'completed' | 'cancelled'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'tomorrow' | 'this-week' | 'past'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For Details Modal
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null); // For Reschedule Modal
  const [newRescheduleDate, setNewRescheduleDate] = useState('2026-09-12');
  const [newRescheduleTime, setNewRescheduleTime] = useState('10:30 AM');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null); // For Cancel Confirmation Modal

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = apt.patientName.toLowerCase().includes(q);
        const matchService = apt.serviceName.toLowerCase().includes(q);
        const matchEmail = apt.patientEmail.toLowerCase().includes(q);
        if (!matchName && !matchService && !matchEmail) return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) {
        return false;
      }

      // Date Filter
      if (dateFilter === 'today' && apt.dateStr !== '2026-09-09') return false;
      if (dateFilter === 'tomorrow' && apt.dateStr !== '2026-09-10') return false;
      if (dateFilter === 'past' && apt.dateStr >= '2026-09-09') return false;
      if (dateFilter === 'this-week' && (apt.dateStr < '2026-09-07' || apt.dateStr > '2026-09-13')) return false;

      return true;
    });
  }, [appointments, statusFilter, dateFilter, searchQuery]);

  // Status Handlers
  const handleMarkComplete = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'completed' } : apt))
    );
    showToast('Appointment marked as completed.');
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => ({ ...prev, status: 'completed' }));
    }
  };

  const handleConfirmCancel = () => {
    if (!appointmentToCancel) return;
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentToCancel.id ? { ...apt, status: 'cancelled' } : apt
      )
    );
    showToast(`Appointment with ${appointmentToCancel.patientName} has been cancelled.`);
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
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Schedule Coordination</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Appointments Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review, reschedule, filter, and track all incoming and completed patient bookings.
          </p>
        </div>

        <Button
          to="/specialist/calendar"
          variant="outline"
          size="md"
          icon={CalendarDays}
          className="shadow-2xs"
        >
          Calendar Schedule View
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, email, or treatment..."
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
            />
          </div>

          {/* Date Range Filter */}
          <div className="sm:col-span-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only (Sep 9)</option>
              <option value="tomorrow">Tomorrow (Sep 10)</option>
              <option value="this-week">This Week (Sep 7-13)</option>
              <option value="past">Past Consultations</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Quick Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] mr-1">Status:</span>
          {['all', 'confirmed', 'upcoming', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider text-[10px] transition-all ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => {
              const isCompleted = apt.status === 'completed';
              const isCancelled = apt.status === 'cancelled';
              const isConfirmed = apt.status === 'confirmed';

              return (
                <motion.div
                  layout
                  key={apt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'border-slate-200 bg-slate-50/40 opacity-75'
                      : isCancelled
                      ? 'border-red-200 bg-red-50/20 opacity-75'
                      : 'border-slate-200/80 hover:shadow-xs hover:border-teal-200'
                  }`}
                >
                  {/* Left Column: Time badge + Patient & Service info */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-teal-50 text-teal-800 text-center min-w-[80px] shrink-0 border border-teal-100/80">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                      <span className="text-xs font-bold block">{apt.time}</span>
                      <span className="text-[10px] text-teal-600 font-medium block truncate">
                        {apt.dateLabel.split(',')[0]}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {apt.patientAvatar && (
                          <img
                            src={apt.patientAvatar}
                            alt={apt.patientName}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                          />
                        )}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {apt.patientName}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-slate-200 text-slate-700'
                              : isCancelled
                              ? 'bg-red-100 text-red-800'
                              : isConfirmed
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

                      <p className="text-xs text-slate-500 italic line-clamp-1 max-w-xl">
                        &ldquo;{apt.notes}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-teal-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {/* Quick Call */}
                    <a
                      href={`tel:${apt.patientPhone}`}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                      title={apt.patientPhone}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    {/* Action Triggers if not completed/cancelled */}
                    {!isCompleted && !isCancelled && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setAppointmentToReschedule(apt);
                            setNewRescheduleDate(apt.dateStr);
                            setNewRescheduleTime(apt.time);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-teal-700 transition-colors flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Reschedule</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMarkComplete(apt.id)}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-2xs"
                        >
                          Complete
                        </button>

                        <button
                          type="button"
                          onClick={() => setAppointmentToCancel(apt)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Cancel Consultation"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
              <Filter className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Appointments Match Filters</h3>
              <p className="text-xs text-slate-500">
                Try switching date ranges or status tabs to view scheduled consultations.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* 1. APPOINTMENT DETAILS MODAL */}
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
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Appointment Overview</h3>
                    <p className="text-[11px] text-slate-400">ID: {selectedAppointment.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  aria-label="Close details"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAppointment.patientAvatar}
                    alt={selectedAppointment.patientName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedAppointment.patientName}
                    </h4>
                    <p className="text-xs text-slate-500">{selectedAppointment.patientEmail}</p>
                    <p className="text-xs text-teal-700 font-medium">{selectedAppointment.patientPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${selectedAppointment.patientPhone}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${selectedAppointment.patientEmail}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Scheduled Slot</span>
                    <span className="font-bold text-slate-800">
                      {selectedAppointment.dateLabel} • {selectedAppointment.time}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Consultation Type</span>
                    <span className="font-bold text-slate-800">{selectedAppointment.type}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block">Service & Fee</span>
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{selectedAppointment.serviceName} ({selectedAppointment.serviceDuration})</span>
                    <span className="text-teal-700 text-sm">{selectedAppointment.servicePrice}</span>
                  </div>
                </div>

                {/* Patient Notes */}
                <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                  <span className="text-teal-800 font-bold block">Patient Intake Notes:</span>
                  <p className="text-slate-700 leading-relaxed italic">
                    &ldquo;{selectedAppointment.notes}&rdquo;
                  </p>
                </div>
              </div>

              {/* Status and Action CTAs */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    selectedAppointment.status === 'completed'
                      ? 'bg-slate-200 text-slate-700'
                      : selectedAppointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  Status: {selectedAppointment.status}
                </span>

                <div className="flex items-center gap-2">
                  {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleMarkComplete(selectedAppointment.id)}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-2xs"
                    >
                      Mark Completed
                    </button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    Close
                  </Button>
                </div>
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
                    Patient: {appointmentToReschedule.patientName}
                  </p>
                  <p className="text-slate-500">
                    Current slot: {appointmentToReschedule.dateLabel} at {appointmentToReschedule.time}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reschedule-date" className="block font-semibold text-slate-700">
                    Select New Date
                  </label>
                  <input
                    id="reschedule-date"
                    type="date"
                    required
                    value={newRescheduleDate}
                    onChange={(e) => setNewRescheduleDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reschedule-time" className="block font-semibold text-slate-700">
                    Select Available Time Slot
                  </label>
                  <select
                    id="reschedule-time"
                    value={newRescheduleTime}
                    onChange={(e) => setNewRescheduleTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
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
                    Cancel
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
      {/* 3. CANCEL APPOINTMENT MODAL */}
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
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Cancel Appointment?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to cancel consultation with <strong>{appointmentToCancel.patientName}</strong> scheduled for {appointmentToCancel.dateLabel}?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setAppointmentToCancel(null)}
                >
                  Keep Slot
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

export default SpecialistAppointmentsPage;
