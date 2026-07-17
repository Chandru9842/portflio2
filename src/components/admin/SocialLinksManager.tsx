import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Share2, Save, Eye, EyeOff, X } from 'lucide-react';

interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  iconName?: string;
  displayOrder: number;
  isVisible: boolean;
}

export default function SocialLinksManager() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    iconName: '',
    displayOrder: 0,
    isVisible: true
  });

  const platformsList = ['GitHub', 'LinkedIn', 'LeetCode', 'Twitter', 'GeeksforGeeks', 'Email', 'Custom'];

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/social-links', { headers });
      const json = await res.json();
      if (json.success) {
        setSocialLinks(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching social links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleEditClick = (social: SocialLink) => {
    setEditingSocial(social);
    setFormData({
      platform: social.platform,
      url: social.url,
      iconName: social.iconName || '',
      displayOrder: social.displayOrder,
      isVisible: social.isVisible
    });
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingSocial(null);
    setFormData({
      platform: 'GitHub',
      url: '',
      iconName: '',
      displayOrder: socialLinks.length + 1,
      isVisible: true
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSocial(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const token = localStorage.getItem('token');
      const url = editingSocial ? `/api/social-links/${editingSocial._id}` : '/api/social-links';
      const method = editingSocial ? 'PUT' : 'POST';

      const payload = {
        platform: formData.platform,
        url: formData.url,
        iconName: formData.iconName || undefined,
        displayOrder: formData.displayOrder,
        isVisible: formData.isVisible
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setShowForm(false);
        setEditingSocial(null);
        fetchSocialLinks();
      } else {
        setError(json.message || 'Failed to save social link record.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        fetchSocialLinks();
      }
    } catch (err) {
      console.error('Error deleting social link:', err);
    }
  };

  const handleToggleVisibility = async (social: SocialLink) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/social-links/${social._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !social.isVisible })
      });
      const json = await res.json();
      if (json.success) {
        fetchSocialLinks();
      }
    } catch (err) {
      console.error('Error toggling social link visibility:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading social profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-text-primary">Social Links CMS Portal</h2>
          <p className="text-xs text-text-secondary mt-1">Configure profile connections, platform categories, and link ordering.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-accent-primary hover:bg-accent-hover text-bg-main text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Social Link</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg text-xs font-semibold border bg-red-500/10 text-red-400 border-red-500/20">
          {error}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-bg-surface border border-border-subtle p-6 rounded-xl max-w-3xl">
          <h3 className="font-display font-bold text-sm text-text-primary">
            {editingSocial ? 'Edit Social Link' : 'Register New Social Link'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Platform / Channel</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors cursor-pointer"
              >
                {platformsList.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Icon Name (Optional Override)</label>
              <input
                type="text"
                name="iconName"
                value={formData.iconName}
                onChange={handleChange}
                placeholder="defaults to platform name"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Profile URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://..."
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="isVisible"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border-subtle text-accent-primary focus:ring-accent-primary cursor-pointer"
              />
              <label htmlFor="isVisible" className="text-xs font-medium text-text-secondary cursor-pointer select-none">
                Visible publicly on the developer portfolio
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4.5 py-2.5 border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-elevated text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-accent-primary hover:bg-accent-hover disabled:bg-accent-primary/50 text-bg-main text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Save Link'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {socialLinks.length === 0 ? (
            <div className="bg-bg-surface border border-border-subtle rounded-xl py-16 text-center space-y-3">
              <Share2 className="w-8 h-8 text-text-tertiary mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">No social links configured</p>
                <p className="text-[11px] text-text-secondary">Click the button in the header to publish your first profile link.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLinks.map((social) => (
                <div key={social._id} className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between hover:border-accent-primary/20 transition-all">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-text-primary">{social.platform}</h4>
                    <p className="text-xs text-accent-primary truncate font-semibold font-mono">{social.url}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-subtle/40 pt-4 mt-4">
                    <span className="text-[10px] font-mono text-text-tertiary">Order: {social.displayOrder}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleVisibility(social)}
                        className="p-1.5 hover:bg-bg-elevated rounded transition-colors cursor-pointer text-text-tertiary hover:text-text-primary"
                        title={social.isVisible ? 'Hide publicly' : 'Publish publicly'}
                      >
                        {social.isVisible ? <Eye className="w-4 h-4 text-accent-primary" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditClick(social)}
                        className="p-1.5 hover:bg-bg-elevated text-text-tertiary hover:text-text-primary rounded transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(social._id)}
                        className="p-1.5 hover:bg-red-500/10 text-text-tertiary hover:text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
