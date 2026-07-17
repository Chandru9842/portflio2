import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Briefcase, Save, Eye, EyeOff, X } from 'lucide-react';

interface Experience {
  _id: string;
  role: string;
  company: string;
  employmentType?: string;
  location: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string[];
  technologies: string[];
  displayOrder: number;
  isVisible: boolean;
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    company: '',
    employmentType: 'Full-time',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    descriptionRaw: '',
    technologiesRaw: '',
    displayOrder: 0,
    isVisible: true
  });

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/experience', { headers });
      const json = await res.json();
      if (json.success) {
        setExperiences(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching experience:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleEditClick = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      role: exp.role,
      company: exp.company,
      employmentType: exp.employmentType || 'Full-time',
      location: exp.location,
      startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      currentlyWorking: exp.currentlyWorking || false,
      descriptionRaw: (exp.description || []).join('\n'),
      technologiesRaw: (exp.technologies || []).join(', '),
      displayOrder: exp.displayOrder,
      isVisible: exp.isVisible
    });
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingExp(null);
    setFormData({
      role: '',
      company: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      descriptionRaw: '',
      technologiesRaw: '',
      displayOrder: experiences.length + 1,
      isVisible: true
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExp(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const url = editingExp ? `/api/experience/${editingExp._id}` : '/api/experience';
      const method = editingExp ? 'PUT' : 'POST';

      const descArray = formData.descriptionRaw
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const techArray = formData.technologiesRaw
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        role: formData.role,
        company: formData.company,
        employmentType: formData.employmentType,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.currentlyWorking ? undefined : (formData.endDate || undefined),
        currentlyWorking: formData.currentlyWorking,
        description: descArray,
        technologies: techArray,
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
        setEditingExp(null);
        fetchExperiences();
      } else {
        setError(json.message || 'Failed to persist experience record.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        fetchExperiences();
      }
    } catch (err) {
      console.error('Error deleting experience:', err);
    }
  };

  const handleToggleVisibility = async (exp: Experience) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/experience/${exp._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !exp.isVisible })
      });
      const json = await res.json();
      if (json.success) {
        fetchExperiences();
      }
    } catch (err) {
      console.error('Error toggling experience visibility:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading experience logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-text-primary">Experience CMS Portal</h2>
          <p className="text-xs text-text-secondary mt-1">Manage employment roles, institutional scopes, milestone lists, and timeline parameters.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-accent-primary hover:bg-accent-hover text-bg-main text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
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
            {editingExp ? 'Edit Experience Record' : 'Record New Experience'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Role / Job Title</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Software Architect"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Company / Organization</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="e.g. Acme Corporation"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Singapore (Hybrid)"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.currentlyWorking}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors disabled:opacity-40"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-3 py-1">
              <input
                type="checkbox"
                id="currentlyWorking"
                name="currentlyWorking"
                checked={formData.currentlyWorking}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border-subtle text-accent-primary focus:ring-accent-primary cursor-pointer"
              />
              <label htmlFor="currentlyWorking" className="text-xs font-medium text-text-secondary cursor-pointer select-none">
                I am currently working in this role
              </label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">
                Milestones & Key Descriptions (One per line)
              </label>
              <textarea
                name="descriptionRaw"
                value={formData.descriptionRaw}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Integrated Redis cache reducing server latency.&#10;Collaborated with frontend devs to optimize rendering."
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">
                Technologies Employed (Comma separated values)
              </label>
              <input
                type="text"
                name="technologiesRaw"
                value={formData.technologiesRaw}
                onChange={handleChange}
                placeholder="React, TypeScript, Express, Redis"
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

            <div className="md:col-span-2 flex items-center space-x-3">
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
              <span>{submitting ? 'Saving...' : 'Save Experience'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="bg-bg-surface border border-border-subtle rounded-xl py-16 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-text-tertiary mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">No experience recorded</p>
                <p className="text-[11px] text-text-secondary">Click the button in the header to register your first employment record.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {experiences.map((exp) => (
                <div key={exp._id} className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-text-primary">{exp.role}</h4>
                      <span className="text-[10px] px-2 py-0.5 bg-bg-elevated border border-border-subtle/50 text-text-secondary rounded-full font-medium">
                        {exp.employmentType}
                      </span>
                    </div>
                    <p className="text-xs text-accent-primary font-semibold">{exp.company} — <span className="text-text-secondary font-normal">{exp.location}</span></p>
                    <p className="text-[10px] font-mono text-text-tertiary">
                      {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A')}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="text-[9px] font-mono bg-accent-soft/30 text-accent-primary px-1.5 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto border-t md:border-t-0 border-border-subtle/40 pt-3 md:pt-0 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleToggleVisibility(exp)}
                      className="p-2 hover:bg-bg-elevated rounded transition-colors cursor-pointer"
                      title={exp.isVisible ? 'Hide publicly' : 'Publish publicly'}
                    >
                      {exp.isVisible ? (
                        <Eye className="w-4 h-4 text-accent-primary" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-text-tertiary" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditClick(exp)}
                      className="p-2 hover:bg-bg-elevated text-text-secondary hover:text-text-primary rounded transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="p-2 hover:bg-red-500/10 text-text-secondary hover:text-red-400 rounded transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
