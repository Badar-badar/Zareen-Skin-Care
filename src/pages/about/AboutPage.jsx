import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Users,
  CalendarCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Search,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import Button from '../../components/ui/Button';

export const AboutPage = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH VISUAL IMAGE BANNER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-800 border border-sage-200/80 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Our Mission & Principles</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight"
            >
              Democratizing Access to Expert Skin Health at{' '}
              <span className="text-sage-700 underline decoration-gold-400 decoration-wavy decoration-2 underline-offset-4">
                Zero Cost.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto"
            >
              Zareen Skin Care was founded to bridge the gap between world-class dermatologists, skin specialists, and patients through a completely free, frictionless appointment platform.
            </motion.p>
          </div>

          {/* Panoramic Visual Image Banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 relative rounded-3xl overflow-hidden border border-taupe-200/90 shadow-xl bg-white group"
          >
            <div className="relative h-64 sm:h-96 lg:h-[420px] w-full">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600"
                alt="Modern Dermatology and Aesthetic Clinic"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/25 to-transparent" />

              {/* Banner Badge Overlays */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-300" />
                    Clinical Excellence Standards
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Connecting Patients with Board-Certified Skin Care Experts
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm text-stone-900 text-center">
                    <p className="text-base sm:text-lg font-black text-sage-800">100%</p>
                    <p className="text-[10px] uppercase font-bold text-stone-500">Free Booking</p>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm text-stone-900 text-center">
                    <p className="text-base sm:text-lg font-black text-gold-700">4.9/5</p>
                    <p className="text-[10px] uppercase font-bold text-stone-500">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHAT IS ZAREEN & WHY IT EXISTS */}
      {/* ========================================================================= */}
      <section>
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                badge="What is Zareen?"
                title="A Modern Platform Built for Pure Medical Clarity"
                subtitle="Traditional booking tools are cluttered with excessive subscription tiers, advertising auctions, and hidden convenience fees. We took a radically different approach."
              />

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Skin health is an essential pillar of overall well-being. Yet, booking a consultation with a board-certified dermatologist or aesthetic professional often entails confusing directories, out-of-date clinic hours, or phone tag.
                </p>
                <p>
                  <strong>Zareen Skin Care</strong> solves this by equipping specialists with free digital booking portals and giving patients real-time visibility into verified schedules, service menus, and direct consultation booking.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-sage-50/80 border border-sage-200/80">
                  <span className="text-2xl sm:text-3xl font-extrabold text-sage-900 block">100%</span>
                  <span className="text-xs text-stone-600 font-medium">Free Platform Access</span>
                </div>
                <div className="p-4 rounded-2xl bg-blush-50/80 border border-blush-200/80">
                  <span className="text-2xl sm:text-3xl font-extrabold text-blush-900 block">Zero</span>
                  <span className="text-xs text-stone-600 font-medium">Booking Commissions</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-taupe-200/90 shadow-xl bg-white">
                <img
                  src="https://images.unsplash.com/photo-1512290900672-1f02e6093fb1?auto=format&fit=crop&q=80&w=900"
                  alt="Organic botanical skin care and aesthetics"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md">
                    <HeartHandshake className="w-3.5 h-3.5 text-gold-300" />
                    <span>The Free Platform Guarantee</span>
                  </span>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                    Zero Fees. Total Transparency for All.
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed">
                    No monthly SaaS fees for doctors. No convenience fees for patients. Pure medical coordination without monetization paywalls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT HELPS SPECIALISTS & PATIENTS */}
      {/* ========================================================================= */}
      <section className="bg-slate-50/60 py-16 sm:py-20 border-y border-slate-200/80">
        <Container size="lg">
          <SectionHeading
            badge="Ecosystem Value"
            title="Designed for Both Sides of Skin Care"
            subtitle="Explore how Zareen empowers clinical practitioners while providing seamless experiences for patients."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {/* For Specialists Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs space-y-6 hover:shadow-xs transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">How It Helps Specialists</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Elevate your practice with automated schedule management and an attractive digital booking presence.
                </p>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Personalized Booking Page:</strong> Share your unique profile URL on social channels or clinic websites.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Service & Duration Customization:</strong> Define specific appointment types, pricing, and prep instructions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Automated Availability Engine:</strong> Set weekly hours, buffer gaps, and block blackout vacation days seamlessly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Calendar Schedule Management:</strong> View month, week, and daily consultation streams with zero double bookings.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Button to="/auth/register" variant="primary" size="md" icon={ArrowRight}>
                  Join as a Specialist
                </Button>
              </div>
            </div>

            {/* For Patients Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs space-y-6 hover:shadow-xs transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">How It Helps Patients</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Find the right specialist for your specific skin health concern with verified clarity and zero friction.
                </p>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Verified Medical Credentials:</strong> Discover board-certified dermatologists and aesthetic specialists.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Live Availability Slots:</strong> Pick dates and times that fit your schedule without back-and-forth calls.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Booking Markup:</strong> Experience totally free appointment reservation directly into doctor calendars.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Patient Care Portal:</strong> Manage your upcoming consultations, reschedule when needed, and review past visits.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Button to="/specialists" variant="outline" size="md" icon={Search}>
                  Find a Specialist
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE VALUES */}
      {/* ========================================================================= */}
      <section>
        <Container size="lg">
          <SectionHeading
            badge="Our Values"
            title="Principles That Guide Every Feature We Build"
            subtitle="We are committed to privacy, transparent healthcare communication, and clinical excellence."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Verified Practitioners</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                All specialists undergo administrative medical credential review to ensure legitimate patient safety.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Privacy by Design</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Patient intake notes and consultation appointments are kept strictly confidential between patient and doctor.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Reliable Scheduling</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant slot reservation, real-time buffer management, and automated reminders prevent missed visits.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. FINAL CTA BANNER */}
      {/* ========================================================================= */}
      <section>
        <Container size="lg">
          <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Experience Free Skin Care Scheduling?
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl mx-auto leading-relaxed">
              Whether you are a certified dermatologist seeking a free booking hub or a patient looking for care, Zareen Skin Care is ready for you.
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

export default AboutPage;
