import {
  ShieldCheck,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import Container from '../../components/ui/Container';

export const PrivacyPage = () => {
  return (
    <div className="py-8 sm:py-12 space-y-10">
      <Container size="md">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Data Protection & Trust</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-slate-500">
            Effective Date: September 1, 2026 • Last Updated: September 2026
          </p>
        </div>

        {/* Commitment Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-teal-900 flex items-start gap-3">
          <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            <strong>Our Core Privacy Promise:</strong> Zareen Skin Care never sells or monetizes patient health information or specialist booking logs. Information is processed strictly to facilitate direct clinical appointment coordination.
          </span>
        </div>

        {/* Content Body */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">1</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              To operate our scheduling platform effectively, we collect information you provide directly:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-slate-600">
              <li>
                <strong>Patient Booking Data:</strong> Full name, email address, contact phone number, chosen service, preferred time slots, and optional pre-consultation notes.
              </li>
              <li>
                <strong>Specialist Practice Data:</strong> Doctor name, specialty classification, clinic address, professional credentials, service menus, and calendar availability hours.
              </li>
              <li>
                <strong>Technical Usage Data:</strong> Browser type, device details, and standard server log metrics to maintain platform reliability and prevent fraudulent requests.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">2</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>
              Information collected through Zareen Skin Care is used exclusively to:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Reserve consultation slots directly in the specialist’s schedule.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Send automated SMS and email appointment reminders & preparation instructions.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Allow patients and doctors to reschedule or manage appointments in real time.</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>Sharing of Information</span>
            </h2>
            <p>
              When a patient books an appointment, their name, contact details, and intake notes are transmitted solely to the booked specialist and their authorized clinic staff for consultation preparation. We do not sell, rent, or share personal data with external advertising networks.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">4</span>
              <span>Security & Data Protection</span>
            </h2>
            <p>
              We implement industry-standard encryption protocols (TLS/SSL in transit) and access control safeguards to protect personal information against unauthorized disclosure, alteration, or destruction.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">5</span>
              <span>Your Privacy Rights</span>
            </h2>
            <p>
              You have the right to request access to your appointment history, request correction of inaccurate contact information, or request the deletion of your patient account by contacting us at <a href="mailto:privacy@zareenskincare.com" className="text-teal-700 font-bold hover:underline">privacy@zareenskincare.com</a>.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPage;
