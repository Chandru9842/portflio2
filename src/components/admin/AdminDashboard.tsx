import { useState, ComponentType } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Sparkles,
  FileText,
  Code,
  Briefcase,
  GraduationCap,
  FolderGit,
  Award,
  Trophy,
  Share2,
  Mail,
  Settings,
  Copyright,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';

import DashboardOverview from './DashboardOverview';
import ProfileEditor from './ProfileEditor';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import EducationManager from './EducationManager';
import ProjectsManager from './ProjectsManager';
import CertificatesManager from './CertificatesManager';
import AchievementsManager from './AchievementsManager';
import SocialLinksManager from './SocialLinksManager';
import MessagesManager from './MessagesManager';
import SettingsEditor from './SettingsEditor';

interface SidebarItem {
  id: string;
  label: string;
  icon: ComponentType<any>;
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'hero', label: 'Hero', icon: Sparkles },
    { id: 'about', label: 'About', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: FolderGit },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'social-links', label: 'Social Links', icon: Share2 },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'site-settings', label: 'Site Settings', icon: Settings },
    { id: 'footer', label: 'Footer', icon: Copyright },
  ];

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout();
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex text-text-primary">
      
      {/* 1. Sidebar - Desktop view */}
      <aside className="hidden lg:flex flex-col w-64 bg-bg-surface border-r border-border-subtle shrink-0">
        
        {/* Brand / Title Header */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-text-primary">
              Chandru M
            </h2>
            <p className="font-mono text-[10px] tracking-widest text-accent-primary uppercase">
              Portfolio CMS
            </p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" title="System online" />
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-accent-soft text-accent-primary border-l-2 border-accent-primary'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent-primary' : 'text-text-tertiary'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-border-subtle space-y-2">
          {admin && (
            <div className="flex items-center space-x-3 px-2 py-1.5 rounded-lg bg-bg-elevated/55 border border-border-subtle/40">
              <div className="w-8 h-8 rounded-full bg-accent-soft text-accent-primary flex items-center justify-center font-bold text-sm border border-accent-primary/20">
                {admin.fullName ? admin.fullName[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-primary truncate">{admin.fullName}</p>
                <p className="text-[10px] font-mono text-text-tertiary truncate">{admin.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <span className="flex items-center space-x-3">
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out</span>
            </span>
          </button>
        </div>
      </aside>

      {/* 2. Sidebar - Mobile layout */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop mask */}
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-bg-main/70 backdrop-blur-sm"
          />

          <aside className="relative flex flex-col w-64 bg-bg-surface border-r border-border-subtle z-50 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-text-primary">
                  Chandru M
                </h2>
                <p className="font-mono text-[10px] tracking-widest text-accent-primary uppercase">
                  Portfolio CMS
                </p>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-text-secondary hover:text-text-primary border border-border-subtle rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? 'bg-accent-soft text-accent-primary border-l-2 border-accent-primary'
                        : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border-subtle space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header navbar */}
        <header className="h-16 border-b border-border-subtle bg-bg-surface px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-elevated transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-text-secondary text-xs font-mono">
              <span>Admin Gateway</span>
              <span>/</span>
              <span className="text-text-primary font-medium tracking-wide">
                {sidebarItems.find((i) => i.id === activeTab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-text-secondary hover:text-accent-primary transition-colors cursor-pointer py-1.5 px-3 border border-border-subtle hover:border-accent-primary/30 rounded-lg bg-bg-main/50"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Tab Canvas Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          
          {activeTab === 'dashboard' && <DashboardOverview admin={admin} setActiveTab={setActiveTab} />}
          {(activeTab === 'profile' || activeTab === 'hero' || activeTab === 'about') && (
            <ProfileEditor mode={activeTab as 'profile' | 'hero' | 'about'} />
          )}
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'experience' && <ExperienceManager />}
          {activeTab === 'education' && <EducationManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'certificates' && <CertificatesManager />}
          {activeTab === 'achievements' && <AchievementsManager />}
          {activeTab === 'social-links' && <SocialLinksManager />}
          {activeTab === 'messages' && <MessagesManager />}
          {(activeTab === 'site-settings' || activeTab === 'footer') && (
            <SettingsEditor mode={activeTab as 'site-settings' | 'footer'} />
          )}

        </main>
      </div>

    </div>
  );
}
