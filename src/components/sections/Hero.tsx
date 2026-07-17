import { motion } from 'motion/react';
import { ArrowRight, Download, Github, Linkedin, Code } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden relative"
    >
      {/* Background Decorative Accent (Extremely Muted) */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 w-full items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side: Content */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left z-10" id="hero-left-content">
          <motion.div variants={itemVariants} className="space-y-2">
            <span className="font-mono text-xs md:text-sm text-accent-primary tracking-widest uppercase block">
              Hello, I'm
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary">
              {portfolioData.name}
            </h1>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-text-secondary">
              {portfolioData.title}
            </h2>
          </motion.div>

          <motion.p 
            variants={itemVariants} 
            className="font-sans text-base md:text-lg text-text-secondary leading-relaxed max-w-xl"
          >
            {portfolioData.subTitle} {portfolioData.description}
          </motion.p>

          {/* Call To Actions */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-accent-primary hover:bg-accent-hover text-bg-main text-sm font-semibold tracking-wide rounded-md transition-all duration-300 gap-2 group shadow-lg shadow-accent-primary/10"
              id="hero-cta-projects"
            >
              View Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            
            <a
              href={portfolioData.resumeUrl}
              className="inline-flex items-center justify-center px-6 py-3.5 border border-border-subtle hover:border-accent-primary text-text-primary hover:text-accent-primary bg-bg-surface/50 hover:bg-bg-surface text-sm font-semibold tracking-wide rounded-md transition-all duration-300 gap-2"
              id="hero-cta-resume"
            >
              Download Resume
              <Download className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            variants={itemVariants} 
            className="flex items-center gap-5 pt-4 text-text-secondary border-t border-border-subtle max-w-sm"
          >
            <span className="font-mono text-xs tracking-wider uppercase text-text-tertiary">
              Find me on
            </span>
            <div className="flex items-center gap-4">
              <a
                href={portfolioData.socials.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-primary transition-colors p-1"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={portfolioData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-primary transition-colors p-1"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={portfolioData.socials.leetcode}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-primary transition-colors p-1 flex items-center gap-1 text-sm font-medium"
                aria-label="LeetCode Profile"
              >
                <Code className="w-5 h-5" />
                <span className="font-mono text-xs tracking-tight">LeetCode</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Professional Profile Image Area */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end z-10" id="hero-right-content">
          <motion.div
            variants={itemVariants}
            className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 aspect-square group"
          >
            {/* Elegant Outer Border */}
            <div className="absolute inset-0 border border-border-subtle rounded-2xl transition-all duration-500 group-hover:border-accent-primary/40"></div>
            
            {/* Offset Decorative Frame */}
            <div className="absolute inset-4 border border-border-subtle/50 rounded-xl transition-all duration-500 group-hover:-translate-x-1 group-hover:translate-y-1"></div>
            
            {/* Subtle Accent Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-accent-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"></div>

            {/* Content Container (Geometric Silhouette Design) */}
            <div className="absolute inset-3 bg-bg-surface rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 border border-border-subtle">
              {/* Technical Grid Pattern */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
              
              {/* Geometric Elements */}
              <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-border-active flex items-center justify-center mb-4 transition-transform duration-700 group-hover:rotate-12">
                <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center border border-accent-primary/20">
                  <span className="font-display text-2xl font-bold text-accent-primary tracking-tight">
                    {portfolioData.avatarPlaceholder}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent-primary border-4 border-bg-surface"></div>
              </div>

              <div className="text-center z-10">
                <span className="font-mono text-[10px] text-accent-primary tracking-widest uppercase block mb-1">
                  System Architect
                </span>
                <span className="font-display text-base font-semibold text-text-primary block">
                  Chandru Mohan
                </span>
                <span className="font-mono text-xs text-text-tertiary block mt-1">
                  B.E. Computer Science
                </span>
              </div>

              {/* Decorative Subtle Corner Accents */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-text-tertiary/40"></div>
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-text-tertiary/40"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-text-tertiary/40"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-text-tertiary/40"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
