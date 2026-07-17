import { motion } from 'motion/react';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export default function Education() {
  return (
    <section 
      id="education" 
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border-subtle"
    >
      <div className="space-y-2 mb-16">
        <span className="font-mono text-xs text-accent-primary tracking-widest uppercase block">
          04 // Foundation
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
          Education History
        </h2>
      </div>

      <div className="relative border-l border-border-subtle ml-4 md:ml-6 pl-8 md:pl-10 space-y-12 max-w-4xl" id="education-timeline">
        {portfolioData.education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Academic Node Ring */}
            <div className="absolute -left-[41px] md:-left-[49px] top-1.5 w-6 h-6 rounded-full bg-bg-main border-2 border-border-subtle flex items-center justify-center group-hover:border-accent-primary transition-colors duration-300">
              <GraduationCap className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent-primary transition-colors duration-300" />
            </div>

            {/* Content Container */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg md:text-xl font-semibold text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                    {edu.degree}
                  </h3>
                  <p className="font-sans text-sm md:text-base font-medium text-text-secondary">
                    {edu.institution}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-tertiary font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{edu.location}</span>
                  </div>
                </div>
              </div>

              {/* Highlights & Honors */}
              {edu.highlights && edu.highlights.length > 0 && (
                <div className="space-y-2 pl-4 list-none text-sm md:text-base text-text-secondary leading-relaxed">
                  {edu.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2.5">
                      <Award className="w-4 h-4 text-accent-primary/80 shrink-0 mt-1" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
