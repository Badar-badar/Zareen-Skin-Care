import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Star,
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import { mockSpecialists } from '../../data/specialists';

const bookingSchema = z.object({
  patientName: z
    .string()
    .min(2, { message: 'Please enter your full name (at least 2 characters)' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  patientEmail: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  patientPhone: z
    .string()
    .min(7, { message: 'Please enter a valid phone number' })
    .max(20, { message: 'Phone number is too long' }),
  intakeNotes: z.string().max(500, { message: 'Notes cannot exceed 500 characters' }).optional(),
});

let refCounter = 4820;
const generateBookingReference = () => {
  refCounter += 1;
  return `ZRN-${refCounter}`;
};

export const BookingPage = () => {
  const { id } = useParams();

  // Find specialist by ID or default to first
  const specialist =
    mockSpecialists.find((s) => s.id === id) || mockSpecialists[0];

  // Booking Wizard Steps: 1: Service -> 2: Date & Time -> 3: Patient Details -> 4: Confirmed
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(
    specialist.detailedServices ? specialist.detailedServices[0] : null
  );
  const [selectedDate, setSelectedDate] = useState('2026-09-10');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [bookingReference, setBookingReference] = useState('ZRN-4820');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientName: 'Seraphina Lin',
      patientEmail: 'seraphina.lin@example.com',
      patientPhone: '+1 (555) 234-5678',
      intakeNotes: 'Consultation for skin texture refinement and topical barrier check.',
    },
  });

  const availableDates = [
    { dateStr: '2026-09-10', label: 'Tomorrow', day: 'Thu, Sep 10', slotsCount: 6 },
    { dateStr: '2026-09-11', label: 'Friday', day: 'Fri, Sep 11', slotsCount: 5 },
    { dateStr: '2026-09-12', label: 'Saturday', day: 'Sat, Sep 12', slotsCount: 4 },
    { dateStr: '2026-09-14', label: 'Monday', day: 'Mon, Sep 14', slotsCount: 7 },
    { dateStr: '2026-09-15', label: 'Tuesday', day: 'Tue, Sep 15', slotsCount: 8 },
  ];

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '11:45 AM',
    '01:30 PM',
    '02:45 PM',
    '04:00 PM',
    '05:15 PM',
  ];

  const onConfirmBooking = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setBookingReference(generateBookingReference());
    setStep(4);
  };

  return (
    <div className="py-8 sm:py-12 space-y-8">
      <Container size="lg">
        {/* Step Indicator Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Direct Clinical Scheduling</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {step === 4 ? 'Appointment Confirmed!' : 'Book Your Consultation'}
          </h1>

          {step !== 4 && (
            <p className="text-xs sm:text-sm text-slate-500">
              Select your treatment, pick a time slot with {specialist.name}, and confirm your appointment with zero platform fees.
            </p>
          )}

          {/* Progress Bar Steps */}
          {step !== 4 && (
            <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold text-slate-500">
              <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>
                1. Service
              </span>
              <span className="text-slate-300">→</span>
              <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>
                2. Date & Time
              </span>
              <span className="text-slate-300">→</span>
              <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>
                3. Your Details
              </span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="mt-8 max-w-4xl mx-auto">
          {/* ========================================================================= */}
          {/* STEP 4: SUCCESS CONFIRMATION SCREEN */}
          {/* ========================================================================= */}
          {step === 4 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-6 sm:p-12 border border-teal-200/80 shadow-lg text-center space-y-8"
            >
              <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                  Reference: {bookingReference}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Your Booking is Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  We have sent a digital confirmation and clinic preparation instructions to{' '}
                  <strong>{getValues('patientEmail')}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 max-w-lg mx-auto text-left space-y-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80">
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900">{specialist.name}</h3>
                    <p className="text-xs text-teal-700 font-medium">{specialist.specialty}</p>
                    <p className="text-[11px] text-slate-500">{specialist.clinicName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Appointment Slot</span>
                    <span className="font-bold text-slate-900">{selectedDate} at {selectedTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Treatment</span>
                    <span className="font-bold text-slate-900">{selectedService?.name || 'General Consultation'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-slate-500">Service Fee (Pay at clinic):</span>
                  <span className="font-bold text-teal-800 text-base">{selectedService?.price || '$180'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button to="/patient/appointments" variant="primary" size="md">
                  View in Patient Portal
                </Button>
                <Button to="/" variant="outline" size="md">
                  Return Home
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Doctor Summary Card */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-50 shadow-xs"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{specialist.name}</h2>
                    <p className="text-xs text-teal-700 font-medium">{specialist.specialty}</p>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{specialist.rating} ({specialist.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{specialist.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Board-Certified • Verified Licensure</span>
                  </p>
                </div>

                {/* Booking Preview Box */}
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2 text-xs">
                  <span className="font-bold text-teal-950 block">Reservation Summary</span>
                  {selectedService && (
                    <div className="text-slate-700">
                      <span className="font-semibold block">{selectedService.name}</span>
                      <span className="text-slate-500">{selectedService.duration} • {selectedService.price}</span>
                    </div>
                  )}
                  {step >= 2 && (
                    <div className="text-teal-900 font-semibold pt-1 border-t border-teal-100">
                      📅 {selectedDate} at {selectedTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Wizard Content Form Container */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
                {/* STEP 1: SERVICE SELECTION */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-base font-bold text-slate-900">Step 1: Select Treatment / Service</h2>
                      <p className="text-xs text-slate-500">Choose the specific consultation or procedure you wish to book.</p>
                    </div>

                    <div className="space-y-3">
                      {(specialist.detailedServices || []).map((srv) => {
                        const isSelected = selectedService?.id === srv.id;
                        return (
                          <div
                            key={srv.id}
                            onClick={() => setSelectedService(srv)}
                            className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                              isSelected
                                ? 'bg-teal-50/40 border-teal-500 shadow-xs ring-1 ring-teal-500'
                                : 'bg-white border-slate-200/80 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-slate-900">{srv.name}</h3>
                              <span className="text-sm font-bold text-teal-700">{srv.price}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{srv.description}</p>
                            <span className="text-[11px] font-semibold text-slate-400 block pt-1">
                              Duration: {srv.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        icon={ArrowRight}
                        disabled={!selectedService}
                        onClick={() => setStep(2)}
                      >
                        Continue to Date & Time
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: DATE & TIME SELECTION */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-base font-bold text-slate-900">Step 2: Choose Date & Time Slot</h2>
                      <p className="text-xs text-slate-500">Select an available day and appointment time.</p>
                    </div>

                    {/* Date Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Available Days</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {availableDates.map((d) => {
                          const isSelected = selectedDate === d.dateStr;
                          return (
                            <button
                              key={d.dateStr}
                              type="button"
                              onClick={() => setSelectedDate(d.dateStr)}
                              className={`p-3 rounded-2xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                                  : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                                {d.label}
                              </span>
                              <span className="text-xs font-bold block mt-0.5">{d.day}</span>
                              <span className={`text-[10px] block mt-1 ${isSelected ? 'text-teal-100' : 'text-teal-700'}`}>
                                {d.slotsCount} open slots
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-slate-700">Available Consultation Times</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((time) => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        icon={ArrowLeft}
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        icon={ArrowRight}
                        onClick={() => setStep(3)}
                      >
                        Continue to Details
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PATIENT INFORMATION & CONFIRMATION */}
                {step === 3 && (
                  <form onSubmit={handleSubmit(onConfirmBooking)} className="space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-base font-bold text-slate-900">Step 3: Patient Information</h2>
                      <p className="text-xs text-slate-500">
                        Enter your contact info so the specialist can confirm your booking.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="patientName" className="block font-semibold text-slate-700">
                          Full Legal Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="patientName"
                            type="text"
                            {...register('patientName')}
                            className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                          />
                        </div>
                        {errors.patientName && (
                          <p className="text-[11px] text-red-600 font-medium">{errors.patientName.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="patientEmail" className="block font-semibold text-slate-700">
                          Email Address for Confirmation <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="patientEmail"
                            type="email"
                            {...register('patientEmail')}
                            className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                          />
                        </div>
                        {errors.patientEmail && (
                          <p className="text-[11px] text-red-600 font-medium">{errors.patientEmail.message}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label htmlFor="patientPhone" className="block font-semibold text-slate-700">
                          Mobile Phone (For SMS reminders) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="patientPhone"
                            type="tel"
                            {...register('patientPhone')}
                            className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                          />
                        </div>
                        {errors.patientPhone && (
                          <p className="text-[11px] text-red-600 font-medium">{errors.patientPhone.message}</p>
                        )}
                      </div>

                      {/* Intake Notes */}
                      <div className="space-y-1.5">
                        <label htmlFor="intakeNotes" className="block font-semibold text-slate-700">
                          Primary Skin Concern or Symptoms (Optional)
                        </label>
                        <textarea
                          id="intakeNotes"
                          rows={3}
                          {...register('intakeNotes')}
                          placeholder="Describe symptoms, skin sensitivity, or previous treatments..."
                          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                        />
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        icon={ArrowLeft}
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={isSubmitting}
                        className="shadow-md shadow-teal-700/20"
                      >
                        Confirm Free Booking
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BookingPage;
