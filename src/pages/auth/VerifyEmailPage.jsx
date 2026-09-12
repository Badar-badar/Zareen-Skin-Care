import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';

export const VerifyEmailPage = () => {
  const [resendSent, setResendSent] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSent(true);
      setTimeout(() => setResendSent(false), 5000);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-center space-y-6">
      {/* Animated Mail Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mx-auto shadow-xs"
      >
        <Mail className="w-8 h-8" />
      </motion.div>

      {/* Title & Body */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Verify Your Email Address
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          We have sent a verification email to your registered inbox. Please click the link inside to activate your Zareen Skin Care account.
        </p>
      </div>

      {/* Resend Confirmation Banner */}
      {resendSent && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>A new verification link has been sent to your inbox.</span>
        </motion.div>
      )}

      {/* Quick Security Tip */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left flex items-start gap-2.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <span>
          Can&apos;t find the email? Please check your spam or junk folder, or click below to request another copy.
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <Button
          to="/auth/login"
          variant="primary"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          className="w-full justify-center shadow-md shadow-teal-600/20"
        >
          Continue to Sign In
        </Button>

        <div>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || resendSent}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 disabled:opacity-50 transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>{isResending ? 'Sending...' : 'Resend Verification Email'}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
        Need help?{' '}
        <Link to="/contact" className="font-semibold text-teal-700 hover:text-teal-800">
          Contact support
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
