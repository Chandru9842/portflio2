import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Code, Check, Eye, EyeOff, Save, X } from 'lucide-react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiencyLabel?: string;
  displayOrder: number;
  isVisible: boolean;
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Languages',
    proficiencyLabel: 'Advanced',
    displayOrder: 0,
    isVisible: true
  });

  const categories = ['Languages', 'Frontend', 'Backend', 'Databases', 'Tools', 'Core CS'];
  const proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/skills', { headers });
      const json = await res.json();
      if (json.success) {
        setSkills(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiencyLabel: skill.proficiencyLabel || 'Advanced',
      displayOrder: skill.displayOrder,
      isVisible: skill.isVisible
    });
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Languages',
      proficiencyLabel: 'Advanced',
      displayOrder: skills.length + 1,
      isVisible: true
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
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
      const url = editingSkill ? `/api/skills/${editingSkill._id}` : '/api/skills';
      const method = editingSkill ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setShowForm(false);
        setEditingSkill(null);
        fetchSkills();
      } else {
        setError(json.message || 'Failed to persist skill record.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill record?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        fetchSkills();
      }
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const handleToggleVisibility = async (skill: Skill) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/skills/${skill._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !skill.isVisible })
      });
      const json = await res.json();
      if (json.success) {
        fetchSkills();
      }
    } catch (err) {
      console.error('Error toggling skill visibility:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading configured skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header and Actions bar */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-text-primary">Skills CMS Portal</h2>
          <p className="text-xs text-text-secondary mt-1">Configure individual technology tags, categorization levels, and proficiency metrics.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-accent-primary hover:bg-accent-hover text-bg-main text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Skill</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg text-xs font-semibold border bg-red-500/10 text-red-400 border-red-500/20">
          {error}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-bg-surface border border-border-subtle p-6 rounded-xl max-w-2xl">
          <h3 className="font-display font-bold text-sm text-text-primary">
            {editingSkill ? 'Edit Skill Record' : 'Register New Skill'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Skill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Java, React, TypeScript"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Category Group</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Proficiency Tier</label>
              <select
                name="proficiencyLabel"
                value={formData.proficiencyLabel}
                onChange={handleChange}
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors cursor-pointer"
              >
                {proficiencies.map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
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
              <span>{submitting ? 'Saving...' : 'Save Skill'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
          {skills.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Code className="w-8 h-8 text-text-tertiary mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">No skills published</p>
                <p className="text-[11px] text-text-secondary">Click the button in the header to register your first technology skill.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-main/20">
                    <th className="py-3 px-5 font-mono text-[10px] tracking-wider uppercase text-text-tertiary">Skill Details</th>
                    <th className="py-3 px-5 font-mono text-[10px] tracking-wider uppercase text-text-tertiary">Category Group</th>
                    <th className="py-3 px-5 font-mono text-[10px] tracking-wider uppercase text-text-tertiary">Proficiency Label</th>
                    <th className="py-3 px-5 font-mono text-[10px] tracking-wider uppercase text-text-tertiary text-center">Display Order</th>
                    <th className="py-3 px-5 font-mono text-[10px] tracking-wider uppercase text-text-tertiary text-center">Public Visibility</th>
                    <th className="py-3 px-5 font-mono text-[10px] tracking-wider uppercase text-text-tertiary text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50">
                  {skills.map((skill) => (
                    <tr key={skill._id} className="hover:bg-bg-elevated/20 transition-colors">
                      <td className="py-3.5 px-5 text-xs font-bold text-text-primary">{skill.name}</td>
                      <td className="py-3.5 px-5 text-xs text-text-secondary">
                        <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-subtle/40 text-[10px] font-medium">
                          {skill.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-text-secondary">{skill.proficiencyLabel || 'Advanced'}</td>
                      <td className="py-3.5 px-5 text-xs text-text-secondary text-center font-mono">{skill.displayOrder}</td>
                      <td className="py-3.5 px-5 text-center">
                        <button
                          onClick={() => handleToggleVisibility(skill)}
                          className="p-1.5 hover:bg-bg-elevated rounded transition-colors inline-flex cursor-pointer"
                          title={skill.isVisible ? 'Hide Skill' : 'Publish Skill'}
                        >
                          {skill.isVisible ? (
                            <Eye className="w-4 h-4 text-accent-primary" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-text-tertiary" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-1">
                        <button
                          onClick={() => handleEditClick(skill)}
                          className="p-1.5 hover:bg-bg-elevated hover:text-text-primary text-text-tertiary rounded transition-colors inline-flex cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="p-1.5 hover:bg-red-500/10 text-text-tertiary hover:text-red-400 rounded transition-colors inline-flex cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
