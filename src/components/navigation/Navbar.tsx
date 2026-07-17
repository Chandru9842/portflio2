import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certificates', href: '#certificates' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-bg-main/90 backdrop-blur-md border-b border-border-subtle py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo / Monogram */}
          <a 
            href="#hero" 
            className="flex items-center space-x-2 font-display text-xl font-bold tracking-tight text-text-primary group"
            id="nav-logo"
          >
            <span className="text-accent-primary group-hover:text-accent-hover transition-colors">C</span>
            <span className="text-text-secondary">M</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8" id="nav-desktop-links">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1.5 ${
                  activeSection === item.href.slice(1)
                    ? 'text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4" id="nav-desktop-cta">
            <a
              href={portfolioData.resumeUrl}
              className="inline-flex items-center justify-center px-4 py-2 border border-accent-primary text-accent-primary hover:bg-accent-soft text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-300 gap-1.5 group"
            >
              Resume
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            id="nav-mobile-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[72px] z-30 bg-bg-main/98 backdrop-blur-xl border-t border-border-subtle lg:hidden flex flex-col justify-between px-6 py-12"
            id="nav-mobile-drawer"
          >
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={`font-display text-2xl font-semibold tracking-tight transition-colors ${
                    activeSection === item.href.slice(1)
                      ? 'text-accent-primary border-l-2 border-accent-primary pl-4'
                      : 'text-text-secondary hover:text-text-primary pl-4 border-l-2 border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col space-y-8 border-t border-border-subtle pt-8">
              <a
                href={portfolioData.resumeUrl}
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-accent-primary text-bg-main hover:bg-accent-hover text-sm font-semibold uppercase tracking-wider rounded-md transition-all duration-300 gap-2"
              >
                Download Resume
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-center space-x-6 text-text-secondary">
                <a
                  href={portfolioData.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-primary transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href={portfolioData.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-primary transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={`mailto:${portfolioData.socials.email}`}
                  className="hover:text-accent-primary transition-colors"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
