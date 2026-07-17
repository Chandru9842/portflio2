import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export default function Experience() {
  return (
    <section 
      id="experience" 
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border-subtle"
    >
      <div className="space-y-2 mb-16">
        <span className="font-mono text-xs text-accent-primary tracking-widest uppercase block">
          03 // Journey
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
          Professional Experience
        </h2>
      </div>

      <div className="relative border-l border-border-subtle ml-4 md:ml-6 pl-8 md:pl-10 space-y-12 max-w-4xl" id="experience-timeline">
        {portfolioData.experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Timeline Node Ring */}
            <div className="absolute -left-[41px] md:-left-[49px] top-1.5 w-6 h-6 rounded-full bg-bg-main border-2 border-border-subtle flex items-center justify-center group-hover:border-accent-primary transition-colors duration-300">
              <Briefcase className="w-3 h-3 text-text-secondary group-hover:text-accent-primary transition-colors duration-300" />
            </div>

            {/* Content Container */}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg md:text-xl font-semibold text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                    {exp.role}
                  </h3>
                  <p className="font-sans text-sm md:text-base font-medium text-text-secondary">
                    {exp.company}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-tertiary font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <ul className="space-y-2.5 pl-4 list-disc text-sm md:text-base text-text-secondary leading-relaxed">
                {exp.description.map((bullet, bIdx) => (
                  <li key={bIdx} className="marker:text-accent-primary/60">
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* Technology Tags Used */}
              <div className="flex flex-wrap gap-2 pt-2">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[11px] font-medium bg-bg-surface border border-border-subtle text-text-secondary px-2.5 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
