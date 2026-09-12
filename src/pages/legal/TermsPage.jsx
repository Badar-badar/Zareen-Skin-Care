import {
  Sparkles,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import Container from '../../components/ui/Container';

export const TermsPage = () => {
  return (
    <div className="py-8 sm:py-12 space-y-10">
      <Container size="md">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            <span>Platform Governance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm text-slate-500">
            Effective Date: September 1, 2026 • Last Updated: September 2026
          </p>
        </div>

        {/* Notice Card */}
        <div className="mt-8 p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-teal-900 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            <strong>Free Platform Notice:</strong> Zareen Skin Care is a completely free appointment scheduling software platform designed for licensed skin specialists and patients. We charge zero platform booking fees or doctor subscriptions.
          </span>
        </div>

        {/* Content Sections */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">1</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p>
              By accessing or using the Zareen Skin Care website, mobile applications, or appointment booking services (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">2</span>
              <span>Platform Role & Medical Disclaimer</span>
            </h2>
            <p>
              Zareen Skin Care provides technological infrastructure enabling patients to locate independent skin specialists, review clinical service catalogs, and book appointments.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950 text-xs space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Medical Advice Disclaimer</span>
              </span>
              <p>
                Zareen Skin Care is not a healthcare provider and does not practice medicine. Any medical diagnoses, prescriptions, treatment decisions, and clinical services are rendered solely and independently by the licensed practitioner you choose to consult.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">3</span>
              <span>Specialist Obligations & Licensure</span>
            </h2>
            <p>
              Practitioners registering on Zareen Skin Care warrant and represent that they hold valid, active medical licenses or aesthetic certifications required in their operating jurisdiction. Specialists are solely responsible for setting accurate service descriptions, fees, availability hours, and maintaining confidentiality standards.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">4</span>
              <span>Patient Appointments & Cancellations</span>
            </h2>
            <p>
              Patients agree to provide accurate contact information for consultation coordination. While Zareen Skin Care facilitates instant reservations at zero platform cost, patients agree to adhere to individual clinic cancellation and rescheduling notice windows.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">5</span>
              <span>User Conduct & Platform Integrity</span>
            </h2>
            <p>
              Users agree not to misuse the platform, attempt unauthorized access to accounts, submit fraudulent appointments, or disrupt system availability. We reserve the right to suspend accounts that violate professional care conduct.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">6</span>
              <span>Questions & Legal Inquiries</span>
            </h2>
            <p>
              If you have questions regarding these Terms of Service or platform governance, please contact our administrative team at <a href="mailto:legal@zareenskincare.com" className="text-teal-700 font-bold hover:underline">legal@zareenskincare.com</a>.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default TermsPage;
