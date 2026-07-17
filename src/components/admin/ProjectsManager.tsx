import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderGit, Save, Eye, EyeOff, X } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  displayOrder: number;
  isVisible: boolean;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    image: 'omniqueue',
    technologiesRaw: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    displayOrder: 0,
    isVisible: true
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/projects', { headers });
      const json = await res.json();
      if (json.success) {
        setProjects(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (proj: Project) => {
    setEditingProj(proj);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      shortDescription: proj.shortDescription,
      description: proj.description,
      image: proj.image || 'omniqueue',
      technologiesRaw: (proj.technologies || []).join(', '),
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      featured: proj.featured || false,
      displayOrder: proj.displayOrder,
      isVisible: proj.isVisible
    });
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingProj(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      image: 'omniqueue',
      technologiesRaw: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      displayOrder: projects.length + 1,
      isVisible: true
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProj(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const url = editingProj ? `/api/projects/${editingProj._id}` : '/api/projects';
      const method = editingProj ? 'PUT' : 'POST';

      const techArray = formData.technologiesRaw
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        title: formData.title,
        slug: formData.slug || undefined,
        shortDescription: formData.shortDescription,
        description: formData.description,
        image: formData.image,
        technologies: techArray,
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        featured: formData.featured,
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
        setEditingProj(null);
        fetchProjects();
      } else {
        setError(json.message || 'Failed to persist project record.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        fetchProjects();
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleToggleVisibility = async (proj: Project) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/projects/${proj._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !proj.isVisible })
      });
      const json = await res.json();
      if (json.success) {
        fetchProjects();
      }
    } catch (err) {
      console.error('Error toggling project visibility:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading portfolio projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-text-primary">Projects CMS Portal</h2>
          <p className="text-xs text-text-secondary mt-1">Manage project descriptions, visual silhouette types, source links, and highlight status.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-accent-primary hover:bg-accent-hover text-bg-main text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
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
            {editingProj ? 'Edit Project Details' : 'Record New Portfolio Project'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. OmniQueue Scheduler"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Unique Slug (Optional)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auto-generated if empty"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Short High-Level Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                maxLength={150}
                placeholder="A resilient distributed task scheduling system built with Node.js and Redis..."
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Extensive Project Case-Study (Description)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="A detailed explanation of technical challenges, system architectures, and metrics..."
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Silhouette Image Theme</label>
              <select
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors cursor-pointer"
              >
                <option value="omniqueue">Distributed Scheduler (OmniQueue Style)</option>
                <option value="saas-provisioner">System Gateway (Tenant Provisioner Style)</option>
                <option value="devpulse">Observability Canvas (DevPulse Style)</option>
              </select>
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

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Live Application URL</label>
              <input
                type="url"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">GitHub Repository URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Technologies Used (Comma separated)</label>
              <input
                type="text"
                name="technologiesRaw"
                value={formData.technologiesRaw}
                onChange={handleChange}
                required
                placeholder="React, TypeScript, Tailwind CSS, Redis"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-6 py-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle text-accent-primary focus:ring-accent-primary cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-text-primary cursor-pointer select-none">
                  Highlight as a Featured Project
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isVisible"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border-subtle text-accent-primary focus:ring-accent-primary cursor-pointer"
                />
                <label htmlFor="isVisible" className="text-xs font-semibold text-text-primary cursor-pointer select-none">
                  Publish Visibility Publicly
                </label>
              </div>
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
              <span>{submitting ? 'Saving...' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="bg-bg-surface border border-border-subtle rounded-xl py-16 text-center space-y-3">
              <FolderGit className="w-8 h-8 text-text-tertiary mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">No projects cataloged</p>
                <p className="text-[11px] text-text-secondary">Click the button in the header to publish your first development project.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj._id} className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between h-full hover:border-accent-primary/20 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-widest text-text-tertiary uppercase">/projects/{proj.slug}</span>
                      <div className="flex items-center space-x-1.5">
                        {proj.featured && (
                          <span className="text-[8px] font-mono bg-accent-soft text-accent-primary border border-accent-primary/10 px-1.5 py-0.5 rounded uppercase font-bold">
                            Featured
                          </span>
                        )}
                        <span className={`w-2 h-2 rounded-full ${proj.isVisible ? 'bg-green-500' : 'bg-text-tertiary'}`} title={proj.isVisible ? 'Visible' : 'Hidden'} />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">{proj.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{proj.shortDescription}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="text-[9px] font-mono bg-bg-main/60 border border-border-subtle/50 text-text-secondary px-1.5 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-subtle/40 pt-4 mt-4">
                    <span className="text-[10px] font-mono text-text-tertiary">Order: {proj.displayOrder}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleVisibility(proj)}
                        className="p-1.5 hover:bg-bg-elevated rounded transition-colors cursor-pointer text-text-tertiary hover:text-text-primary"
                        title={proj.isVisible ? 'Hide publicly' : 'Publish publicly'}
                      >
                        {proj.isVisible ? <Eye className="w-4 h-4 text-accent-primary" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditClick(proj)}
                        className="p-1.5 hover:bg-bg-elevated text-text-tertiary hover:text-text-primary rounded transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj._id)}
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
