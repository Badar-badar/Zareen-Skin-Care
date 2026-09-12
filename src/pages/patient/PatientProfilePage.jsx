import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Save,
  MapPin,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockPatientProfile } from '../../data/appointments';

// Zod Schema for Patient Profile Form
const patientProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters long' })
    .max(50, { message: 'Full name cannot exceed 50 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(7, { message: 'Phone number must be at least 7 characters' })
    .max(20, { message: 'Phone number is too long' }),
  skinType: z.string().min(1, { message: 'Please select a skin type' }),
  primaryConcern: z.string().min(2, { message: 'Please specify your primary skin concern' }),
  emergencyContactName: z.string().min(2, { message: 'Emergency contact name is required' }),
  emergencyContactPhone: z.string().min(7, { message: 'Emergency contact phone is required' }),
  address: z.string().min(5, { message: 'Please enter your address' }),
});

export const PatientProfilePage = () => {
  const [profile, setProfile] = useState(mockPatientProfile);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      skinType: profile.skinType,
      primaryConcern: profile.primaryConcern,
      emergencyContactName: profile.emergencyContactName,
      emergencyContactPhone: profile.emergencyContactPhone,
      address: profile.address,
    },
  });

  const onSubmit = async (data) => {
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    setProfile((prev) => ({ ...prev, ...data }));
    reset(data);
    showToast('Patient profile updated successfully.');
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
          <span>Patient Account</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Personal Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your contact information, emergency details, and clinical preferences.
        </p>
      </div>

      {/* Patient Card Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-teal-50 shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-white" title="Verified Patient">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
              Member since {profile.joinedDate}
            </span>
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-2">
            <span>{profile.email}</span>
            <span>•</span>
            <span>{profile.phone}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
              Skin: {profile.skinType}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
              Focus: {profile.primaryConcern}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Contact Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Basic Contact Information</h3>
            <p className="text-xs text-slate-500">
              Specialists will use these details to coordinate your consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block font-semibold text-slate-700">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className={`w-full pl-9.5 pr-4 py-2.5 rounded-xl border bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-600/30 focus:border-red-600'
                      : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-600 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block font-semibold text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full pl-9.5 pr-4 py-2.5 rounded-xl border bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-600/30 focus:border-red-600'
                      : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block font-semibold text-slate-700">
                Phone Number (Mobile for SMS alerts) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className={`w-full pl-9.5 pr-4 py-2.5 rounded-xl border bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? 'border-red-300 focus:ring-red-600/30 focus:border-red-600'
                      : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-600 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label htmlFor="address" className="block font-semibold text-slate-700">
                Residential City & State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="address"
                  type="text"
                  {...register('address')}
                  className={`w-full pl-9.5 pr-4 py-2.5 rounded-xl border bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.address
                      ? 'border-red-300 focus:ring-red-600/30 focus:border-red-600'
                      : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-[11px] text-red-600 font-medium">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Details & Emergency Contact */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Clinical Profile & Emergency Contact</h3>
            <p className="text-xs text-slate-500">
              Helps practitioners review your baseline skin type and contact your trusted person if needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Skin Type */}
            <div className="space-y-1.5">
              <label htmlFor="skinType" className="block font-semibold text-slate-700">
                Skin Type Classification
              </label>
              <select
                id="skinType"
                {...register('skinType')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
              >
                <option value="Combination / Sensitive">Combination / Sensitive</option>
                <option value="Dry / Dehydrated">Dry / Dehydrated</option>
                <option value="Oily / Acne-Prone">Oily / Acne-Prone</option>
                <option value="Normal / Balanced">Normal / Balanced</option>
                <option value="Hyperpigmented / Mature">Hyperpigmented / Mature</option>
              </select>
            </div>

            {/* Primary Skin Concern */}
            <div className="space-y-1.5">
              <label htmlFor="primaryConcern" className="block font-semibold text-slate-700">
                Primary Skin Health Focus
              </label>
              <input
                id="primaryConcern"
                type="text"
                {...register('primaryConcern')}
                placeholder="e.g. Acne Scars & Barrier Support"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
              {errors.primaryConcern && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.primaryConcern.message}
                </p>
              )}
            </div>

            {/* Emergency Contact Name */}
            <div className="space-y-1.5">
              <label htmlFor="emergencyContactName" className="block font-semibold text-slate-700">
                Emergency Contact (Name & Relationship)
              </label>
              <input
                id="emergencyContactName"
                type="text"
                {...register('emergencyContactName')}
                placeholder="e.g. Marcus Lin (Spouse)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
              {errors.emergencyContactName && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.emergencyContactName.message}
                </p>
              )}
            </div>

            {/* Emergency Contact Phone */}
            <div className="space-y-1.5">
              <label htmlFor="emergencyContactPhone" className="block font-semibold text-slate-700">
                Emergency Contact Phone
              </label>
              <input
                id="emergencyContactPhone"
                type="tel"
                {...register('emergencyContactPhone')}
                placeholder="e.g. +1 (555) 876-0099"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
              {errors.emergencyContactPhone && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.emergencyContactPhone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            loading={isSubmitting}
            className="shadow-md shadow-teal-700/20"
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfilePage;
