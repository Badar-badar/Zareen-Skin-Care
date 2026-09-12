import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  ChevronDown,
  HelpCircle,
  Mail,
  Filter,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import { faqs } from '../../data/faq';

export const FaqPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'general' | 'patients' | 'specialists' | 'booking'
  const [openFaqId, setOpenFaqId] = useState(faqs[0]?.id || null);

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      // Category
      if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQ = faq.question.toLowerCase().includes(q);
        const matchA = faq.answer.toLowerCase().includes(q);
        if (!matchQ && !matchA) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-16 sm:space-y-20 py-8 sm:py-12">
      {/* ========================================================================= */}
      {/* 1. HERO & SEARCH */}
      {/* ========================================================================= */}
      <section>
        <Container size="md">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Knowledge Base & Support</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
            >
              Frequently Asked Questions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed"
            >
              Find clear, straightforward answers about our free appointment platform, specialist tools, and patient booking policies.
            </motion.p>

            {/* Live Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto relative pt-2"
            >
              <Search className="w-5 h-5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., pricing, cancellations, hours)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY TABS & ACCORDION */}
      {/* ========================================================================= */}
      <section>
        <Container size="md">
          <div className="space-y-6">
            {/* Category Filter Chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All Questions' },
                { id: 'general', label: 'General & Pricing' },
                { id: 'patients', label: 'For Patients' },
                { id: 'specialists', label: 'For Specialists' },
                { id: 'booking', label: 'Bookings & Cancellations' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Accordion FAQ Items */}
            <div className="space-y-3 pt-2">
              <AnimatePresence mode="popLayout">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;

                    return (
                      <motion.div
                        layout
                        key={faq.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={`rounded-3xl border transition-all overflow-hidden ${
                          isOpen
                            ? 'bg-white border-teal-300 shadow-sm'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base cursor-pointer"
                        >
                          <span className="leading-snug">{faq.question}</span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                              isOpen
                                ? 'bg-teal-50 text-teal-700 rotate-180'
                                : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
                    <Filter className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold text-slate-900">No Matching Questions</h3>
                    <p className="text-xs text-slate-500">
                      Try searching with different keywords or switch categories.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. STILL HAVE QUESTIONS PROMPT */}
      {/* ========================================================================= */}
      <section>
        <Container size="md">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white text-center space-y-5 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold">Still have questions?</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Our support team is available to assist specialists with setup and help patients with any appointment queries.
              </p>
            </div>

            <div className="pt-2">
              <Button to="/contact" variant="primary" size="md" icon={Mail}>
                Contact Support Team
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FaqPage;
