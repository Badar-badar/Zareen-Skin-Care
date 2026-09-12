import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Search,
  Check,
  Star,
  ChevronDown,
  PhoneCall,
  Laptop,
  HeartHandshake,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import SectionHeading from '../../components/ui/SectionHeading';
import SpecialistCard from '../../components/specialist/SpecialistCard';
import { featuredSpecialists } from '../../data/specialists';
import { testimonials } from '../../data/testimonials';
import { faqs } from '../../data/faq';

export const HomePage = () => {
  const [openFaq, setOpenFaq] = useState('faq-1');

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-[#F7F2EB] via-[#FAF8F5] to-[#FAF7F2] border-b border-taupe-200/80">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-800 border border-sage-200/80 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>100% Free & Unlimited Skincare Appointment Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
                Beautiful Skin Care Starts With the{' '}
                <span className="text-sage-700 underline decoration-gold-400 decoration-wavy decoration-2 underline-offset-4">
                  Right Specialist.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover verified dermatologists, skin specialists, and aesthetic practitioners.
                Explore specialized services and schedule your consultations online with zero hassle and zero booking fees.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Button
                  to="/specialists"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full sm:w-auto shadow-md shadow-sage-700/20"
                >
                  Find a Specialist
                </Button>
                <Button
                  to="/for-specialists"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Join as a Specialist
                </Button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600" />
                  <span>Instant slot confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-600" />
                  <span>Verified credentials</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative aura with organic sage, blush & gold glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-sage-300 via-gold-200 to-blush-200 rounded-3xl blur-2xl opacity-35"></div>

                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden border border-taupe-200/90 shadow-xl bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                    alt="Dermatology consultation and skincare care"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent"></div>

                  {/* On-image caption badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-800 font-bold shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">Dr. Sophia Al-Mansoor</p>
                        <p className="text-[11px] text-sage-700 font-medium">Slot confirmed • Today, 3:30 PM</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sage-100 text-sage-900 border border-sage-200 uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white border border-taupe-200/90 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blush-100 text-blush-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">100% Free</p>
                    <p className="text-[10px] text-stone-500">Zero booking fee</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST / BENEFIT STRIP */}
      {/* ========================================================================= */}
      <section className="py-8 bg-white border-b border-slate-200/70">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Free</h4>
                <p className="text-xs text-slate-500">Zero commission or fees</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Unlimited Bookings</h4>
                <p className="text-xs text-slate-500">No caps for specialists</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Verified Profiles</h4>
                <p className="text-xs text-slate-500">Licensed dermatology experts</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Easy Scheduling</h4>
                <p className="text-xs text-slate-500">24/7 instant online booking</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <Container>
          <SectionHeading
            badge="Simple Process"
            title="How Zareen Skin Care Works"
            subtitle="Booking an appointment with a verified skin specialist takes four effortless steps."
            className="mb-12 sm:mb-16"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-extrabold text-lg">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900">Find a Specialist</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Search by dermatology specialty, aesthetic treatment, skin condition, or clinic location.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Search & Filter Directory</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-extrabold text-lg">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900">Choose a Service</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browse specialist service catalogs with clear consultation durations, details, and transparent pricing.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Custom Service Catalog</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-extrabold text-lg">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900">Select Date & Time</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select from live real-time available calendar slots that fit your personal schedule.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Real-Time Availability</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-extrabold text-lg">
                  04
                </div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Appointment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter basic contact info and receive immediate confirmation with easy reschedule options.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Instant Confirmation</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. FOR SPECIALISTS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200/70">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>For Dermatologists & Aesthetic Practitioners</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Streamline Your Practice With Zero Subscription Costs
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Zareen Skin Care empowers skin specialists to showcase their expertise, configure custom treatment menus, set precise working hours, and accept appointments without paying platform commissions.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Create Professional Profile</h4>
                    <p className="text-xs text-slate-500">Showcase credentials, clinic location, certifications, and high-res gallery.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Add Services & Treatment Menus</h4>
                    <p className="text-xs text-slate-500">Set custom service durations, preparation guidelines, and consultation fees.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Set Real-Time Availability</h4>
                    <p className="text-xs text-slate-500">Control weekly working hours, buffers between sessions, and time off.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Manage Appointments in One Hub</h4>
                    <p className="text-xs text-slate-500">Track upcoming bookings, reschedule easily, and maintain organized patient history.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  to="/for-specialists"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Join Zareen Skin Care
                </Button>
              </div>
            </div>

            {/* Right Interactive Preview with Clinical Visual Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-taupe-200/90 shadow-2xl bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1000"
                  alt="Specialist dermatology consultation workstation"
                  className="w-full h-80 sm:h-[440px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent" />

                {/* Overlaid Specialist Live Active Card */}
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg text-stone-900">
                    <div className="flex items-center justify-between pb-3 border-b border-taupe-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sage-600 text-white flex items-center justify-center font-bold text-xs">
                          <Sparkles className="w-4 h-4 text-gold-200" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">Specialist Hub Live</p>
                          <p className="text-[10px] text-sage-700 font-medium">Real-Time Calendar Synchronization</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sage-100 text-sage-900 border border-sage-200">
                        100% Free
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-3">
                      <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-taupe-200/60">
                        <p className="text-[10px] text-stone-500 font-medium">Upcoming Today</p>
                        <p className="text-sm font-extrabold text-stone-900">8 Consultations</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-taupe-200/60">
                        <p className="text-[10px] text-stone-500 font-medium">Platform Fees</p>
                        <p className="text-sm font-extrabold text-sage-700">$0.00 (Zero)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED SPECIALISTS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              badge="Top Rated"
              title="Featured Skin Specialists"
              subtitle="Connect with certified dermatologists and experienced skincare experts available for consultations."
              align="left"
              className="max-w-xl"
            />
            <Button
              to="/specialists"
              variant="outline"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              className="shrink-0 self-start md:self-auto"
            >
              View All Specialists
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSpecialists.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5.5 PANORAMIC SKINCARE AMBIANCE BANNER */}
      {/* ========================================================================= */}
      <section className="py-6 sm:py-10 bg-[#FAF8F5]">
        <Container>
          <div className="relative rounded-3xl overflow-hidden border border-taupe-200/90 shadow-xl bg-white group">
            <div className="relative h-64 sm:h-80 lg:h-[380px] w-full">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1600"
                alt="Bespoke Skincare and Aesthetic Clinical Studio"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-900/50 to-transparent" />

              <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-between max-w-2xl text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                  Holistic Dermatology & Clinical Aesthetics
                </span>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    Where Clinical Expertise Meets Calm, Botanical Care
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-lg">
                    Every specialist on Zareen is credential-verified. Explore comprehensive Acne, Anti-Aging, Laser, and Pediatric dermatology services with transparent consultation lengths.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    to="/specialists"
                    variant="gold"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Browse Specialist Profiles
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY ZAREEN SKIN CARE */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-t border-taupe-200/70">
        <Container>
          <SectionHeading
            badge="Our Advantages"
            title="Why Choose Zareen Skin Care"
            subtitle="Engineered specifically for the unique workflows of dermatologists and skin aesthetic professionals."
            className="mb-12 sm:mb-16"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-taupe-200/80 hover:border-sage-400 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Completely Free</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                No hidden costs, no subscription fees, and no per-appointment booking charges for patients or providers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-taupe-200/80 hover:border-sage-400 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">No Booking Limits</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Receive unlimited monthly appointments without artificial restrictions or premium paywalls.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-taupe-200/80 hover:border-sage-400 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Simple Scheduling</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Patients pick accurate time slots in seconds without frustrating phone tag or back-and-forth emails.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-taupe-200/80 hover:border-sage-400 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blush-100 text-blush-800 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Appointment Management</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Easily reschedule, cancel, or modify appointments with automatic schedule sync and clarity.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-taupe-200/80 hover:border-sage-400 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Mobile Friendly</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Fully responsive design tested across smartphones, tablets, and desktops for smooth access on any device.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-taupe-200/80 hover:border-sage-400 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-800 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Tailored for Skin Care</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Customized for clinical dermatology, cosmetic aesthetics, and wellness practitioners rather than generic clinics.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 7. PATIENT EXPERIENCE WITH RADIANT SKIN VISUAL */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#1E2522] text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content with Portrait Visual */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-gold-300 border border-white/15">
                <HeartHandshake className="w-3.5 h-3.5 text-gold-400" />
                <span>Patient-First Approach</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                A Seamless Journey From Discovery to Radiant Skin
              </h2>

              <p className="text-base text-stone-300 leading-relaxed">
                We believe scheduling skin care consultations should be stress-free, transparent, and completely accessible with zero platform markups.
              </p>

              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-xl max-h-72">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000"
                  alt="Glowing radiant patient skin care consultation"
                  className="w-full h-72 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-md text-stone-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                    <span className="text-xs font-bold">100% Free Instant Confirmation</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-sage-800 bg-sage-100 px-2 py-0.5 rounded-md">
                    No Credit Card
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  to="/specialists"
                  variant="gold"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Book Your Consultation
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sage-500/20 text-sage-300 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Transparent Details</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Review specialist bios, credentials, service durations, and clinic addresses before booking.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">No Waiting on Hold</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Avoid long phone calls and busy clinic lines by self-scheduling directly on your phone or laptop.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sage-500/20 text-sage-300 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Flexible Rescheduling</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Change or adjust your appointment time effortlessly without friction or cancellation penalties.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blush-500/20 text-blush-300 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Instant Notifications</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Receive immediate confirmation with details and helpful pre-treatment reminders.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 8. TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <Container>
          <SectionHeading
            badge="Community Stories"
            title="Trusted by Patients & Practitioners"
            subtitle="Read what patients and skin specialists say about their scheduling experience with Zareen Skin Care."
            className="mb-12 sm:mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  {/* Quote content */}
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-teal-500/20"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.treatment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 9. FAQ PREVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/70">
        <Container size="sm">
          <SectionHeading
            badge="Got Questions?"
            title="Frequently Asked Questions"
            subtitle="Find quick answers about appointment bookings, specialist catalogs, and platform features."
            className="mb-10 sm:mb-14"
          />

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-teal-700 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-teal-600' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 mb-3">
              Still have questions about how Zareen Skin Care works?
            </p>
            <Button to="/faq" variant="outline" size="sm">
              Visit Full FAQ Center
            </Button>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL CTA */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>

        <Container size="sm" className="relative text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-teal-100 border border-white/15 backdrop-blur-md mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Start Free Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ready to Make Appointments Simpler?
          </h2>

          <p className="text-base sm:text-lg text-teal-100/90 max-w-xl mx-auto leading-relaxed">
            Whether you are looking for trusted dermatological care or want to streamline your skincare practice, Zareen Skin Care makes scheduling completely free and effortless.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              to="/specialists"
              variant="secondary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto bg-white text-teal-900 hover:bg-teal-50"
            >
              Find a Specialist
            </Button>
            <Button
              to="/for-specialists"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              Join as a Specialist
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
