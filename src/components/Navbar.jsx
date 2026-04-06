import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/rij_new_white_bg_full.jpeg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Journal', path: '/journal' },
    { name: 'Research Papers', path: '/papers' },
  ];

  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (isHovered) {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [isHovered]);

  const formatTime = (date) => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    const day = date.getDate();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);

    const getOrdinal = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return {
      hhmmss: `${hh}:${mm}:${ss}`,
      day: day,
      ordinal: getOrdinal(day),
      monthYear: `${month}'${year}`
    };
  };

  const timeParts = formatTime(time);

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-secondary border-b-2 border-primary flex justify-between items-center px-4 sm:px-8 py-3" style={{ backgroundColor: 'var(--secondary)' }}>
      {/* Logo Section */}
      <Link 
        to="/" 
        className="flex items-center gap-3 group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-10 h-10 border-2 border-primary overflow-hidden bg-background flex-shrink-0">
          <img src={logoImg} alt="Rijaul Haque" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
        </div>
        <div className="relative min-w-[150px] md:min-w-[200px] h-8 flex items-center">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.span
                key="name"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-xl md:text-2xl font-extrabold tracking-tighter text-primary uppercase whitespace-nowrap"
              >
                RIJAUL HAQUE
              </motion.span>
            ) : (
              <motion.span
                key="time"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm md:text-lg font-extrabold tracking-widest text-primary uppercase whitespace-nowrap"
              >
                {timeParts.hhmmss}, {timeParts.day}<sup className="text-[10px] md:text-[12px]">{timeParts.ordinal}</sup> {timeParts.monthYear}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Link>
      <div className="bg-background border-2 border-primary hidden md:flex items-center">
        <div className="flex items-center space-x-6 lg:space-x-12 px-6 py-3 border-r-2 border-primary">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                'transition-colors duration-200 text-lg md:text-xl font-bold hover:text-foreground/70',
                location.pathname === link.path ? 'text-primary' : 'text-primary/70'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 text-primary hover:text-primary/70 transition-colors"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Mobile Menu Button Section */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 border-2 border-primary text-primary bg-secondary"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border-2 border-primary text-primary bg-secondary"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-4 md:hidden bg-secondary border-2 border-primary w-48 shadow-lg">
          <div className="flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-lg font-bold text-primary hover:bg-primary/10 border-b border-primary/20 last:border-0"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
