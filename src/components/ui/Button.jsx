import { Link } from 'react-router-dom';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

  const variantClasses = {
    primary:
      'bg-sage-600 text-white shadow-sm shadow-sage-700/20 hover:bg-sage-700 hover:shadow-md hover:shadow-sage-800/25 active:bg-sage-800 focus-visible:ring-sage-600/40',
    secondary:
      'bg-sage-100/80 text-sage-900 hover:bg-sage-200/90 active:bg-sage-300/80 border border-sage-200/60 focus-visible:ring-sage-600/30',
    gold:
      'bg-gold-500 text-white shadow-sm shadow-gold-600/25 hover:bg-gold-600 hover:shadow-md hover:shadow-gold-700/30 active:bg-gold-700 focus-visible:ring-gold-500/40',
    luxury:
      'bg-gradient-to-r from-gold-500 via-gold-600 to-gold-500 text-white shadow-sm shadow-gold-600/25 hover:shadow-md hover:brightness-105 active:brightness-95 focus-visible:ring-gold-500/40',
    blush:
      'bg-blush-500 text-white shadow-sm shadow-blush-600/20 hover:bg-blush-600 hover:shadow-md hover:shadow-blush-700/25 active:bg-blush-700 focus-visible:ring-blush-500/40',
    warm:
      'bg-blush-100 text-blush-900 hover:bg-blush-200 active:bg-blush-300 border border-blush-200/80 focus-visible:ring-blush-500/30',
    outline:
      'border border-taupe-300 bg-white/80 backdrop-blur-xs text-stone-800 hover:bg-cream-100 hover:border-taupe-400 hover:text-stone-900 shadow-2xs focus-visible:ring-taupe-400/40',
    ghost:
      'text-stone-700 hover:text-stone-900 hover:bg-taupe-100/70 active:bg-taupe-200/60 focus-visible:ring-taupe-400/30',
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2.5 gap-2 font-medium',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold rounded-2xl',
  };

  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`;

  const renderContent = () => (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes} {...props}>
        {renderContent()}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} {...props}>
        {renderContent()}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...props}>
      {renderContent()}
    </button>
  );
};

export default Button;
