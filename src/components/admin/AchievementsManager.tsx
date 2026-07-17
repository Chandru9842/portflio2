import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Trophy, Save, Eye, EyeOff, X } from 'lucide-react';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  organization?: string;
  date?: string;
  displayOrder: number;
  isVisible: boolean;
}

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization: '',
    date: '',
    displayOrder: 0,
    isVisible: true
  });

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/achievements', { headers });
      const json = await res.json();
      if (json.success) {
        setAchievements(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleEditClick = (ach: Achievement) => {
    setEditingAch(ach);
    setFormData({
      title: ach.title,
      description: ach.description,
      organization: ach.organization || '',
      date: ach.date ? ach.date.split('T')[0] : '',
      displayOrder: ach.displayOrder,
      isVisible: ach.isVisible
    });
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingAch(null);
    setFormData({
      title: '',
      description: '',
      organization: '',
      date: '',
      displayOrder: achievements.length + 1,
      isVisible: true
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAch(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const url = editingAch ? `/api/achievements/${editingAch._id}` : '/api/achievements';
      const method = editingAch ? 'PUT' : 'POST';

      const payload = {
        title: formData.title,
        description: formData.description,
        organization: formData.organization || undefined,
        date: formData.date || undefined,
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
        setEditingAch(null);
        fetchAchievements();
      } else {
        setError(json.message || 'Failed to persist achievement record.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement record?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/achievements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        fetchAchievements();
      }
    } catch (err) {
      console.error('Error deleting achievement:', err);
    }
  };

  const handleToggleVisibility = async (ach: Achievement) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/achievements/${ach._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !ach.isVisible })
      });
      const json = await res.json();
      if (json.success) {
        fetchAchievements();
      }
    } catch (err) {
      console.error('Error toggling achievement visibility:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading achievement milestones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-text-primary">Achievements CMS Portal</h2>
          <p className="text-xs text-text-secondary mt-1">Manage competitive achievements, academic hackathons, and dynamic highlight ranks.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-accent-primary hover:bg-accent-hover text-bg-main text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
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
            {editingAch ? 'Edit Achievement Details' : 'Record New Competitive Achievement'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Achievement Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Smart India Hackathon Winner"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Highlight Rank / Context</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. 1st Place / 250+ Teams"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Milestone Details (Description)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Led a 6-member team to construct a real-time track defect prediction loop..."
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Accomplished Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
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
              <span>{submitting ? 'Saving...' : 'Save Achievement'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {achievements.length === 0 ? (
            <div className="bg-bg-surface border border-border-subtle rounded-xl py-16 text-center space-y-3">
              <Trophy className="w-8 h-8 text-text-tertiary mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">No achievements cataloged</p>
                <p className="text-[11px] text-text-secondary">Click the button in the header to register your first competitive accomplishment.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div key={ach._id} className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between hover:border-accent-primary/20 transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-text-primary leading-snug">{ach.title}</h4>
                      {ach.organization && (
                        <span className="text-[9px] font-mono bg-accent-soft text-accent-primary px-2 py-0.5 rounded shrink-0 font-semibold">
                          {ach.organization}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-3">{ach.description}</p>
                    {ach.date && (
                      <p className="text-[10px] font-mono text-text-tertiary">
                        Accomplished: {new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border-subtle/40 pt-4 mt-4">
                    <span className="text-[10px] font-mono text-text-tertiary">Order: {ach.displayOrder}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleVisibility(ach)}
                        className="p-1.5 hover:bg-bg-elevated rounded transition-colors cursor-pointer text-text-tertiary hover:text-text-primary"
                        title={ach.isVisible ? 'Hide publicly' : 'Publish publicly'}
                      >
                        {ach.isVisible ? <Eye className="w-4 h-4 text-accent-primary" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditClick(ach)}
                        className="p-1.5 hover:bg-bg-elevated text-text-tertiary hover:text-text-primary rounded transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ach._id)}
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
