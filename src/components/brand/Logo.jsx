import { Link } from 'react-router-dom';

export const Logo = ({
  size = 'md',
  variant = 'full', // 'full' | 'icon' | 'stacked'
  subtitle = 'Skin Care',
  to = '/',
  className = '',
  iconClassName = '',
  textClassName = '',
  onClick,
}) => {
  // Size configurations
  const sizeMap = {
    xs: {
      iconBox: 'w-7 h-7 rounded-lg',
      svg: 16,
      brandText: 'text-sm font-bold',
      subText: 'text-[9px] tracking-widest',
    },
    sm: {
      iconBox: 'w-8 h-8 rounded-xl',
      svg: 18,
      brandText: 'text-base font-bold',
      subText: 'text-[10px] tracking-widest',
    },
    md: {
      iconBox: 'w-10 h-10 rounded-xl',
      svg: 22,
      brandText: 'text-lg sm:text-xl font-extrabold',
      subText: 'text-[10.5px] tracking-[0.2em] font-semibold',
    },
    lg: {
      iconBox: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
      svg: 28,
      brandText: 'text-2xl sm:text-3xl font-extrabold',
      subText: 'text-xs tracking-[0.25em] font-semibold',
    },
    xl: {
      iconBox: 'w-16 h-16 sm:w-20 sm:h-20 rounded-3xl',
      svg: 38,
      brandText: 'text-3xl sm:text-4xl font-black',
      subText: 'text-sm tracking-[0.3em] font-bold',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Custom Bespoke Skincare Botanical Emblem SVG
  const LogoIcon = () => (
    <div
      className={`relative flex items-center justify-center bg-gradient-to-br from-sage-600 via-sage-700 to-sage-800 text-white shadow-sm shadow-sage-800/25 border border-sage-500/30 overflow-hidden shrink-0 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 ${currentSize.iconBox} ${iconClassName}`}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 via-transparent to-blush-400/25 opacity-70 pointer-events-none" />

      {/* SVG Botanical Emblem: Organic Dewdrop Leaf + Radiant Golden Spark */}
      <svg
        width={currentSize.svg}
        height={currentSize.svg}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-300 group-hover:rotate-6"
      >
        {/* Outer Calming Botanical Leaf Curve */}
        <path
          d="M6 24C6 24 6.5 15 15 9C19 6 25 5.5 25 5.5C25 5.5 24 12 20 17C15.5 22.5 8 24 6 24Z"
          fill="url(#leaf-gradient)"
          fillOpacity="0.45"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Dewdrop / Inner Petal */}
        <path
          d="M16 12.5C16 12.5 20.5 17 20.5 19.5C20.5 22 18.5 24 16 24C13.5 24 11.5 22 11.5 19.5C11.5 17 16 12.5 16 12.5Z"
          fill="url(#dewdrop-gradient)"
        />

        {/* Golden Radiance / Morning Star Sparkle */}
        <path
          d="M23 7L24 10L27 11L24 12L23 15L22 12L19 11L22 10L23 7Z"
          fill="url(#gold-sparkle-gradient)"
        />

        {/* Secondary Delicate Blush Pearl */}
        <circle cx="9.5" cy="20.5" r="1.5" fill="#F3DDD6" fillOpacity="0.9" />

        {/* Gradients */}
        <defs>
          <linearGradient id="leaf-gradient" x1="6" y1="5.5" x2="25" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D3DCCB" />
            <stop offset="1" stopColor="#A8B79A" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="dewdrop-gradient" x1="11.5" y1="12.5" x2="20.5" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#F9EFEB" />
            <stop offset="1" stopColor="#D9A398" />
          </linearGradient>
          <linearGradient id="gold-sparkle-gradient" x1="19" y1="7" x2="27" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF4D6" />
            <stop offset="0.5" stopColor="#DEC28C" />
            <stop offset="1" stopColor="#B08D57" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    if (to) {
      return (
        <Link
          to={to}
          onClick={onClick}
          className={`inline-flex items-center group ${className}`}
          aria-label="Zareen Skin Care"
        >
          <LogoIcon />
        </Link>
      );
    }
    return <LogoIcon />;
  }

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${
        variant === 'stacked' ? 'flex-col text-center' : 'flex-row'
      } ${className}`}
    >
      <LogoIcon />
      <div className={`flex flex-col ${variant === 'stacked' ? 'items-center' : 'items-start'} ${textClassName}`}>
        <span className={`tracking-tight text-stone-900 group-hover:text-sage-800 transition-colors leading-none ${currentSize.brandText}`}>
          Zareen
        </span>
        <span className={`uppercase text-gold-600 mt-1 transition-colors group-hover:text-gold-700 leading-none ${currentSize.subText}`}>
          {subtitle}
        </span>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="focus-visible:ring-2 focus-visible:ring-sage-600/40 rounded-xl p-0.5 transition-transform"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
