import { Search, RotateCcw, Filter, MapPin, Sparkles, Calendar, Check } from 'lucide-react';
import { specialtiesList, locationsList, servicesList } from '../../data/specialists';
import Button from '../ui/Button';

export const SpecialistFilters = ({
  searchQuery,
  setSearchQuery,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedLocation,
  setSelectedLocation,
  selectedService,
  setSelectedService,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy,
  onResetFilters,
  totalResults,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const isFiltered =
    searchQuery !== '' ||
    selectedSpecialty !== 'All Specialties' ||
    selectedLocation !== 'All Locations' ||
    selectedService !== 'All Services' ||
    availabilityFilter !== 'all' ||
    sortBy !== 'rating';

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-1' : ''}`}>
      {/* Search Header / Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Filters</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            {totalResults} {totalResults === 1 ? 'specialist' : 'specialists'}
          </span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-800 font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search Query Input */}
      <div className="space-y-2">
        <label htmlFor="search-specialist" className="block text-xs font-semibold text-slate-700">
          Search by Name or Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-specialist"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Dr. Sophia, Laser, Acne..."
            className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="space-y-2">
        <label htmlFor="select-specialty" className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Specialization</span>
        </label>
        <select
          id="select-specialty"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer shadow-2xs"
        >
          {specialtiesList.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label htmlFor="select-location" className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>Location</span>
        </label>
        <select
          id="select-location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer shadow-2xs"
        >
          {locationsList.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Service / Treatment Filter */}
      <div className="space-y-2">
        <label htmlFor="select-service" className="block text-xs font-semibold text-slate-700">
          Specific Service
        </label>
        <select
          id="select-service"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer shadow-2xs"
        >
          {servicesList.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>Availability</span>
        </span>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setAvailabilityFilter('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              availabilityFilter === 'all'
                ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Anytime
          </button>
          <button
            type="button"
            onClick={() => setAvailabilityFilter('today')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              availabilityFilter === 'today'
                ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setAvailabilityFilter('this-week')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              availabilityFilter === 'this-week'
                ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Sort By Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label htmlFor="select-sort" className="block text-xs font-semibold text-slate-700">
          Sort By
        </label>
        <select
          id="select-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 transition-all cursor-pointer shadow-2xs"
        >
          <option value="rating">Highest Rated</option>
          <option value="experience">Most Experienced</option>
          <option value="name">Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Mobile Drawer Action Buttons */}
      {isMobileDrawer && (
        <div className="pt-4 border-t border-slate-200 flex gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={onCloseMobileDrawer}
            className="w-full justify-center"
            icon={Check}
          >
            Apply Filters ({totalResults})
          </Button>
        </div>
      )}
    </div>
  );
};

export default SpecialistFilters;
