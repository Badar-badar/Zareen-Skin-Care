import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Award,
  Globe,
  Info,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Building2,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import { mockSpecialists } from '../../data/specialists';

export const SpecialistProfilePage = () => {
  const { id } = useParams();

  // Find specialist by ID, or fallback to the first specialist
  const specialist = useMemo(() => {
    return mockSpecialists.find((s) => s.id === id) || mockSpecialists[0];
  }, [id]);

  const currentDayName = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }, []);

  if (!specialist) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 bg-slate-50">
        <Container size="sm" className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Specialist Not Found</h2>
          <p className="text-slate-600 text-sm">
            We couldn&apos;t find the profile you were looking for.
          </p>
          <Button to="/specialists" variant="primary" size="md">
            Return to Directory
          </Button>
        </Container>
      </div>
    );
  }

  const {
    name,
    title,
    specialty,
    experience,
    rating,
    reviewCount,
    location,
    clinicName,
    address,
    image,
    availableToday,
    nextAvailable,
    bio,
    detailedServices = [],
    workingHours = {},
    qualifications = {},
    patientInfo = {},
  } = specialist;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen py-6 sm:py-10 pb-28 sm:pb-12">
      <Container>
        {/* ========================================================================= */}
        {/* BREADCRUMB NAVIGATION */}
        {/* ========================================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-teal-700 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/specialists" className="hover:text-teal-700 transition-colors">
            Specialists
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
            {name}
          </span>
        </nav>

        {/* ========================================================================= */}
        {/* 1. PROFILE HEADER CARD */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Portrait Image */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <img
                src={image}
                alt={name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md"
              />
              {availableToday && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white"></span>
                </span>
              )}
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 space-y-3.5 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100/80">
                      {specialty}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({reviewCount} reviews)</span>
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {name}
                  </h1>
                  <p className="text-sm font-medium text-teal-700">{title}</p>
                </div>

                {/* Primary CTA (Desktop) */}
                <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                  <Button
                    to={`/booking/${specialist.id}`}
                    variant="primary"
                    size="lg"
                    icon={Calendar}
                    iconPosition="left"
                    className="shadow-md shadow-teal-600/20"
                  >
                    Book Appointment
                  </Button>
                  <span className="text-[11px] text-slate-400 font-medium">
                    100% Free Online Booking
                  </span>
                </div>
              </div>

              {/* Location & Practice Meta */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-800">{clinicName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{address || location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <span>{experience}</span>
                </div>
              </div>

              {/* Availability Banner */}
              <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="text-teal-900 font-medium">
                    Next Available: <strong>{nextAvailable}</strong>
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Accepting New Patients
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* MAIN 2-COLUMN CONTENT: DETAILS ON LEFT, STICKY BOOKING HUB ON RIGHT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): About, Services, Hours, Qualifications, Patient Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* 2. ABOUT / BIOGRAPHY */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Info className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">About Specialist</h2>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {bio}
              </p>

              {/* Spoken Languages */}
              {qualifications.languages && qualifications.languages.length > 0 && (
                <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Languages spoken:</span>
                  </div>
                  {qualifications.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </motion.section>

            {/* 3. SERVICES & TREATMENT MENU */}
            <motion.section
              id="services-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Services & Treatments</h2>
                </div>
                <span className="text-xs text-slate-500">
                  {detailedServices.length} {detailedServices.length === 1 ? 'service' : 'services'} available
                </span>
              </div>

              <div className="space-y-4">
                {detailedServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-teal-300 hover:bg-white transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                          {service.description}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-lg font-bold text-slate-900">{service.price}</p>
                        <p className="text-[11px] text-slate-400 font-medium">Treatment Fee</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Duration: {service.duration}</span>
                      </div>

                      <Button
                        to={`/booking/${specialist.id}?service=${service.id}`}
                        variant="ghost"
                        size="sm"
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 p-0 hover:bg-transparent"
                        icon={ArrowRight}
                        iconPosition="right"
                      >
                        Book This Service
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-center gap-2.5 text-xs text-teal-800">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  <strong>Zareen Skin Care Guarantee:</strong> 100% free appointment reservation. Treatment pricing is settled directly at the specialist&apos;s clinic.
                </span>
              </div>
            </motion.section>

            {/* 4. WORKING HOURS & CLINIC SCHEDULE */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Working Hours & Availability</h2>
                </div>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Open Today
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {Object.entries(workingHours).map(([day, hours]) => {
                  const isToday = day === currentDayName;
                  const isClosed = hours.toLowerCase() === 'closed';

                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isToday
                          ? 'bg-teal-50/80 border-teal-200 font-semibold text-teal-950'
                          : 'bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isToday && <span className="w-2 h-2 rounded-full bg-teal-600"></span>}
                        <span>{day}</span>
                        {isToday && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                            (Today)
                          </span>
                        )}
                      </div>
                      <span className={isClosed ? 'text-slate-400 italic' : 'font-medium'}>
                        {hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* 5. EXPERIENCE & QUALIFICATIONS */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Qualifications & Credentials
                </h2>
              </div>

              <div className="space-y-4">
                {qualifications.education && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Medical Education
                      </h4>
                      <p className="text-sm text-slate-700 font-medium">{qualifications.education}</p>
                      {qualifications.residency && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Residency: {qualifications.residency}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {qualifications.certifications && qualifications.certifications.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Board Certifications
                      </h4>
                      <ul className="space-y-1 mt-1">
                        {qualifications.certifications.map((cert, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {qualifications.affiliations && qualifications.affiliations.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Hospital & Clinic Affiliations
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {qualifications.affiliations.map((aff, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                          >
                            {aff}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>

            {/* 6. PATIENT INFORMATION & POLICIES */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Info className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Patient Information & Policies
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900">Consultation Formats</h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {(patientInfo.formats || ['In-Person Clinic Visit']).map((format, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{format}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900">Cancellation Policy</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {patientInfo.cancellation || 'Free cancellation or reschedule with 24h advance notice.'}
                  </p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column (4 cols): Sticky Quick Booking Card (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg space-y-6">
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Free Instant Booking</span>
                </span>
                <h3 className="text-lg font-bold text-slate-900">Schedule Consultation</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select your service, choose an available time slot, and receive instant confirmation.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Next Opening</span>
                  <span className="font-bold text-teal-700">{nextAvailable}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Location</span>
                  <span className="font-medium text-slate-800 truncate max-w-[150px]">{location}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Platform Fee</span>
                  <span className="font-bold text-emerald-600">$0 (100% Free)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  to={`/booking/${specialist.id}`}
                  variant="primary"
                  size="lg"
                  icon={Calendar}
                  iconPosition="left"
                  className="w-full justify-center shadow-md shadow-teal-600/20"
                >
                  Book Appointment Now
                </Button>
                <p className="text-[11px] text-center text-slate-400">
                  No credit card required for reservation
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ========================================================================= */}
      {/* MOBILE STICKY BOTTOM BOOKING BAR */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={image}
              alt={name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{name}</p>
              <p className="text-[11px] text-teal-700 font-medium truncate">{nextAvailable}</p>
            </div>
          </div>

          <Button
            to={`/booking/${specialist.id}`}
            variant="primary"
            size="md"
            icon={Calendar}
            className="shrink-0 text-xs px-4 py-2.5 shadow-md shadow-teal-600/20"
          >
            Book Slot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpecialistProfilePage;
