import { motion } from 'motion/react';
import { Target, Terminal, Cpu, Heart } from 'lucide-react';

export default function About() {
  const leftVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const items = [
    {
      icon: <Target className="w-5 h-5 text-accent-primary" />,
      title: "Current Focus",
      desc: "Deepening knowledge of microservice design principles, concurrent task processing, and database optimization."
    },
    {
      icon: <Cpu className="w-5 h-5 text-accent-primary" />,
      title: "Development Interests",
      desc: "Distributed backends, high-performance web servers, serverless computing, and accessible design system components."
    },
    {
      icon: <Terminal className="w-5 h-5 text-accent-primary" />,
      title: "Engineering Philosophy",
      desc: "Writing code that is simple to read, straightforward to test, modular, and designed strictly around actual user and system performance requirements."
    },
    {
      icon: <Heart className="w-5 h-5 text-accent-primary" />,
      title: "Collaboration & Community",
      desc: "Actively engaging in technical code reviews, collaborative problem solving, and contributing core features to developer tools."
    }
  ];

  return (
    <section 
      id="about" 
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border-subtle"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Editorial Intro */}
        <motion.div 
          className="lg:col-span-6 space-y-6"
          variants={leftVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="space-y-2">
            <span className="font-mono text-xs text-accent-primary tracking-widest uppercase block">
              01 // Background
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              About Me
            </h2>
          </div>

          <div className="font-sans text-text-secondary space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              I am a software engineer focused on building robust full-stack applications. My interest in technology began with solving algorithmic puzzles, which naturally evolved into creating complex backend systems and highly interactive web interfaces.
            </p>
            <p>
              I believe in clean architectural foundations, rigorous type-safety, and elegant relational schemas. My goal is to build high-performance services that scale seamlessly while offering a flawless developer and end-user experience.
            </p>
            <p className="text-text-tertiary text-sm md:text-base italic">
              Currently pursuing my final year in Computer Science & Engineering, while actively designing tooling workflows and deploying microservices architectures.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Structured Context Areas */}
        <motion.div 
          className="lg:col-span-6 space-y-8"
          variants={rightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          id="about-interests"
        >
          <div className="h-px bg-border-subtle w-12 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="space-y-3 p-1 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-md bg-bg-surface border border-border-subtle">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-sm md:text-base font-semibold text-text-primary">
                    {item.title}
                  </h3>
                </div>
                <p className="font-sans text-sm text-text-secondary leading-relaxed pl-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Metrics (Clean, Non-Larping!) */}
          <div className="border border-border-subtle bg-bg-surface/30 rounded-lg p-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="font-display text-2xl md:text-3xl font-bold text-accent-primary block">
                2+
              </span>
              <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider block mt-1">
                Years Dev Practice
              </span>
            </div>
            <div className="border-x border-border-subtle">
              <span className="font-display text-2xl md:text-3xl font-bold text-accent-primary block">
                12+
              </span>
              <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider block mt-1">
                Completed Projects
              </span>
            </div>
            <div>
              <span className="font-display text-2xl md:text-3xl font-bold text-accent-primary block">
                600+
              </span>
              <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider block mt-1">
                Leetcode Solved
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
