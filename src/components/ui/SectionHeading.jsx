export const SectionHeading = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isCentered = align === 'center';

  return (
    <div className={`space-y-3 ${isCentered ? 'text-center max-w-2xl mx-auto' : 'text-left max-w-2xl'} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-sage-100 text-sage-800 border border-sage-200/80 ${isCentered ? 'mx-auto' : ''}`}>
          {badge}
        </div>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
