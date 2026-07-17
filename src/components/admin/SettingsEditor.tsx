import React, { useState, useEffect } from 'react';
import { Save, Settings, Copyright } from 'lucide-react';

interface SettingsEditorProps {
  mode: 'site-settings' | 'footer';
}

export default function SettingsEditor({ mode }: SettingsEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // States for Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Chandru M Portfolio',
    siteTitle: 'Chandru M | Senior Software Engineer & Architect',
    siteDescription: 'Administrative CMS workspace for portfolio and system settings.',
    maintenanceMode: false,
    contactEmail: 'chandrumohan550@gmail.com',
    googleAnalyticsId: ''
  });

  // States for Footer Settings
  const [footerSettings, setFooterSettings] = useState({
    copyrightText: '© 2026 Chandru M. All rights reserved.',
    designedBy: 'Chandru M',
    showSocials: true,
    isVisible: true
  });

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        setStatusMessage(null);
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        if (mode === 'site-settings') {
          const res = await fetch('/api/settings', { headers });
          const json = await res.json();
          if (json.success && json.data) {
            setSiteSettings({
              siteName: json.data.siteName || '',
              siteTitle: json.data.siteTitle || '',
              siteDescription: json.data.siteDescription || '',
              maintenanceMode: json.data.maintenanceMode || false,
              contactEmail: json.data.contactEmail || '',
              googleAnalyticsId: json.data.googleAnalyticsId || ''
            });
          }
        } else {
          const res = await fetch('/api/footer', { headers });
          const json = await res.json();
          if (json.success && json.data) {
            setFooterSettings({
              copyrightText: json.data.copyrightText || '',
              designedBy: json.data.designedBy || '',
              showSocials: json.data.showSocials || false,
              isVisible: json.data.isVisible || false
            });
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [mode]);

  const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSiteSettings(prev => ({ ...prev, [name]: val }));
  };

  const handleFooterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFooterSettings(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);
      const token = localStorage.getItem('token');
      const url = mode === 'site-settings' ? '/api/settings' : '/api/footer';
      const payload = mode === 'site-settings' ? siteSettings : footerSettings;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: json.message || 'Failed to save settings.' });
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
        <p className="text-xs font-mono text-text-secondary">Loading system variables...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      
      <div className="border-b border-border-subtle pb-4">
        <div className="flex items-center space-x-3">
          {mode === 'site-settings' ? (
            <Settings className="w-5 h-5 text-accent-primary" />
          ) : (
            <Copyright className="w-5 h-5 text-accent-primary" />
          )}
          <h2 className="font-display font-bold text-lg text-text-primary capitalize">
            Configure {mode === 'site-settings' ? 'Site Metadata' : 'Footer Attributes'}
          </h2>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          {mode === 'site-settings' 
            ? 'Manage global search indexing tags, contact route parameters, and analytics variables.' 
            : 'Configure legal copyright disclaimers, credits, and link visibilities.'}
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
        
        {mode === 'site-settings' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={siteSettings.siteName}
                onChange={handleSiteChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Global Title</label>
              <input
                type="text"
                name="siteTitle"
                value={siteSettings.siteTitle}
                onChange={handleSiteChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Meta Description (Search Indexing)</label>
              <textarea
                name="siteDescription"
                value={siteSettings.siteDescription}
                onChange={handleSiteChange}
                required
                rows={3}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Contact Receiving Email</label>
              <input
                type="email"
                name="contactEmail"
                value={siteSettings.contactEmail}
                onChange={handleSiteChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Google Analytics ID</label>
              <input
                type="text"
                name="googleAnalyticsId"
                value={siteSettings.googleAnalyticsId}
                onChange={handleSiteChange}
                placeholder="G-XXXXXX"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={siteSettings.maintenanceMode}
                onChange={handleSiteChange}
                className="w-4 h-4 rounded border-border-subtle text-accent-primary focus:ring-accent-primary cursor-pointer"
              />
              <label htmlFor="maintenanceMode" className="text-xs font-medium text-text-secondary cursor-pointer select-none">
                Enable Site Maintenance Mode (Blocks public routes with a friendly message)
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Copyright Notice</label>
              <input
                type="text"
                name="copyrightText"
                value={footerSettings.copyrightText}
                onChange={handleFooterChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Designed / Developed By</label>
              <input
                type="text"
                name="designedBy"
                value={footerSettings.designedBy}
                onChange={handleFooterChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showSocials"
                  name="showSocials"
                  checked={footerSettings.showSocials}
                  onChange={handleFooterChange}
                  className="w-4 h-4 rounded border-border-subtle text-accent-primary focus:ring-accent-primary cursor-pointer"
                />
                <label htmlFor="showSocials" className="text-xs font-semibold text-text-secondary cursor-pointer select-none">
                  Display active social channels in footer
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isVisible"
                  name="isVisible"
                  checked={footerSettings.isVisible}
                  onChange={handleFooterChange}
                  className="w-4 h-4 rounded border-border-subtle text-accent-primary focus:ring-accent-primary cursor-pointer"
                />
                <label htmlFor="isVisible" className="text-xs font-semibold text-text-secondary cursor-pointer select-none">
                  Display footer elements publicly
                </label>
              </div>
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
