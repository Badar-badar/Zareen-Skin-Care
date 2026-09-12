import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Layers,
  Calendar,
  Clock,
  CheckCircle2,
  UserPlus,
  FileBadge,
  Sliders,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import Button from '../../components/ui/Button';

const patientSteps = [
  {
    step: '01',
    title: 'Discover & Compare Specialists',
    icon: Search,
    description:
      'Search our directory of verified clinical dermatologists and aesthetic practitioners by specialty, city, clinical focus, or real-time availability.',
    details: 'Browse doctor bios, clinic addresses, board certifications, and verified credentials.',
  },
  {
    step: '02',
    title: 'Select Clinical Service',
    icon: Layers,
    description:
      'Review the specialist’s comprehensive treatment catalog, including customized Acne Protocols, Laser Resurfacing, Mole Mapping, or General Consultations.',
    details: 'Full transparency into consultation length (e.g. 45 mins), fee breakdown, and visit mode (In-Person vs Virtual).',
  },
  {
    step: '03',
    title: 'Choose Available Date',
    icon: Calendar,
    description:
      'Access real-time calendar dates synchronized directly with the doctor’s clinic schedule. No conflicting bookings or outdated availability.',
    details: 'Easily select Today, Tomorrow, or upcoming weeks at your convenience.',
  },
  {
    step: '04',
    title: 'Pick Exact Time Slot',
    icon: Clock,
    description:
      'Select a dedicated morning or afternoon consultation slot that fits your schedule without phone call delays.',
    details: 'Slots are reserved in real time with built-in buffer intervals.',
  },
  {
    step: '05',
    title: 'Instant Confirmation & Reminders',
    icon: CheckCircle2,
    description:
      'Enter basic contact information and intake notes. Receive immediate digital confirmation with zero platform convenience fees.',
    details: 'Automated SMS and email reminders keep you on track with pre-treatment instructions.',
  },
];

const specialistSteps = [
  {
    step: '01',
    title: 'Register Free Practice Account',
    icon: UserPlus,
    description:
      'Sign up in under 2 minutes. Enter your medical license details and clinic contact information with zero subscription cost.',
    details: '100% free forever. No credit card required, no monthly software bills.',
  },
  {
    step: '02',
    title: 'Build Your Verified Profile',
    icon: FileBadge,
    description:
      'Personalize your professional biography, showcase your years of clinical experience, hospital affiliations, and board qualifications.',
    details: 'Receive the official Zareen Verified badge once credentials are validated.',
  },
  {
    step: '03',
    title: 'Configure Treatment Services',
    icon: Sliders,
    description:
      'Define your service menu with custom titles, procedure descriptions, consultation lengths, and professional fee structures.',
    details: 'Specify pre-treatment patient instructions and in-person or telehealth visit options.',
  },
  {
    step: '04',
    title: 'Set 7-Day Working Availability',
    icon: CalendarDays,
    description:
      'Customize your operating hours, lunch break windows, appointment buffer intervals, and blackout vacation dates.',
    details: 'The scheduling engine automatically prevents overlapping bookings.',
  },
  {
    step: '05',
    title: 'Receive & Manage Patient Bookings',
    icon: CheckCircle2,
    description:
      'Track appointments across interactive month, week, and daily timeline views. Reschedule, complete, or review patient notes seamlessly.',
    details: 'Direct dashboard notifications alert you to new and modified consultation slots.',
  },
];

export const HowItWorksPage = () => {
  const [activeTab, setActiveTab] = useState('patient'); // 'patient' | 'specialist'

  const currentSteps = activeTab === 'patient' ? patientSteps : specialistSteps;

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* ========================================================================= */}
      {/* 1. HERO & FLOW TOGGLE WITH IMAGE BANNER */}
      {/* ========================================================================= */}
      <section>
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-800 border border-sage-200/80 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Step-by-Step Experience</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight"
            >
              How Zareen Skin Care Works for{' '}
              <span className="text-sage-700 underline decoration-gold-400 decoration-wavy decoration-2 underline-offset-4">
                {activeTab === 'patient' ? 'Patients' : 'Specialists'}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed"
            >
              Discover how our zero-fee scheduling workflow streamlines patient care coordination and empowers clinical practices.
            </motion.p>

            {/* Interactive Flow Switcher Tabs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex p-1.5 rounded-2xl bg-cream-100 border border-taupe-200/80 shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setActiveTab('patient')}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'patient'
                    ? 'bg-sage-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                For Patients (Booking Flow)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specialist')}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'specialist'
                    ? 'bg-sage-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                For Specialists (Practice Setup)
              </button>
            </motion.div>
          </div>

          {/* Dynamic Image Banner */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 relative rounded-3xl overflow-hidden border border-taupe-200/90 shadow-xl bg-white group"
          >
            <div className="relative h-64 sm:h-80 lg:h-96 w-full">
              <img
                src={
                  activeTab === 'patient'
                    ? 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1600'
                    : 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1600'
                }
                alt={activeTab === 'patient' ? 'Patient skin consultation' : 'Doctor practice setup'}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-300" />
                    {activeTab === 'patient' ? '5 Simple Steps to Radiant Skin' : '3 Minutes to Complete Digital Setup'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {activeTab === 'patient'
                      ? 'Find Your Ideal Dermatologist in Real Time'
                      : 'Equip Your Practice With Zero Software Bills'}
                  </h3>
                </div>

                <Button
                  to={activeTab === 'patient' ? '/specialists' : '/for-specialists'}
                  variant="gold"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {activeTab === 'patient' ? 'Explore Specialists' : 'Join as Specialist'}
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. VISUAL STEP-BY-STEP PROCESS */}
      {/* ========================================================================= */}
      <section>
        <Container size="lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
                {currentSteps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-teal-200 transition-all flex flex-col justify-between space-y-4 relative group"
                    >
                      {/* Step Badge */}
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 font-extrabold text-xs flex items-center justify-center border border-teal-100">
                          {item.step}
                        </span>
                        <div className="w-9 h-9 rounded-2xl bg-slate-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-2 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-teal-900 font-medium leading-normal">
                        {item.details}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Banner below the steps */}
              <div className="p-6 sm:p-8 rounded-3xl bg-teal-50/70 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-teal-950">
                      {activeTab === 'patient'
                        ? 'Zero Surcharges for Patients'
                        : 'Free Forever with Zero Platform Commissions'}
                    </h4>
                    <p className="text-xs text-teal-800">
                      {activeTab === 'patient'
                        ? 'You only pay the specialist for your medical treatment at the clinic. Zareen is 100% free.'
                        : 'No monthly software subscription, no setup costs, and no fees deducted from your practice.'}
                    </p>
                  </div>
                </div>

                <Button
                  to={activeTab === 'patient' ? '/specialists' : '/auth/register'}
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  className="shrink-0"
                >
                  {activeTab === 'patient' ? 'Find a Specialist Now' : 'Join as a Specialist'}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. COMPARISON & BENEFITS HIGHLIGHT */}
      {/* ========================================================================= */}
      <section className="bg-slate-50/60 py-16 border-y border-slate-200/80">
        <Container size="lg">
          <SectionHeading
            badge="Direct Connection"
            title="The Modern Standard for Dermatology Scheduling"
            subtitle="Comparing the traditional clinic booking friction with the streamlined Zareen experience."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            {/* Old Way */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-red-200/80 shadow-2xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
                Traditional Booking Hassle
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Calling clinic receptionists during busy office hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Unclear service durations and hidden third-party booking fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Doctors paying $150–$300/month just for basic scheduling SaaS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Missed appointments due to lack of automated SMS reminders</span>
                </li>
              </ul>
            </div>

            {/* Zareen Way */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-teal-300 shadow-2xs space-y-4 relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                The Zareen Skin Care Experience
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>24/7 Real-Time Online Booking:</strong> Confirm slots in seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Platform Surcharges:</strong> 100% free for patients and specialists.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Custom Clinical Catalog:</strong> Precise durations, pricing, and prep instructions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automated Reminders:</strong> Direct patient alerts reduce no-shows.</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section>
        <Container size="lg">
          <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Start Booking Skin Care Consultations in Seconds
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl mx-auto leading-relaxed">
              Find top-rated dermatologists, pick an open date and time slot, and confirm your appointment with zero friction.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button to="/specialists" variant="primary" size="lg" icon={Search}>
                Find a Specialist
              </Button>
              <Button to="/auth/register" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Join as a Specialist
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HowItWorksPage;
