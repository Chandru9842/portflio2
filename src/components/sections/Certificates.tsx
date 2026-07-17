import { motion } from 'motion/react';
import { Award, ExternalLink } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export default function Certificates() {
  return (
    <section 
      id="certificates" 
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border-subtle"
    >
      <div className="space-y-2 mb-16">
        <span className="font-mono text-xs text-accent-primary tracking-widest uppercase block">
          06 // Verifications
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
          Industry Certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="certificates-grid">
        {portfolioData.certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-start justify-between bg-bg-surface border border-border-subtle hover:border-accent-primary/20 p-5 rounded-lg transition-all duration-300 group"
          >
            <div className="flex items-start space-x-4">
              <div className="p-2.5 rounded bg-bg-main border border-border-subtle text-text-secondary group-hover:text-accent-primary group-hover:border-accent-primary/20 transition-colors duration-300">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-sm md:text-base font-semibold text-text-primary">
                  {cert.title}
                </h3>
                <p className="font-sans text-xs text-text-secondary">
                  {cert.issuer}
                </p>
                <p className="font-mono text-[10px] text-text-tertiary">
                  Issued: {cert.date}
                </p>
              </div>
            </div>

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-text-tertiary hover:text-accent-primary transition-colors duration-200"
                aria-label={`Verify certificate: ${cert.title}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
