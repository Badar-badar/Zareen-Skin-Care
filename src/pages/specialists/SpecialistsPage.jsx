import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Sparkles,
  SearchX,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import SpecialistCard from '../../components/specialist/SpecialistCard';
import SpecialistFilters from '../../components/specialist/SpecialistFilters';
import { mockSpecialists, specialtiesList } from '../../data/specialists';

export const SpecialistsPage = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedService, setSelectedService] = useState('All Services');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'today' | 'this-week'
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'experience' | 'name'

  // Mobile Filter Drawer State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('All Specialties');
    setSelectedLocation('All Locations');
    setSelectedService('All Services');
    setAvailabilityFilter('all');
    setSortBy('rating');
  };

  // Filtered and Sorted Specialists
  const filteredSpecialists = useMemo(() => {
    return mockSpecialists
      .filter((spec) => {
        // Search query filter (matches name, bio, specialty, or services)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = spec.name.toLowerCase().includes(q);
          const matchesSpecialty = spec.specialty.toLowerCase().includes(q);
          const matchesBio = spec.bio.toLowerCase().includes(q);
          const matchesService = spec.services.some((s) => s.toLowerCase().includes(q));
          if (!matchesName && !matchesSpecialty && !matchesBio && !matchesService) {
            return false;
          }
        }

        // Specialty filter
        if (selectedSpecialty !== 'All Specialties') {
          if (spec.category !== selectedSpecialty && spec.specialty !== selectedSpecialty) {
            return false;
          }
        }

        // Location filter
        if (selectedLocation !== 'All Locations') {
          if (spec.location !== selectedLocation) {
            return false;
          }
        }

        // Service filter
        if (selectedService !== 'All Services') {
          if (!spec.services.includes(selectedService)) {
            return false;
          }
        }

        // Availability filter
        if (availabilityFilter === 'today' && !spec.availableToday) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'experience') {
          return b.experienceYears - a.experienceYears;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [
    searchQuery,
    selectedSpecialty,
    selectedLocation,
    selectedService,
    availabilityFilter,
    sortBy,
  ]);

  // Active filters count for mobile indicator
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedSpecialty !== 'All Specialties') count++;
    if (selectedLocation !== 'All Locations') count++;
    if (selectedService !== 'All Services') count++;
    if (availabilityFilter !== 'all') count++;
    if (sortBy !== 'rating') count++;
    return count;
  }, [
    searchQuery,
    selectedSpecialty,
    selectedLocation,
    selectedService,
    availabilityFilter,
    sortBy,
  ]);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen py-8 sm:py-12">
      <Container>
        {/* ========================================================================= */}
        {/* HEADER SECTION */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/70 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Verified Specialist Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Find the Right Skin Specialist
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Browse verified dermatologists, cosmetic specialists, and aesthetic clinics.
            Explore treatment menus, compare verified reviews, and book available consultation slots completely free.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* TOP QUICK FILTER BAR & MOBILE TOGGLE */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs mb-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Main Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, or condition (e.g., Acne, Laser, Botox)..."
                className="w-full pl-10.5 pr-10 py-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button (Visible on mobile/tablet) */}
            <div className="flex items-center gap-2 w-full sm:w-auto lg:hidden">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="w-full justify-center gap-2"
                icon={Filter}
              >
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Specialty Pills (Horizontal scrollable) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap pl-1 pr-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Specialties:</span>
            </span>
            {specialtiesList.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-xs font-semibold'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN 2-COLUMN LAYOUT: SIDEBAR FILTERS + RESULTS GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <SpecialistFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSpecialty={selectedSpecialty}
                setSelectedSpecialty={setSelectedSpecialty}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                availabilityFilter={availabilityFilter}
                setAvailabilityFilter={setAvailabilityFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onResetFilters={handleResetFilters}
                totalResults={filteredSpecialists.length}
              />
            </div>
          </div>

          {/* Right Results Column */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Results Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-slate-800">
                  Showing {filteredSpecialists.length}{' '}
                  {filteredSpecialists.length === 1 ? 'specialist' : 'specialists'}
                </span>
                {activeFiltersCount > 0 && (
                  <span className="text-xs text-slate-500">
                    ({activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'})
                  </span>
                )}
              </div>

              {/* Active Filter Chips & Reset */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                </div>
              )}
            </div>

            {/* Specialist Cards Grid */}
            {filteredSpecialists.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredSpecialists.map((specialist) => (
                    <SpecialistCard key={specialist.id} specialist={specialist} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* ========================================================================= */
              /* EMPTY STATE */
              /* ========================================================================= */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs text-center space-y-6 max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                  <SearchX className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    No Specialists Found
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We couldn&apos;t find any skin specialists matching your exact criteria. Try adjusting or clearing your search filters.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleResetFilters}
                    icon={RotateCcw}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      {/* ========================================================================= */}
      {/* MOBILE FILTERS MODAL DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Drawer Sheet */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-bold text-slate-900">Filter Specialists</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <SpecialistFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSpecialty={selectedSpecialty}
                setSelectedSpecialty={setSelectedSpecialty}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                availabilityFilter={availabilityFilter}
                setAvailabilityFilter={setAvailabilityFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onResetFilters={handleResetFilters}
                totalResults={filteredSpecialists.length}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileFiltersOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialistsPage;
