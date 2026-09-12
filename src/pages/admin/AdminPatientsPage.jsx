import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Eye,
  Sparkles,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockAdminPatients } from '../../data/admin';

export const AdminPatientsPage = () => {
  const [patients] = useState(mockAdminPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchEmail = p.email.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchConcern = p.skinConcern.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchCity && !matchConcern) return false;
      }

      // Status
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      return true;
    });
  }, [patients, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Patient Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Registered Patients
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View patient accounts, appointment frequency, and clinical engagement metrics.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs font-bold text-slate-700">
          Total Registered: <span className="text-teal-700">{patients.length} active profiles</span>
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
              placeholder="Search by patient name, email, city, or skin concern..."
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
            >
              <option value="all">All Patient Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive / Lapsed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DESKTOP PATIENTS TABLE */}
      {/* ========================================================================= */}
      <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-4 pl-6">Patient</th>
              <th className="p-4">Contact & City</th>
              <th className="p-4">Registered Date</th>
              <th className="p-4">Appointments</th>
              <th className="p-4">Last Visit</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{patient.name}</p>
                        <p className="text-[11px] text-teal-700">{patient.skinConcern}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{patient.email}</div>
                    <div className="text-[11px] text-slate-400">{patient.city}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {patient.registeredDate}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-100/70">
                      {patient.appointmentCount} consultations
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {patient.lastVisitDate}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        patient.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(patient)}
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
                  No patient accounts match your search filters.
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
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{patient.name}</h3>
                    <p className="text-xs text-teal-700 font-medium">{patient.skinConcern}</p>
                    <p className="text-[11px] text-slate-400">{patient.email}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    patient.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {patient.status}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Registered</span>
                  <span className="font-semibold text-slate-800">{patient.registeredDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Bookings</span>
                  <span className="font-bold text-slate-800">{patient.appointmentCount} visits</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Last visit: <strong>{patient.lastVisitDate}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedPatient(patient)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Inspect Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/80 text-xs text-slate-400">
            No patients match your search.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. PATIENT INSPECT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPatient(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Patient Overview</h3>
                    <p className="text-[11px] text-slate-400">ID: {selectedPatient.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  aria-label="Close modal"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <img
                  src={selectedPatient.avatar}
                  alt={selectedPatient.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedPatient.name}</h4>
                  <p className="text-xs text-teal-700 font-medium">{selectedPatient.skinConcern}</p>
                  <p className="text-[11px] text-slate-400">{selectedPatient.city}</p>
                </div>
              </div>

              {/* Specifics */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Registered Since</span>
                    <span className="font-bold text-slate-900">{selectedPatient.registeredDate}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Total Consultations</span>
                    <span className="font-bold text-teal-700">{selectedPatient.appointmentCount} Visits</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedPatient.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    selectedPatient.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Status: {selectedPatient.status}
                </span>

                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
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

export default AdminPatientsPage;
