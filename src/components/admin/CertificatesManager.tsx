import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, Save, Eye, EyeOff, X } from 'lucide-react';

interface Certificate {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  displayOrder: number;
  isVisible: boolean;
}

export default function CertificatesManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    displayOrder: 0,
    isVisible: true
  });

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/certificates', { headers });
      const json = await res.json();
      if (json.success) {
        setCertificates(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleEditClick = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      displayOrder: cert.displayOrder,
      isVisible: cert.isVisible
    });
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingCert(null);
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: '',
      displayOrder: certificates.length + 1,
      isVisible: true
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCert(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const url = editingCert ? `/api/certificates/${editingCert._id}` : '/api/certificates';
      const method = editingCert ? 'PUT' : 'POST';

      const payload = {
        name: formData.name,
        issuer: formData.issuer,
        issueDate: formData.issueDate,
        credentialId: formData.credentialId || undefined,
        credentialUrl: formData.credentialUrl || undefined,
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
        setEditingCert(null);
        fetchCertificates();
      } else {
        setError(json.message || 'Failed to persist certificate record.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate record?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        fetchCertificates();
      }
    } catch (err) {
      console.error('Error deleting certificate:', err);
    }
  };

  const handleToggleVisibility = async (cert: Certificate) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/certificates/${cert._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !cert.isVisible })
      });
      const json = await res.json();
      if (json.success) {
        fetchCertificates();
      }
    } catch (err) {
      console.error('Error toggling certificate visibility:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-accent-primary/25 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-xs font-mono text-text-secondary">Loading verification profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-text-primary">Certificates CMS Portal</h2>
          <p className="text-xs text-text-secondary mt-1">Manage cloud certs, issuing institutions, IDs, and dynamic external URLs.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-accent-primary hover:bg-accent-hover text-bg-main text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
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
            {editingCert ? 'Edit Certificate Details' : 'Record New Certification'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Certificate Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. AWS Certified Developer - Associate"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Issuing Organization</label>
              <input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                required
                placeholder="e.g. Amazon Web Services"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Issue Date</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Credential ID (Optional)</label>
              <input
                type="text"
                name="credentialId"
                value={formData.credentialId}
                onChange={handleChange}
                placeholder="e.g. AWS-12345"
                className="w-full bg-bg-main/60 border border-border-subtle focus:border-accent-primary text-xs rounded-lg px-4.5 py-3 text-text-primary outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-text-secondary">Verification Link (URL)</label>
              <input
                type="url"
                name="credentialUrl"
                value={formData.credentialUrl}
                onChange={handleChange}
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
              <span>{submitting ? 'Saving...' : 'Save Certificate'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="bg-bg-surface border border-border-subtle rounded-xl py-16 text-center space-y-3">
              <Award className="w-8 h-8 text-text-tertiary mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">No certificates recorded</p>
                <p className="text-[11px] text-text-secondary">Click the button in the header to register your first professional certificate.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert._id} className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between hover:border-accent-primary/20 transition-all">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-text-primary leading-snug">{cert.name}</h4>
                    <p className="text-[11px] text-accent-primary font-semibold">{cert.issuer}</p>
                    <p className="text-[10px] font-mono text-text-tertiary">
                      Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </p>
                    {cert.credentialId && (
                      <p className="text-[10px] font-mono text-text-tertiary truncate">ID: {cert.credentialId}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border-subtle/40 pt-4 mt-4">
                    <span className="text-[10px] font-mono text-text-tertiary">Order: {cert.displayOrder}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleVisibility(cert)}
                        className="p-1.5 hover:bg-bg-elevated rounded transition-colors cursor-pointer text-text-tertiary hover:text-text-primary"
                        title={cert.isVisible ? 'Hide publicly' : 'Publish publicly'}
                      >
                        {cert.isVisible ? <Eye className="w-4 h-4 text-accent-primary" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditClick(cert)}
                        className="p-1.5 hover:bg-bg-elevated text-text-tertiary hover:text-text-primary rounded transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert._id)}
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
