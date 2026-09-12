import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mail,
  User,
  Send,
  CheckCircle2,
  Phone,
  Clock,
  HelpCircle,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';

// Zod Schema
const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Please enter your full name (at least 2 characters)' })
    .max(60, { message: 'Name cannot exceed 60 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  subject: z
    .string()
    .min(3, { message: 'Please provide a subject line' })
    .max(100, { message: 'Subject is too long' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(1500, { message: 'Message cannot exceed 1500 characters' }),
});

export const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="space-y-16 sm:space-y-20 py-8 sm:py-12">
      {/* ========================================================================= */}
      {/* 1. HERO */}
      {/* ========================================================================= */}
      <section>
        <Container size="md">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Get in Touch</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
            >
              We’re Here to Help
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed"
            >
              Have a question about scheduling, specialist onboarding, or platform support? Send us a message and our team will respond promptly.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. CONTACT FORM & INFO STRIP */}
      {/* ========================================================================= */}
      <section>
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Form Container */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="text-xl font-bold text-slate-900">Message Received</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Thank you for reaching out to Zareen Skin Care! Our support team will review your inquiry and get back to you via email within 24 hours.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-bold text-slate-900">Send an Inquiry</h2>
                      <p className="text-xs text-slate-500">
                        Fill out the details below and we’ll route your message to the appropriate specialist team.
                      </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5 text-xs">
                      <label htmlFor="name" className="block font-semibold text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="name"
                          type="text"
                          {...register('name')}
                          placeholder="e.g. Elena Vance"
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

                    {/* Email */}
                    <div className="space-y-1.5 text-xs">
                      <label htmlFor="email" className="block font-semibold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="e.g. elena.vance@example.com"
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

                    {/* Subject */}
                    <div className="space-y-1.5 text-xs">
                      <label htmlFor="subject" className="block font-semibold text-slate-700">
                        Subject Line <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        {...register('subject')}
                        placeholder="e.g. Question about specialist profile setup"
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                          errors.subject
                            ? 'border-red-300 focus:ring-red-600/30 focus:border-red-600'
                            : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-[11px] text-red-600 font-medium">{errors.subject.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5 text-xs">
                      <label htmlFor="message" className="block font-semibold text-slate-700">
                        Detailed Message <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          rows={4}
                          {...register('message')}
                          placeholder="How can our support team help you today?"
                          className={`w-full p-3.5 rounded-xl border bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                            errors.message
                              ? 'border-red-300 focus:ring-red-600/30 focus:border-red-600'
                              : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                          }`}
                        />
                      </div>
                      {errors.message && (
                        <p className="text-[11px] text-red-600 font-medium">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        icon={Send}
                        loading={isSubmitting}
                        className="w-full sm:w-auto shadow-md shadow-teal-700/20"
                      >
                        Send Message
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Contact Channels & FAQ Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Support Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
                <h3 className="text-base font-bold text-slate-900">Direct Support Channels</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Email Support</span>
                      <a
                        href="mailto:support@zareenskincare.com"
                        className="font-bold text-slate-900 hover:text-teal-700 transition-colors"
                      >
                        support@zareenskincare.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Specialist Hotline</span>
                      <a
                        href="tel:+18005557546"
                        className="font-bold text-slate-900 hover:text-teal-700 transition-colors"
                      >
                        +1 (800) 555-SKIN (7546)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Support Hours</span>
                      <span className="font-bold text-slate-900">
                        Monday – Friday, 8:00 AM – 7:00 PM EST
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Link Banner */}
              <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold">Looking for quick answers?</h4>
                  <p className="text-xs text-teal-200/90 leading-relaxed">
                    Check our extensive knowledge base covering appointment booking, rescheduling, and doctor availability management.
                  </p>
                </div>

                <Button to="/faq" variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  Browse FAQ
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;
