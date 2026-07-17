import { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, FolderGit, Code, Briefcase, Award, Trophy, Mail, Settings } from 'lucide-react';

interface Stat {
  label: string;
  value: number | string;
  unit: string;
  icon: any;
}

interface DashboardOverviewProps {
  admin: any;
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ admin, setActiveTab }: DashboardOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [
          projectsRes,
          skillsRes,
          expRes,
          eduRes,
          certRes,
          achRes,
          messagesRes
        ] = await Promise.all([
          fetch('/api/projects', { headers }).then(res => res.json().catch(() => ({ data: [] }))),
          fetch('/api/skills', { headers }).then(res => res.json().catch(() => ({ data: [] }))),
          fetch('/api/experience', { headers }).then(res => res.json().catch(() => ({ data: [] }))),
          fetch('/api/education', { headers }).then(res => res.json().catch(() => ({ data: [] }))),
          fetch('/api/certificates', { headers }).then(res => res.json().catch(() => ({ data: [] }))),
          fetch('/api/achievements', { headers }).then(res => res.json().catch(() => ({ data: [] }))),
          fetch('/api/contact', { headers }).then(res => res.json().catch(() => ({ data: [] })))
        ]);

        const projects = projectsRes.data || [];
        const skills = skillsRes.data || [];
        const experience = expRes.data || [];
        const education = eduRes.data || [];
        const certificates = certRes.data || [];
        const achievements = achRes.data || [];
        const messages = messagesRes.data || [];

        const unreadMessagesCount = messages.filter((m: any) => !m.isRead).length;

        setStats([
          { label: 'Total Projects', value: projects.length, unit: 'items', icon: FolderGit },
          { label: 'Skills Configured', value: skills.length, unit: 'skills', icon: Code },
          { label: 'Certificates & Awards', value: certificates.length, unit: 'certs', icon: Award },
          { label: 'Contact Messages', value: messages.length, unit: `${unreadMessagesCount} unread`, icon: Mail }
        ]);

        setRecentProjects(projects.slice(0, 3));
        setRecentMessages(messages.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Profile banner block */}
      <div className="relative p-8 rounded-xl bg-bg-surface border border-border-subtle overflow-hidden">
        <div className="absolute right-6 top-6 text-accent-primary opacity-5 shrink-0 select-none pointer-events-none">
          <ShieldCheck className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-accent-soft text-accent-primary border border-accent-primary/15 font-mono text-[10px] tracking-wider uppercase font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-primary" />
            <span>Administrative Session Active</span>
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary">
              Welcome back, {admin?.fullName || 'Chandru'}
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              You are authenticated as <strong className="text-text-primary font-semibold">{admin?.username}</strong>. All system controls and visual portfolio layout attributes are initialized. Use the navigation sidebar to configure records dynamically.
            </p>
          </div>
        </div>
      </div>

      {/* Statistical overview grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-bg-surface border border-border-subtle rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <p className="text-text-secondary text-[11px] font-semibold tracking-wider uppercase">{stat.label}</p>
                <Icon className="w-4 h-4 text-text-tertiary" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-extrabold text-text-primary">{stat.value}</span>
                <span className="text-text-tertiary text-xs font-mono">{stat.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column - Recent projects and Quick actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-display font-bold text-sm text-text-primary">Recent Projects</h3>
              <button 
                onClick={() => setActiveTab('projects')}
                className="text-xs text-accent-primary hover:underline flex items-center space-x-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentProjects.length === 0 ? (
              <p className="text-xs text-text-secondary py-4">No projects published yet.</p>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div key={project._id} className="flex items-center justify-between p-3 rounded-lg bg-bg-main/40 border border-border-subtle/50">
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">{project.title}</h4>
                      <p className="text-[10px] text-text-secondary mt-0.5 line-clamp-1">{project.shortDescription}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${project.featured ? 'bg-accent-soft text-accent-primary' : 'bg-bg-elevated text-text-tertiary'}`}>
                      {project.featured ? 'Featured' : 'Standard'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-text-primary pb-3 border-b border-border-subtle">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Update Profile', tab: 'profile' },
                { label: 'Add New Project', tab: 'projects' },
                { label: 'Register Skill', tab: 'skills' },
                { label: 'Configure Socials', tab: 'social-links' }
              ].map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(act.tab)}
                  className="p-3 text-left rounded-lg bg-bg-main/40 hover:bg-bg-elevated border border-border-subtle/50 hover:border-accent-primary/20 transition-all text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Recent messages */}
        <div className="lg:col-span-5">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle shrink-0">
              <h3 className="font-display font-bold text-sm text-text-primary">Recent Inquiries</h3>
              <button 
                onClick={() => setActiveTab('messages')}
                className="text-xs text-accent-primary hover:underline flex items-center space-x-1"
              >
                <span>All Messages</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 min-h-[250px]">
              {recentMessages.length === 0 ? (
                <p className="text-xs text-text-secondary py-12 text-center">No contact inquiries received.</p>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg._id} className={`p-3.5 rounded-lg border text-xs space-y-1.5 transition-all ${msg.isRead ? 'bg-bg-main/20 border-border-subtle/30' : 'bg-accent-soft/10 border-accent-primary/10'}`}>
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-text-primary truncate max-w-[150px]">{msg.name}</span>
                      <span className="text-[9px] font-mono text-text-tertiary">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium text-text-primary text-[11px] truncate">{msg.subject}</p>
                    <p className="text-text-secondary line-clamp-2 leading-relaxed text-[10px]">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
