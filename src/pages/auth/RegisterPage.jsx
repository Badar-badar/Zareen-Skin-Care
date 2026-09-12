import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { specialtiesList } from '../../data/specialists';

// Zod Schema with dynamic role validation
const registerSchema = z
  .object({
    role: z.enum(['patient', 'specialist']),
    name: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(60, 'Name is too long'),
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    specialty: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.role === 'specialist') {
        return !!data.specialty && data.specialty !== 'All Specialties';
      }
      return true;
    },
    {
      message: 'Please select your medical specialization',
      path: ['specialty'],
    }
  );

export const RegisterPage = () => {
  const [role, setRole] = useState('patient'); // 'patient' | 'specialist'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'patient',
      name: '',
      email: '',
      specialty: 'Clinical Dermatology',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setValue('role', newRole);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setRegisterSuccess(true);
      console.log('Mock Registration Data:', data);
    }, 1000);
  };

  const selectableSpecialties = specialtiesList.filter((s) => s !== 'All Specialties');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create Your Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Join Zareen Skin Care for free appointment bookings.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-700">Select Account Type</span>
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => handleRoleChange('patient')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              role === 'patient'
                ? 'bg-white text-teal-800 shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>I am a Patient</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('specialist')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              role === 'specialist'
                ? 'bg-white text-teal-800 shadow-xs ring-1 ring-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>I am a Specialist</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {registerSuccess ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">Registration Successful!</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your {role === 'specialist' ? 'specialist profile' : 'patient account'} has been created. Next, verify your email address.
            </p>
          </div>
          <div className="pt-2">
            <Button to="/auth/verify-email" variant="primary" size="md" icon={ArrowRight} iconPosition="right">
              Proceed to Email Verification
            </Button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('role')} value={role} />

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-semibold text-slate-700">
              {role === 'specialist' ? 'Doctor / Specialist Full Name' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder={role === 'specialist' ? 'Dr. Sophia Al-Mansoor' : 'Alex Mercer'}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                    : 'border-slate-200 bg-white focus:ring-teal-600/30 focus:border-teal-600'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-red-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                    : 'border-slate-200 bg-white focus:ring-teal-600/30 focus:border-teal-600'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Specialist Field: Specialization Dropdown */}
          {role === 'specialist' && (
            <div className="space-y-1.5">
              <label htmlFor="specialty" className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Primary Specialization</span>
              </label>
              <select
                id="specialty"
                {...register('specialty')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer"
              >
                {selectableSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialty && (
                <p className="text-[11px] text-red-600 font-medium">{errors.specialty.message}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="At least 8 chars with 1 uppercase & 1 number"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                    : 'border-slate-200 bg-white focus:ring-teal-600/30 focus:border-teal-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Re-enter your password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/20'
                    : 'border-slate-200 bg-white focus:ring-teal-600/30 focus:border-teal-600'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="space-y-1 pt-1">
            <div className="flex items-start gap-2">
              <input
                id="agreeTerms"
                type="checkbox"
                {...register('agreeTerms')}
                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-600 mt-0.5 cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="font-semibold text-teal-700 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-semibold text-teal-700 hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-[11px] text-red-600 font-medium">{errors.agreeTerms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full justify-center shadow-md shadow-teal-600/20"
            >
              {isSubmitting
                ? 'Creating account...'
                : role === 'specialist'
                ? 'Register as Specialist'
                : 'Create Patient Account'}
            </Button>
          </div>
        </form>
      )}

      {/* Footer / Login Link */}
      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="font-bold text-teal-700 hover:text-teal-800 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
