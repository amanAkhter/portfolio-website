import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, FormInput as Input, Card, LoadingScreen as Loading, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, EmptyState } from '../ui';
import { Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';
import type { Experience } from '../../../shared/types';

export const ExperienceManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAllExperiencesAdmin();
      setExperiences(data);
    } catch (error) {
      console.error('Error loading experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      currentPosition: '',
      companyName: '',
      description: '',
      keyAchievements: [''],
      duration: '',
      type: 'Remote',
      location: '',
      technologies: [''],
      startDate: '',
      endDate: '',
      order: experiences.length + 1,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setFormData(exp);
    setEditingId(exp.id || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await portfolioService.updateExperience(editingId, formData);
      } else {
        await portfolioService.createExperience(formData as Omit<Experience, 'id'>);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      await portfolioService.deleteExperience(id);
      loadData();
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    }
  };

  const addArrayItem = (field: 'keyAchievements' | 'technologies') => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), ''],
    });
  };

  const removeArrayItem = (field: 'keyAchievements' | 'technologies', index: number) => {
    const items = formData[field] || [];
    setFormData({
      ...formData,
      [field]: items.filter((_, i) => i !== index),
    });
  };

  const updateArrayItem = (field: 'keyAchievements' | 'technologies', index: number, value: string) => {
    const items = [...(formData[field] || [])];
    items[index] = value;
    setFormData({ ...formData, [field]: items });
  };

  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to delete ALL experiences? This action cannot be undone. The system will fallback to default configuration.'
    );
    
    if (!confirmClear) return;

    try {
      setLoading(true);
      
      // Delete all experiences
      for (const exp of experiences) {
        if (exp.id) {
          await portfolioService.deleteExperience(exp.id);
        }
      }
      
      // Clear the state immediately
      setExperiences([]);
      
      alert('All experiences have been deleted successfully! The system will now use fallback configuration.');
      
      // Reload to verify and show empty state
      await loadData();
    } catch (error) {
      console.error('Error clearing experiences:', error);
      alert('Failed to clear all experiences');
      // Still reload to show current state
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-tokyo-fg">Experience Management</h2>
        <div className="flex gap-3">
          {experiences.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-tokyo-red hover:text-tokyo-red border-tokyo-red/30 hover:border-tokyo-red"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </div>

      {experiences.length === 0 ? (
        <EmptyState 
          message="Using fallback configuration as no data found in database"
          actionLabel="Add First Experience"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid gap-6">
          {experiences.map((exp) => (
          <Card key={exp.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-tokyo-blue">{exp.currentPosition}</h3>
                <p className="text-tokyo-purple">{exp.companyName}</p>
                <p className="text-tokyo-fg-dark mt-2">{exp.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-tokyo-bg-highlight text-tokyo-cyan text-sm rounded">
                    {exp.type}
                  </span>
                  <span className="px-2 py-1 bg-tokyo-bg-highlight text-tokyo-green text-sm rounded">
                    {exp.duration}
                  </span>
                  {exp.location && (
                    <span className="px-2 py-1 bg-tokyo-bg-highlight text-tokyo-fg-dark text-sm rounded">
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(exp)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => exp.id && handleDelete(exp.id)}
                  className="text-tokyo-red hover:text-tokyo-red"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4" id="experience-form">
          <Input
            label="Position"
            value={formData.currentPosition || ''}
            onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
            required
          />

          <Input
            label="Company Name"
            value={formData.companyName || ''}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-tokyo-fg mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue transition-colors"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-tokyo-fg">Key Achievements</label>
              <Button type="button" size="sm" onClick={() => addArrayItem('keyAchievements')}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {(formData.keyAchievements || []).map((achievement, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={achievement}
                  onChange={(e) => updateArrayItem('keyAchievements', index, e.target.value)}
                  placeholder="Achievement"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeArrayItem('keyAchievements', index)}
                  className="text-tokyo-red"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="2 years"
              required
            />

            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">Type</label>
              <select
                className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue"
                value={formData.type || 'Remote'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Remote' | 'Office' | 'Hybrid' })}
              >
                <option value="Remote">Remote</option>
                <option value="Office">Office</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <Input
            label="Location (Optional)"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="San Francisco, CA"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="month"
              value={formData.startDate || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />

            <Input
              label="End Date (Optional)"
              type="month"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-tokyo-fg">Technologies</label>
              <Button type="button" size="sm" onClick={() => addArrayItem('technologies')}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {(formData.technologies || []).map((tech, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={tech}
                  onChange={(e) => updateArrayItem('technologies', index, e.target.value)}
                  placeholder="Technology"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeArrayItem('technologies', index)}
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
          <Button type="submit" form="experience-form">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
