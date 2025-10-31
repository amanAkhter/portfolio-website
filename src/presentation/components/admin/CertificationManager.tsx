import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, FormInput as Input, Card, LoadingScreen as Loading, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, EmptyState } from '../ui';
import { Plus, Edit, Trash2, Save, X, Award } from 'lucide-react';
import type { Certification } from '../../../shared/types';

export const CertificationManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Certification>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAllCertificationsAdmin();
      setCertifications(data);
    } catch (error) {
      console.error('Error loading certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      issuingOrganization: '',
      year: new Date().getFullYear(),
      description: '',
      coverImage: '',
      skills: [''],
      certificateUrl: '',
      featured: false,
      order: certifications.length + 1,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setFormData(cert);
    setEditingId(cert.id || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await portfolioService.updateCertification(editingId, formData);
      } else {
        await portfolioService.createCertification(formData as Omit<Certification, 'id'>);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving certification:', error);
      alert('Failed to save certification');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      await portfolioService.deleteCertification(id);
      loadData();
    } catch (error) {
      console.error('Error deleting certification:', error);
      alert('Failed to delete certification');
    }
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...(formData.skills || []), ''],
    });
  };

  const removeSkill = (index: number) => {
    const skills = formData.skills || [];
    setFormData({
      ...formData,
      skills: skills.filter((_, i) => i !== index),
    });
  };

  const updateSkill = (index: number, value: string) => {
    const skills = [...(formData.skills || [])];
    skills[index] = value;
    setFormData({ ...formData, skills });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-tokyo-fg">Certifications Management</h2>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <EmptyState 
          message="Using fallback configuration as no data found in database"
          actionLabel="Add First Certification"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
          <Card key={cert.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg bg-tokyo-bg-highlight flex items-center justify-center">
                  <Award className="w-6 h-6 text-tokyo-yellow" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-tokyo-blue">{cert.title}</h3>
                  <p className="text-tokyo-purple text-sm">{cert.issuingOrganization}</p>
                  <p className="text-tokyo-fg-dark text-xs">{cert.year}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(cert)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => cert.id && handleDelete(cert.id)}
                  className="text-tokyo-red hover:text-tokyo-red"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-tokyo-fg-dark text-sm mb-3">{cert.description}</p>
            <div className="flex flex-wrap gap-2">
              {cert.featured && (
                <span className="px-2 py-1 bg-tokyo-yellow/20 text-tokyo-yellow text-xs rounded">Featured</span>
              )}
              {cert.skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-tokyo-bg-highlight text-tokyo-cyan text-xs rounded">
                  {skill}
                </span>
              ))}
              {cert.skills.length > 3 && (
                <span className="px-2 py-1 bg-tokyo-bg-highlight text-tokyo-fg-dark text-xs rounded">
                  +{cert.skills.length - 3}
                </span>
              )}
            </div>
          </Card>
        ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>{editingId ? 'Edit Certification' : 'Add Certification'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4" id="cert-form">
            <Input
              label="Certificate Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Input
              label="Issuing Organization"
              value={formData.issuingOrganization || ''}
              onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Year"
                type="number"
                value={formData.year || new Date().getFullYear()}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />

              <div className="flex items-end">
                <label className="flex items-center text-sm text-tokyo-fg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2 w-4 h-4"
                  />
                  Featured Certification
                </label>
              </div>
            </div>

            <Input
              label="Cover Image URL"
              value={formData.coverImage || ''}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://..."
              required
            />

            <Input
              label="Certificate URL"
              value={formData.certificateUrl || ''}
              onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
              placeholder="https://..."
              required
            />

            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue transition-colors"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-tokyo-fg">Skills</label>
                <Button type="button" size="sm" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {(formData.skills || []).map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder="Skill"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeSkill(index)}
                    className="text-tokyo-red"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="cert-form">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
