import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Search,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Eye,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  X,
  Star,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockAdminSpecialists } from '../../data/admin';

export const AdminSpecialistsPage = () => {
  const [specialists, setSpecialists] = useState(mockAdminSpecialists);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'verified' | 'pending' | 'active' | 'suspended'
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filter specialists
  const filteredSpecialists = useMemo(() => {
    return specialists.filter((s) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchEmail = s.email.toLowerCase().includes(q);
        const matchSpecialty = s.specialty.toLowerCase().includes(q);
        const matchClinic = s.clinicName.toLowerCase().includes(q);
        const matchLocation = s.location.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchSpecialty && !matchClinic && !matchLocation) {
          return false;
        }
      }

      // Status
      if (statusFilter === 'verified' && !s.isVerified) return false;
      if (statusFilter === 'pending' && s.isVerified) return false;
      if (statusFilter === 'active' && s.status !== 'active') return false;
      if (statusFilter === 'suspended' && s.status !== 'suspended') return false;

      return true;
    });
  }, [specialists, searchQuery, statusFilter]);

  // Toggle Verification
  const handleToggleVerification = (id) => {
    setSpecialists((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextVerified = !s.isVerified;
          showToast(
            `${s.name} is now ${nextVerified ? 'verified & certified' : 'marked as unverified'}.`
          );
          return {
            ...s,
            isVerified: nextVerified,
            status: nextVerified ? 'active' : 'pending',
          };
        }
        return s;
      })
    );
    if (selectedSpecialist && selectedSpecialist.id === id) {
      setSelectedSpecialist((prev) => ({
        ...prev,
        isVerified: !prev.isVerified,
        status: !prev.isVerified ? 'active' : 'pending',
      }));
    }
  };

  // Toggle Status (Active / Suspended)
  const handleToggleStatus = (id) => {
    setSpecialists((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'active' ? 'suspended' : 'active';
          showToast(`${s.name} account is now ${nextStatus}.`);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    if (selectedSpecialist && selectedSpecialist.id === id) {
      setSelectedSpecialist((prev) => ({
        ...prev,
        status: prev.status === 'active' ? 'suspended' : 'active',
      }));
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
            <span>Practitioner Roster</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Specialist Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verify doctor licenses, manage clinic access, and monitor practitioner profiles.
          </p>
        </div>

        <Link
          to="/specialists"
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-2xs w-fit"
        >
          <Eye className="w-4 h-4 text-teal-600" />
          <span>Public Directory View</span>
        </Link>
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
              placeholder="Search by doctor name, specialty, clinic, or location..."
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
            >
              <option value="all">All Specialists ({specialists.length})</option>
              <option value="verified">Verified Specialists</option>
              <option value="pending">Pending Verification</option>
              <option value="active">Active Status</option>
              <option value="suspended">Suspended Accounts</option>
            </select>
          </div>
        </div>

        {/* Quick Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] mr-1">Filter:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'verified', label: 'Verified' },
            { id: 'pending', label: 'Pending' },
            { id: 'active', label: 'Active' },
            { id: 'suspended', label: 'Suspended' },
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

      {/* ========================================================================= */}
      {/* 1. DESKTOP TABLE VIEW */}
      {/* ========================================================================= */}
      <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-4 pl-6">Specialist</th>
              <th className="p-4">Clinic / City</th>
              <th className="p-4">License No.</th>
              <th className="p-4">Verification</th>
              <th className="p-4">Status</th>
              <th className="p-4">Bookings</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSpecialists.length > 0 ? (
              filteredSpecialists.map((spec) => (
                <tr key={spec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={spec.image}
                        alt={spec.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{spec.name}</p>
                        <p className="text-[11px] text-teal-700">{spec.specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{spec.clinicName}</div>
                    <div className="text-[11px] text-slate-400">{spec.location}</div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-slate-700">
                    {spec.licenseNumber}
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleToggleVerification(spec.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        spec.isVerified
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title="Click to toggle verification status"
                    >
                      {spec.isVerified ? (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3" />
                          <span>Pending</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(spec.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        spec.status === 'active'
                          ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title="Click to toggle active / suspended"
                    >
                      {spec.status}
                    </button>
                  </td>
                  <td className="p-4 font-bold text-slate-800">
                    {spec.totalAppointments} visits
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedSpecialist(spec)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-teal-700 font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400">
                  No specialists match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE / TABLET CARD VIEW */}
      {/* ========================================================================= */}
      <div className="lg:hidden space-y-4">
        {filteredSpecialists.length > 0 ? (
          filteredSpecialists.map((spec) => (
            <div
              key={spec.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={spec.image}
                    alt={spec.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{spec.name}</h3>
                    <p className="text-xs text-teal-700">{spec.specialty}</p>
                    <p className="text-[11px] text-slate-500">{spec.clinicName} • {spec.location}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    spec.isVerified
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {spec.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">License</span>
                  <span className="font-mono font-semibold text-slate-800">{spec.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Bookings</span>
                  <span className="font-bold text-slate-800">{spec.totalAppointments} visits</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedSpecialist(spec)}
                  className="font-semibold text-slate-700 hover:text-teal-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Details</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleVerification(spec.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50 text-slate-700"
                  >
                    {spec.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(spec.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold ${
                      spec.status === 'active'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    {spec.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/80 text-xs text-slate-400">
            No specialists match your search criteria.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. SPECIALIST INSPECT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedSpecialist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpecialist(null)}
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
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Practitioner Inspection</h3>
                    <p className="text-[11px] text-slate-400">ID: {selectedSpecialist.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSpecialist(null)}
                  aria-label="Close modal"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Specialist Header */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedSpecialist.image}
                    alt={selectedSpecialist.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {selectedSpecialist.name}
                    </h4>
                    <p className="text-xs text-teal-700 font-medium">{selectedSpecialist.specialty}</p>
                    <p className="text-xs text-slate-500">{selectedSpecialist.clinicName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-900">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{selectedSpecialist.rating}</span>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-slate-400 block text-[10px]">Medical License</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedSpecialist.licenseNumber}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-slate-400 block text-[10px]">Registration Date</span>
                    <span className="font-bold text-slate-900">{selectedSpecialist.joinedDate}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedSpecialist.email}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedSpecialist.phone}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedSpecialist.location}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleVerification(selectedSpecialist.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedSpecialist.isVerified
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {selectedSpecialist.isVerified ? 'Revoke Verification' : 'Approve & Verify'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(selectedSpecialist.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedSpecialist.status === 'active'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    {selectedSpecialist.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                  </button>
                </div>

                <Button variant="outline" size="sm" onClick={() => setSelectedSpecialist(null)}>
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

export default AdminSpecialistsPage;
