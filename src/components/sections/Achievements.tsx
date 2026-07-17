import { motion } from 'motion/react';
import { Sparkles, Milestone } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export default function Achievements() {
  return (
    <section 
      id="achievements" 
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border-subtle"
    >
      <div className="space-y-2 mb-16">
        <span className="font-mono text-xs text-accent-primary tracking-widest uppercase block">
          07 // Benchmarks
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
          Key Achievements
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="achievements-grid">
        {portfolioData.achievements.map((ach, index) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col justify-between bg-bg-surface border border-border-subtle hover:border-border-active rounded-xl p-6 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Subtle background abstract node element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent-primary/5 to-transparent pointer-events-none"></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-bg-main rounded border border-border-subtle text-accent-primary group-hover:border-accent-primary/20 transition-colors duration-300">
                  <Milestone className="w-4 h-4" />
                </div>
                <span className="font-mono text-[10px] text-text-tertiary">
                  {ach.date}
                </span>
              </div>

              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-accent-soft text-accent-primary border border-accent-primary/10">
                  {ach.highlight}
                </span>
                <h3 className="font-display text-base md:text-lg font-bold text-text-primary leading-snug">
                  {ach.title}
                </h3>
                <p className="font-sans text-sm text-text-secondary leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border-subtle/40 flex items-center gap-1.5 text-[10px] font-mono text-text-tertiary">
              <Sparkles className="w-3 h-3 text-accent-primary/60" />
              <span>VERIFIED MILESTONE</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
