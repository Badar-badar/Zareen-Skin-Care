import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  X,
  Sparkles,
  RotateCcw,
  Pill,
  Filter,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockPatientAppointments } from '../../data/appointments';

export const PatientHistoryPage = () => {
  const [appointments] = useState(mockPatientAppointments);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Filter history (completed or cancelled)
  const historyList = useMemo(() => {
    return appointments.filter((apt) => {
      // Must be past/completed or cancelled
      if (apt.status !== 'completed' && apt.status !== 'cancelled') return false;

      // Status filter
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Consultation Archive</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Appointment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review completed dermatology consultations, clinical summaries, and past bookings.
          </p>
        </div>

        <Button to="/specialists" variant="primary" size="md" icon={Search}>
          Find a Specialist
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past consultations by doctor, clinic, or treatment..."
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
            >
              <option value="all">All Past Records</option>
              <option value="completed">Completed Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] mr-1">Filter:</span>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all ${
                statusFilter === tab.id
                  ? 'bg-teal-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Cards List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {historyList.length > 0 ? (
            historyList.map((apt) => {
              const isCompleted = apt.status === 'completed';
              const isCancelled = apt.status === 'cancelled';

              return (
                <motion.div
                  layout
                  key={apt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all space-y-4 ${
                    isCancelled
                      ? 'border-red-200/80 bg-red-50/15'
                      : 'border-slate-200/80 hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Doctor Info & Treatment */}
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
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-600" />
                            )}
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

                    {/* Date badge & Actions */}
                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="p-2.5 rounded-2xl bg-slate-50 text-slate-800 text-center min-w-[120px] border border-slate-200/80">
                        <span className="text-xs font-bold block">{apt.time}</span>
                        <span className="text-[11px] text-slate-500 block font-medium">
                          {apt.dateLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAppointment(apt)}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-teal-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Summary</span>
                        </button>

                        <Link
                          to={`/specialists/${apt.specialistId}`}
                          className="px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Book Again</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Summary Snippet or Cancellation Reason */}
                  {isCompleted && apt.summaryNotes && (
                    <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100/80 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-teal-900 block">Doctor Notes & Recommendation:</span>
                      <p className="italic leading-relaxed">&ldquo;{apt.summaryNotes}&rdquo;</p>
                      {apt.prescription && (
                        <div className="flex items-center gap-1.5 text-teal-800 font-semibold pt-1 border-t border-teal-100">
                          <Pill className="w-3.5 h-3.5 text-teal-600" />
                          <span>Prescribed Protocol: {apt.prescription}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isCancelled && apt.cancellationReason && (
                    <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-100 text-xs text-red-800 space-y-1">
                      <span className="font-bold block">Cancellation Note:</span>
                      <p>{apt.cancellationReason}</p>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-4">
              <Filter className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900">No Past Records Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You do not have any past appointment history matching your selected filters.
                </p>
              </div>
              <Button to="/specialists" variant="primary" size="md" icon={Search}>
                Browse Specialists
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* View Full Summary Modal */}
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
                    <h3 className="text-base font-bold text-slate-900">Consultation Summary</h3>
                    <p className="text-[11px] text-slate-400">Record: {selectedAppointment.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  aria-label="Close summary"
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
                  Profile
                </Link>
              </div>

              {/* Consultation Details */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Consultation Date</span>
                    <span className="font-bold text-slate-800">
                      {selectedAppointment.dateLabel} • {selectedAppointment.time}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Consultation Mode</span>
                    <span className="font-bold text-slate-800">{selectedAppointment.type}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Completed Treatment</span>
                    <span className="font-bold text-slate-800">
                      {selectedAppointment.serviceName} ({selectedAppointment.serviceDuration})
                    </span>
                  </div>
                  <span className="font-bold text-teal-700 text-sm">{selectedAppointment.servicePrice}</span>
                </div>

                {selectedAppointment.summaryNotes && (
                  <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                    <span className="text-teal-900 font-bold block">Doctor Clinical Evaluation:</span>
                    <p className="text-slate-700 leading-relaxed italic">
                      &ldquo;{selectedAppointment.summaryNotes}&rdquo;
                    </p>
                  </div>
                )}

                {selectedAppointment.prescription && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <span className="text-emerald-900 font-bold block">Prescribed Regimen:</span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {selectedAppointment.prescription}
                    </p>
                  </div>
                )}

                {selectedAppointment.cancellationReason && (
                  <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-100 space-y-1">
                    <span className="text-red-900 font-bold block">Cancellation Reason:</span>
                    <p className="text-red-700 leading-relaxed">
                      {selectedAppointment.cancellationReason}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/specialists/${selectedAppointment.specialistId}`}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-2xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Book Follow-up</span>
                </Link>

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

export default PatientHistoryPage;
