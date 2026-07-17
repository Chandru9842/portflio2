import { motion } from 'motion/react';
import { Github, ExternalLink, Code2, ServerCrash, BarChart4 } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { Project } from '../../types';

export default function Projects() {
  // Renders a high-fidelity stylized banner representation based on the project ID
  const renderProjectBanner = (project: Project) => {
    switch (project.id) {
      case 'proj-1': // OmniQueue
        return (
          <div className="absolute inset-0 bg-bg-main flex flex-col justify-between p-4 overflow-hidden border-b border-border-subtle group-hover:border-accent-primary/20 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-mono text-[10px] tracking-wider text-text-secondary uppercase">OMNIQUEUE DAEMON</span>
              </div>
              <span className="font-mono text-[9px] text-accent-primary bg-accent-soft px-1.5 py-0.5 rounded">ACTIVE</span>
            </div>
            
            <div className="space-y-1.5 my-auto pl-2 border-l-2 border-accent-primary/40 font-mono text-[10px]">
              <div className="text-text-secondary">&gt; systemctl status omniqueue.service</div>
              <div className="text-text-primary">● omniqueue.service - Async Job Dispatcher</div>
              <div className="text-accent-primary">  Active: active (running) since Fri July 17</div>
              <div className="text-text-tertiary">  Workload: 1,842 jobs/sec | Failure Rate: 0.01%</div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-text-tertiary">
              <span>PORT: 6379 (REDIS)</span>
              <span>THREADS: 16 (ACTIVE)</span>
            </div>
          </div>
        );
      
      case 'proj-2': // SaaS Provisioner
        return (
          <div className="absolute inset-0 bg-bg-main flex flex-col justify-between p-4 overflow-hidden border-b border-border-subtle group-hover:border-accent-primary/20 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="font-mono text-[10px] tracking-wider text-text-secondary uppercase">TENANT ROUTING GW</span>
              </div>
              <span className="font-mono text-[9px] text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-900/30">STANDBY</span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-auto text-center font-mono text-[9px]">
              <div className="p-2 border border-border-subtle rounded bg-bg-surface/50">
                <span className="text-text-tertiary block">T-01</span>
                <span className="text-accent-primary font-semibold">Postgres</span>
              </div>
              <div className="p-2 border border-border-subtle rounded bg-bg-surface/50">
                <span className="text-text-tertiary block">PROXY</span>
                <span className="text-blue-400 font-semibold">Nginx</span>
              </div>
              <div className="p-2 border border-border-subtle rounded bg-bg-surface/50">
                <span className="text-text-tertiary block">AUTH</span>
                <span className="text-purple-400 font-semibold">OAuth2</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-text-tertiary">
              <span>SANDBOXING: DOCKER_API</span>
              <span>ISOLATION: 3NF_AUTO</span>
            </div>
          </div>
        );

      case 'proj-3': // DevPulse
      default:
        return (
          <div className="absolute inset-0 bg-bg-main flex flex-col justify-between p-4 overflow-hidden border-b border-border-subtle group-hover:border-accent-primary/20 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-primary"></span>
                <span className="font-mono text-[10px] tracking-wider text-text-secondary uppercase">DEVPULSE TELEMETRY</span>
              </div>
              <span className="font-mono text-[9px] text-text-secondary">PROBES: ONLINE</span>
            </div>

            {/* Simulated D3.js Wave Line */}
            <div className="h-12 flex items-end justify-between px-4 gap-1 my-auto">
              {[30, 45, 25, 60, 75, 40, 50, 90, 65, 35, 55, 80, 40, 60, 20].map((val, idx) => (
                <div 
                  key={idx} 
                  className="bg-accent-primary/20 group-hover:bg-accent-primary/40 rounded-t transition-all duration-500 w-full"
                  style={{ height: `${val}%` }}
                ></div>
              ))}
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-text-tertiary">
              <span>METRICS: INDEXEDDB</span>
              <span>SAMPLING: LOCAL_ONLY</span>
            </div>
          </div>
        );
    }
  };

  return (
    <section 
      id="projects" 
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border-subtle"
    >
      <div className="space-y-2 mb-16">
        <span className="font-mono text-xs text-accent-primary tracking-widest uppercase block">
          05 // Projects
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
          Featured Engineering Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="projects-grid">
        {portfolioData.projects.map((proj, index) => (
          <motion.article
            key={proj.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col bg-bg-surface border border-border-subtle hover:border-border-active hover:shadow-xl hover:shadow-bg-main/50 rounded-xl overflow-hidden group transition-all duration-300"
          >
            {/* Visual Header / Banner */}
            <div className="relative h-44 overflow-hidden w-full bg-bg-main">
              {renderProjectBanner(proj)}
              
              {/* Badge for Featured Projects */}
              {proj.featured && (
                <div className="absolute top-3 right-3 z-10 bg-accent-primary/95 text-bg-main font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">
                  Featured
                </div>
              )}
            </div>

            {/* Body Content */}
            <div className="flex-grow p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <h3 className="font-display text-lg md:text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                  {proj.title}
                </h3>
                <p className="font-sans text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {proj.shortDescription}
                </p>
              </div>

              <div className="space-y-4">
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] font-medium bg-bg-main text-text-secondary px-2 py-0.5 rounded border border-border-subtle/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-border-subtle/50">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-primary hover:text-accent-hover transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {proj.codeUrl && (
                    <a
                      href={proj.codeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors ml-auto"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View Code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
