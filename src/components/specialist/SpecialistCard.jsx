import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Calendar, CheckCircle2, User } from 'lucide-react';
import Button from '../ui/Button';

export const SpecialistCard = ({ specialist, compact = false }) => {
  const {
    id,
    name,
    title,
    specialty,
    experience,
    rating,
    reviewCount,
    location,
    clinicName,
    image,
    availableToday,
    nextAvailable,
    services = [],
    bio,
  } = specialist;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-3xl border border-taupe-200/80 shadow-xs hover:shadow-xl hover:border-sage-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div className="p-6 space-y-4">
        {/* Top Header: Image, Rating & Status */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={image}
              alt={name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-taupe-100 group-hover:ring-sage-400/40 transition-all shadow-inner"
              loading="lazy"
            />
            {availableToday && (
              <span
                className="absolute -bottom-1 -right-1 flex h-4 w-4"
                title="Available Today"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-sage-600 border-2 border-white"></span>
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-gold-600 font-semibold mb-1">
              <Star className="w-4 h-4 fill-gold-400 text-gold-500" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-stone-400 font-normal">({reviewCount} reviews)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 truncate group-hover:text-sage-700 transition-colors">
              {name}
            </h3>
            <p className="text-xs text-sage-700 font-medium truncate">{title}</p>
            <p className="text-xs text-stone-500 mt-0.5">{experience}</p>
          </div>
        </div>

        {/* Location & Specialty */}
        <div className="space-y-1.5 pt-1 border-t border-taupe-100 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 shrink-0" />
            <span className="font-semibold text-stone-800 truncate">{specialty}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{location} {clinicName ? `• ${clinicName}` : ''}</span>
          </div>
        </div>

        {/* Short Bio (if not in compact mode) */}
        {!compact && bio && (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-0.5">
            {bio}
          </p>
        )}

        {/* Services Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {services.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#FAF7F2] text-stone-700 border border-taupe-200/60"
            >
              {service}
            </span>
          ))}
          {services.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-medium bg-blush-50 text-blush-700 border border-blush-200/60">
              +{services.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / Availability & Action Buttons */}
      <div className="bg-[#FAF6F0] px-6 py-4 border-t border-taupe-200/70 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-sage-600 shrink-0" />
            <span>{nextAvailable}</span>
          </div>
          <span className="text-[11px] font-semibold text-sage-800 bg-sage-100/90 px-2 py-0.5 rounded-md border border-sage-200/80">
            Free Booking
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            to={`/specialist/${id}`}
            variant="outline"
            size="sm"
            className="w-full justify-center text-xs py-2"
            icon={User}
          >
            View Profile
          </Button>
          <Button
            to={`/booking/${id}`}
            variant="primary"
            size="sm"
            className="w-full justify-center text-xs py-2"
            icon={Calendar}
          >
            Book Slot
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialistCard;
