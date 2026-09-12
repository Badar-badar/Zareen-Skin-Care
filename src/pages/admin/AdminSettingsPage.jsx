import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle2,
  Sparkles,
  Save,
  Sliders,
  Server,
} from 'lucide-react';
import Button from '../../components/ui/Button';

export const AdminSettingsPage = () => {
  const [toastMessage, setToastMessage] = useState('');

  // Platform identity state
  const [platformName, setPlatformName] = useState('Zareen Skin Care');
  const [supportEmail, setSupportEmail] = useState('support@zareenskincare.com');
  const [escalationPhone, setEscalationPhone] = useState('+1 (800) 555-SKIN');

  // Verification & Moderation rules
  const [requireLicenseCheck, setRequireLicenseCheck] = useState(true);
  const [autoApproveVerified, setAutoApproveVerified] = useState(false);
  const [patientReviewModeration, setPatientReviewModeration] = useState(true);

  // Booking Policies
  const [cancellationCutoffHours, setCancellationCutoffHours] = useState('24');
  const [defaultSlotDuration, setDefaultSlotDuration] = useState('45');
  const [systemMaintenance, setSystemMaintenance] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Platform settings saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
          <Sparkles className="w-3 h-3 text-teal-600" />
          <span>Platform Governance</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          System & Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure practitioner onboarding protocols, booking cancellation policies, and operational parameters.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Platform Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Identity & Contact</h3>
              <p className="text-xs text-slate-500">
                Primary branding and public support communication channels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="platformName" className="block font-semibold text-slate-700">
                Platform Name
              </label>
              <input
                id="platformName"
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="supportEmail" className="block font-semibold text-slate-700">
                Support & Inquiries Email
              </label>
              <input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="escalationPhone" className="block font-semibold text-slate-700">
                Emergency Support Line / Hotline
              </label>
              <input
                id="escalationPhone"
                type="text"
                value={escalationPhone}
                onChange={(e) => setEscalationPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Specialist Onboarding & Verification */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Practitioner Verification Policy</h3>
              <p className="text-xs text-slate-500">
                Safeguard patient care by enforcing medical credential checks.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Require Medical License Check Before Public Listing
                </span>
                <span className="text-slate-500">
                  New specialist profiles remain hidden from public search until reviewed and verified by an administrator.
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireLicenseCheck}
                onChange={(e) => setRequireLicenseCheck(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Automatic Profile Publication for Pre-Verified Clinics
                </span>
                <span className="text-slate-500">
                  Instantly activate new dermatologists joining partnered health hospital networks.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoApproveVerified}
                onChange={(e) => setAutoApproveVerified(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Patient Reviews Moderation
                </span>
                <span className="text-slate-500">
                  Screen feedback for professional medical standards and privacy compliance before posting.
                </span>
              </div>
              <input
                type="checkbox"
                checked={patientReviewModeration}
                onChange={(e) => setPatientReviewModeration(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Booking Parameters & System State */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Booking Engine Parameters</h3>
              <p className="text-xs text-slate-500">
                Default timing controls for consultations across the platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="cancellationCutoff" className="block font-semibold text-slate-700">
                Cancellation Cutoff Notice (Hours)
              </label>
              <select
                id="cancellationCutoff"
                value={cancellationCutoffHours}
                onChange={(e) => setCancellationCutoffHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
              >
                <option value="12">12 Hours Notice</option>
                <option value="24">24 Hours Notice (Recommended)</option>
                <option value="48">48 Hours Notice</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="defaultSlotDuration" className="block font-semibold text-slate-700">
                Default Consultation Slot Duration
              </label>
              <select
                id="defaultSlotDuration"
                value={defaultSlotDuration}
                onChange={(e) => setDefaultSlotDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
              >
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 cursor-pointer text-xs">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-amber-950 block text-sm">
                  System Maintenance Mode
                </span>
                <span className="text-amber-800">
                  Temporarily disable new patient appointment bookings while running platform upgrades.
                </span>
              </div>
              <input
                type="checkbox"
                checked={systemMaintenance}
                onChange={(e) => setSystemMaintenance(e.target.checked)}
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            className="shadow-md shadow-teal-700/20"
          >
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
