import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import Button from '../../components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
});

export const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setSubmittedEmail(data.email);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Forgot Password?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your registered email address and we&apos;ll send you a password reset link.
        </p>
      </div>

      {isSent ? (
        /* Success State */
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">Check Your Inbox</h3>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-xs mx-auto">
              We&apos;ve sent a password reset link to <strong>{submittedEmail}</strong>.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              to="/auth/reset-password"
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full justify-center"
            >
              Enter New Password
            </Button>

            <button
              type="button"
              onClick={() => setIsSent(false)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 pt-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Use different email address</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              icon={Mail}
              className="w-full justify-center shadow-md shadow-teal-600/20"
            >
              {isSubmitting ? 'Sending instructions...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
      )}

      {/* Footer / Back to Login */}
      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        Remember your password?{' '}
        <Link
          to="/auth/login"
          className="font-bold text-teal-700 hover:text-teal-800 transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
