import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Eye,
  Sparkles,
  X,
  FileText,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockAdminAppointments } from '../../data/admin';

export const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState(mockAdminAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'confirmed' | 'upcoming' | 'completed' | 'cancelled'
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchPatient = apt.patientName.toLowerCase().includes(q);
        const matchDoctor = apt.specialistName.toLowerCase().includes(q);
        const matchService = apt.serviceName.toLowerCase().includes(q);
        if (!matchPatient && !matchDoctor && !matchService) return false;
      }

      // Status
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

      return true;
    });
  }, [appointments, searchQuery, statusFilter]);

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    showToast(`Appointment status changed to ${newStatus}.`);
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => ({ ...prev, status: newStatus }));
    }
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
            <span>Global Booking Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor and coordinate all patient-specialist consultations across the platform.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs font-bold text-slate-700">
          Showing: <span className="text-teal-700">{filteredAppointments.length} bookings</span>
        </div>
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
              placeholder="Search by patient, doctor, or treatment..."
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
            />
          </div>

          <div className="sm:col-span-4">
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
      </div>

      {/* ========================================================================= */}
      {/* 1. DESKTOP TABLE */}
      {/* ========================================================================= */}
      <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-4 pl-6">Patient</th>
              <th className="p-4">Specialist</th>
              <th className="p-4">Service</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Status</th>
              <th className="p-4">Fee</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-900">
                    <div>{apt.patientName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{apt.patientEmail}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{apt.specialistName}</div>
                    <div className="text-[11px] text-teal-700">{apt.specialistSpecialty}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">
                    <div>{apt.serviceName}</div>
                    <div className="text-[11px] text-slate-400">{apt.type}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    <div>{apt.dateLabel}</div>
                    <div className="text-[11px] text-slate-400">{apt.time}</div>
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
                  <td className="p-4 font-bold text-slate-900">
                    {apt.serviceFee}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-teal-700 font-semibold transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400">
                  No appointments match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE CARD VIEW */}
      {/* ========================================================================= */}
      <div className="lg:hidden space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900">{apt.patientName}</h3>
                  <p className="text-xs text-teal-700 font-semibold">with {apt.specialistName}</p>
                  <p className="text-[11px] text-slate-400">{apt.serviceName}</p>
                </div>

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
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{apt.dateLabel} at {apt.time}</span>
                <span className="font-bold text-slate-900">{apt.serviceFee}</span>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(apt)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Booking</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/80 text-xs text-slate-400">
            No appointments match your search.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. APPOINTMENT INSPECT MODAL */}
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
                    <h3 className="text-base font-bold text-slate-900">Appointment Record</h3>
                    <p className="text-[11px] text-slate-400">ID: {selectedAppointment.id}</p>
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

              {/* Consultation Details */}
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Patient: {selectedAppointment.patientName}</span>
                    <span className="text-teal-700 font-semibold">{selectedAppointment.patientEmail}</span>
                  </div>
                  <div className="text-slate-600">
                    Practitioner: <strong>{selectedAppointment.specialistName}</strong> ({selectedAppointment.specialistSpecialty})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Date & Time</span>
                    <span className="font-bold text-slate-900">
                      {selectedAppointment.dateLabel} • {selectedAppointment.time}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Service Fee</span>
                    <span className="font-bold text-teal-700 text-sm">
                      {selectedAppointment.serviceFee}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Procedure / Service</span>
                  <span className="font-bold text-slate-800">{selectedAppointment.serviceName} ({selectedAppointment.type})</span>
                </div>
              </div>

              {/* Status Update Override */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Admin Status Override
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {['confirmed', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAppointment.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                        selectedAppointment.status === st
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAppointmentsPage;
