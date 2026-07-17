import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

import Navbar from './components/navigation/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import Projects from './components/sections/Projects';
import Certificates from './components/sections/Certificates';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col justify-center items-center text-text-primary">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-mono tracking-widest text-text-secondary uppercase animate-pulse">
          Authenticating Gateway...
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [path, setPath] = useState(window.location.pathname);
  const [activeSection, setActiveSection] = useState('hero');

  // SPA lightweight path observer
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  // Monitor scroll intersections to update Navbar highlighted tab (only on root/portfolio route)
  useEffect(() => {
    if (path !== '/' && path !== '') return;

    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certificates', 'achievements', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -65% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [path]);

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Routing Logic
  if (path === '/admin/login') {
    if (isAuthenticated) {
      // Redirect to dashboard if already authenticated
      setTimeout(() => navigate('/admin/dashboard'), 0);
      return <LoadingSpinner />;
    }
    return (
      <AdminLogin
        onBackToPortfolio={() => navigate('/')}
        onLoginSuccess={() => navigate('/admin/dashboard')}
      />
    );
  }

  if (path.startsWith('/admin')) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      setTimeout(() => navigate('/admin/login'), 0);
      return <LoadingSpinner />;
    }
    return <AdminDashboard />;
  }

  // Standard Portfolio View
  return (
    <div className="bg-bg-main min-h-screen text-text-primary antialiased selection:bg-accent-primary/20 selection:text-accent-primary">
      {/* Dynamic Sticky Header */}
      <Navbar activeSection={activeSection} />

      {/* Main Structural Blocks */}
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <Certificates />
        <Achievements />
        <Contact />
      </main>

      {/* Triple Column Footer */}
      <Footer onAdminClick={() => navigate('/admin/login')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
