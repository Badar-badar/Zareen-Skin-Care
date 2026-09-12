import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Calendar, Heart } from 'lucide-react';
import Container from '../components/ui/Container';
import Logo from '../components/brand/Logo';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      {/* Auth Top Header */}
      <header className="w-full py-4 sm:py-5 border-b border-taupe-200/80 bg-cream-50/90 backdrop-blur-md">
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo to="/" size="md" />

            {/* Help / Back to Site */}
            <Link
              to="/"
              className="text-xs font-semibold text-stone-600 hover:text-sage-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Marketing Highlight Column (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 p-8 rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white shadow-xl"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-200 border border-white/15 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>100% Free Booking Platform</span>
              </div>

              <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
                Connect with Top Skin Specialists & Elevate Your Practice
              </h2>

              <p className="text-xs xl:text-sm text-teal-100/80 leading-relaxed">
                Whether you&apos;re scheduling a dermatology consultation or managing a specialized aesthetic practice, Zareen Skin Care provides seamless scheduling with zero commission fees.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-teal-50">Verified practitioner profiles</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-teal-50">Real-time schedule synchronization</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <span className="text-teal-50">Zero booking fees for patients & specialists</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs italic text-teal-100/90 leading-relaxed">
              &ldquo;Zareen Skin Care simplified our clinic bookings completely. Our patients love how intuitive the slot selection is.&rdquo;
              <p className="not-italic font-bold text-white mt-1 text-[11px]">
                — Dr. Sophia Al-Mansoor, Clinical Dermatologist
              </p>
            </div>
          </motion.div>

          {/* Right Form Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="lg:col-span-7 w-full max-w-md mx-auto"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Zareen Skin Care. All rights reserved.</span>
            <div className="flex items-center gap-4 text-slate-500">
              <Link to="/privacy" className="hover:text-teal-700">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-teal-700">Terms of Service</Link>
              <Link to="/faq" className="hover:text-teal-700">Help Center</Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default AuthLayout;
