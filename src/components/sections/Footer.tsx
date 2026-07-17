import { ArrowUp, Github, Linkedin, Code, Mail } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-bg-surface border-t border-border-subtle pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12" id="footer-top">
        
        {/* Left Column: Bio */}
        <div className="md:col-span-5 space-y-4" id="footer-bio">
          <div className="flex items-center space-x-2 font-display text-lg font-bold tracking-tight text-text-primary">
            <span className="text-accent-primary">Chandru</span>
            <span className="text-text-secondary">M.</span>
          </div>
          <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed max-w-sm">
            A software engineer specializing in scalable systems, database normalization, and premium frontend layouts. Actively deploying production-grade products.
          </p>
        </div>

        {/* Center Column: Quick Links */}
        <div className="md:col-span-3 space-y-4" id="footer-links">
          <h4 className="font-mono text-xs font-semibold tracking-wider text-text-primary uppercase">
            Quick Navigation
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
            <a href="#about" className="text-text-secondary hover:text-accent-primary transition-colors py-0.5">About</a>
            <a href="#skills" className="text-text-secondary hover:text-accent-primary transition-colors py-0.5">Skills</a>
            <a href="#experience" className="text-text-secondary hover:text-accent-primary transition-colors py-0.5">Experience</a>
            <a href="#projects" className="text-text-secondary hover:text-accent-primary transition-colors py-0.5">Projects</a>
            <a href="#certificates" className="text-text-secondary hover:text-accent-primary transition-colors py-0.5">Certificates</a>
            <a href="#contact" className="text-text-secondary hover:text-accent-primary transition-colors py-0.5">Contact</a>
          </div>
        </div>

        {/* Right Column: Connect */}
        <div className="md:col-span-4 space-y-4" id="footer-connect">
          <h4 className="font-mono text-xs font-semibold tracking-wider text-text-primary uppercase">
            Connect
          </h4>
          <div className="flex flex-col space-y-2.5 text-xs md:text-sm">
            <a
              href={portfolioData.socials.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-text-secondary hover:text-accent-primary transition-colors py-0.5"
            >
              <Github className="w-4 h-4 shrink-0 text-text-tertiary" />
              <span>GitHub Profile</span>
            </a>
            <a
              href={portfolioData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-text-secondary hover:text-accent-primary transition-colors py-0.5"
            >
              <Linkedin className="w-4 h-4 shrink-0 text-text-tertiary" />
              <span>LinkedIn Profile</span>
            </a>
            <a
              href={portfolioData.socials.leetcode}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-text-secondary hover:text-accent-primary transition-colors py-0.5"
            >
              <Code className="w-4 h-4 shrink-0 text-text-tertiary" />
              <span>LeetCode Rank</span>
            </a>
            <a
              href={`mailto:${portfolioData.socials.email}`}
              className="flex items-center space-x-2 text-text-secondary hover:text-accent-primary transition-colors py-0.5"
            >
              <Mail className="w-4 h-4 shrink-0 text-text-tertiary" />
              <span>Direct Email</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto border-t border-border-subtle pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="footer-bottom">
        <div className="space-y-1.5 text-center sm:text-left">
          <p className="font-sans text-[11px] text-text-tertiary">
            © 2026 Chandru M. All rights reserved.
          </p>
          <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-wider">
            Built with React, Node.js, Express & MongoDB
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={onAdminClick}
            className="text-[10px] font-semibold font-mono text-text-tertiary hover:text-accent-primary uppercase tracking-wider border border-border-subtle hover:border-accent-primary px-3 py-1.5 rounded transition-all duration-300 cursor-pointer"
            id="footer-admin-login"
          >
            Admin Login
          </button>

          <button
            onClick={scrollToTop}
            className="p-2 bg-bg-main hover:bg-bg-elevated border border-border-subtle hover:border-border-active rounded-md text-text-secondary hover:text-text-primary transition-all duration-300 cursor-pointer"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
