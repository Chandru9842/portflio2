import React, { useState, useEffect } from 'react';
import { Save, User, Sparkles, FileText } from 'lucide-react';

interface ProfileEditorProps {
  mode: 'profile' | 'hero' | 'about';
}

export default function ProfileEditor({ mode }: ProfileEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    professionalTitle: '',
    shortBio: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    profileImage: '',
    resumeUrl: '',
    availabilityStatus: 'available',
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch('/api/profile');
        const json = await res.json();
        if (json.success && json.data) {
          setProfile({
            fullName: json.data.fullName || '',
            professionalTitle: json.data.professionalTitle || '',
            shortBio: json.data.shortBio || '',
            about: json.data.about || '',
            email: json.data.email || '',
            phone: json.data.phone || '',
            location: json.data.location || '',
            profileImage: json.data.profileImage || '',
            resumeUrl: json.data.resumeUrl || '',
            availabilityStatus: json.data.availabilityStatus || 'available',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage({ type: 'success', text: 'Profile details updated successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: json.message || 'Failed to save changes.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading profile database attributes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      
      {/* Dynamic Tab Heading */}
      <div className="border-b border-border-subtle pb-4">
        <div className="flex items-center space-x-3">
          {mode === 'profile' && <User className="w-5 h-5 text-accent-primary" />}
          {mode === 'hero' && <Sparkles className="w-5 h-5 text-accent-primary" />}
          {mode === 'about' && <FileText className="w-5 h-5 text-accent-primary" />}
          <h2 className="font-display font-bold text-lg text-text-primary capitalize">
            Configure {mode} Module
          </h2>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          {mode === 'profile' && 'Manage your personal details, resume file links, and professional status settings.'}
          {mode === 'hero' && 'Configure titles, short hooks, and landing visuals for the hero block.'}
          {mode === 'about' && 'Compose the extensive bio, location metrics, and informational attributes.'}
        </p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-lg text-xs font-semibold border ${
          statusMessage.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-bg-surface border border-border-subtle p-6 rounded-xl">
        
        {mode === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Availability Status</label>
              <select
                name="availabilityStatus"
                value={profile.availabilityStatus}
                onChange={handleChange}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors cursor-pointer"
              >
                <option value="available">Available for opportunities</option>
                <option value="busy">Busy / Engaged</option>
                <option value="not-seeking">Not seeking work</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Resume Document URL</label>
              <input
                type="text"
                name="resumeUrl"
                value={profile.resumeUrl}
                onChange={handleChange}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {mode === 'hero' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Professional Title</label>
                <input
                  type="text"
                  name="professionalTitle"
                  value={profile.professionalTitle}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Short Hook (Short Bio)</label>
              <textarea
                name="shortBio"
                value={profile.shortBio}
                onChange={handleChange}
                required
                rows={3}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors resize-none"
              />
            </div>
          </div>
        )}

        {mode === 'about' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Location / Area</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Extensive Biography (About Text)</label>
              <textarea
                name="about"
                value={profile.about}
                onChange={handleChange}
                required
                rows={6}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors resize-y"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-primary hover:bg-accent-hover disabled:bg-accent-primary/50 text-bg-main text-xs font-semibold tracking-wide rounded-lg transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
