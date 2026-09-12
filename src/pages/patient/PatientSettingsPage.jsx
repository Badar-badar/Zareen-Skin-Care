import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Shield,
  CheckCircle2,
  Sparkles,
  Save,
  Lock,
} from 'lucide-react';
import Button from '../../components/ui/Button';

export const PatientSettingsPage = () => {
  const [toastMessage, setToastMessage] = useState('');

  // Notification states
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [marketingNews, setMarketingNews] = useState(false);
  const [prepReminders, setPrepReminders] = useState(true);

  // Privacy states
  const [shareSkinHistory, setShareSkinHistory] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Preferences updated successfully.');
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
          <span>Patient Preferences</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Account & Notification Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Control how you receive consultation alerts, appointment reminders, and privacy safeguards.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Appointment Notifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Communication & Reminders</h3>
              <p className="text-xs text-slate-500">
                Choose the channels you want us to use for automated appointment updates.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* SMS Reminders */}
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  SMS Text Reminders (24h & 2h before visit)
                </span>
                <span className="text-slate-500">
                  Receive instant SMS reminders on your mobile phone before every confirmed consultation.
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>

            {/* Email Summaries */}
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Email Visit Summaries & Invoices
                </span>
                <span className="text-slate-500">
                  Receive a structured PDF summary and doctor notes immediately after your appointment concludes.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailSummaries}
                onChange={(e) => setEmailSummaries(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>

            {/* Preparation Guidance */}
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Pre-Treatment Preparation Alerts
                </span>
                <span className="text-slate-500">
                  Helpful checklist on skin preparation (e.g. stopping retinoids, hydration tips before laser).
                </span>
              </div>
              <input
                type="checkbox"
                checked={prepReminders}
                onChange={(e) => setPrepReminders(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>

            {/* News & Tips */}
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Dermatologist Skin Care Insights & Articles
                </span>
                <span className="text-slate-500">
                  Occasional educational newsletters curated by certified skin specialists.
                </span>
              </div>
              <input
                type="checkbox"
                checked={marketingNews}
                onChange={(e) => setMarketingNews(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Privacy & Security */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Privacy & Care Record Access</h3>
              <p className="text-xs text-slate-500">
                Manage how your dermatological history is shared with your booked specialists.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Care History Sharing */}
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Share Skin History with Booked Specialists
                </span>
                <span className="text-slate-500">
                  Allows your confirmed doctors to review previous clinical notes for continuity of care.
                </span>
              </div>
              <input
                type="checkbox"
                checked={shareSkinHistory}
                onChange={(e) => setShareSkinHistory(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>

            {/* Two-Factor Authentication */}
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/60 cursor-pointer transition-colors">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 block text-sm">
                  Two-Factor Authentication (2FA)
                </span>
                <span className="text-slate-500">
                  Require a secure 6-digit verification code when logging into your patient portal.
                </span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Password & Security */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Security & Password</h3>
                <p className="text-xs text-slate-500">
                  Update your authentication password periodically to safeguard your health records.
                </p>
              </div>
            </div>
            <Button
              to="/auth/forgot-password"
              variant="outline"
              size="sm"
            >
              Change Password
            </Button>
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
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientSettingsPage;
