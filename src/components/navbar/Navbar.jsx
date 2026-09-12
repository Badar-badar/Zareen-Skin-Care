import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogIn, LayoutDashboard, User } from 'lucide-react';
import { mainNavLinks } from '../../data/navigation';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Logo from '../brand/Logo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  const userRole = user?.role || 'patient';

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'specialist') return '/specialist/dashboard';
    return '/patient/dashboard';
  };

  const getDashboardLabel = () => {
    if (userRole === 'admin') return 'Admin Panel';
    if (userRole === 'specialist') return 'Specialist Hub';
    return 'Patient Portal';
  };

  // Close menu if window is resized above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Color Accent Micro-Bar */}
      <div className="w-full bg-gradient-to-r from-sage-800 via-sage-700 to-sage-800 text-white text-[11px] py-1.5 px-4 sm:px-6 border-b border-sage-600/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-400/25 text-gold-200 border border-gold-300/30">
              ✨ 100% Free
            </span>
            <span className="tracking-wide text-cream-50">
              Instant Online Consultations with Certified Dermatologists • Zero Booking Fees
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3.5 text-sage-200 text-[11px]">
            <Link to="/for-specialists" className="hover:text-gold-200 hover:underline transition-colors font-semibold">
              Doctor Registration →
            </Link>
            <span className="text-sage-500">|</span>
            <Link to="/contact" className="hover:text-gold-200 transition-colors">
              Help & Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Frosted Navigation Bar */}
      <div className="w-full border-b border-taupe-200/80 bg-cream-50/90 backdrop-blur-md">
        <Container>
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            {/* Brand Logo */}
            <Logo to="/" onClick={closeMenu} size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {mainNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'text-sage-900 bg-sage-100/90 border border-sage-200/70 font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-taupe-100/70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  to={getDashboardPath()}
                  variant="primary"
                  size="sm"
                  icon={LayoutDashboard}
                  iconPosition="left"
                  className="shadow-sm shadow-sage-700/20"
                >
                  {getDashboardLabel()}
                </Button>
                <Button
                  to="/specialists"
                  variant="outline"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Book Slot
                </Button>
              </>
            ) : (
              <>
                <Button
                  to="/auth/login"
                  variant="ghost"
                  size="sm"
                  icon={LogIn}
                >
                  Login
                </Button>
                <Button
                  to="/specialists"
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-taupe-100 focus:outline-none focus:ring-2 focus:ring-sage-600/30"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-taupe-200/80 bg-cream-50/95 backdrop-blur-md shadow-xl overflow-hidden"
          >
            <Container className="py-5 space-y-4">
              <nav className="flex flex-col space-y-1">
                {mainNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                        isActive
                          ? 'text-sage-900 bg-sage-100/90 font-semibold border border-sage-200/70'
                          : 'text-stone-700 hover:text-stone-900 hover:bg-taupe-100/70'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              <div className="pt-4 border-t border-taupe-200/80 flex flex-col sm:flex-row gap-2.5">
                {isAuthenticated ? (
                  <>
                    <Button
                      to={getDashboardPath()}
                      onClick={closeMenu}
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      icon={LayoutDashboard}
                      iconPosition="left"
                    >
                      {getDashboardLabel()}
                    </Button>
                    <Button
                      to="/specialists"
                      onClick={closeMenu}
                      variant="outline"
                      size="md"
                      className="w-full justify-center"
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Book a Specialist
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      to="/auth/login"
                      onClick={closeMenu}
                      variant="outline"
                      size="md"
                      className="w-full justify-center"
                    >
                      Login
                    </Button>
                    <Button
                      to="/specialists"
                      onClick={closeMenu}
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
