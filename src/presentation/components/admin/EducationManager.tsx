import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, FormInput as Input, Card, LoadingScreen as Loading, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, EmptyState } from '../ui';
import { Plus, Edit, Trash2, Save, X, GraduationCap, RefreshCw } from 'lucide-react';
import type { Education } from '../../../shared/types';

export const EducationManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [educations, setEducations] = useState<Education[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAllEducationsAdmin();
      setEducations(data);
    } catch (error) {
      console.error('Error loading educations:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      courseName: '',
      universityName: '',
      location: '',
      status: 'In Progress',
      keyAchievements: [''],
      academicFocus: { mainCourse: '', specialization: '' },
      relevantCoursework: [''],
      startDate: '',
      endDate: '',
      order: educations.length + 1,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setFormData(edu);
    setEditingId(edu.id || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await portfolioService.updateEducation(editingId, formData);
      } else {
        await portfolioService.createEducation(formData as Omit<Education, 'id'>);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    try {
      await portfolioService.deleteEducation(id);
      loadData();
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Failed to delete education');
    }
  };

  const addArrayItem = (field: 'keyAchievements' | 'relevantCoursework') => {
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), ''],
    });
  };

  const removeArrayItem = (field: 'keyAchievements' | 'relevantCoursework', index: number) => {
    const items = formData[field] || [];
    setFormData({
      ...formData,
      [field]: items.filter((_, i) => i !== index),
    });
  };

  const updateArrayItem = (field: 'keyAchievements' | 'relevantCoursework', index: number, value: string) => {
    const items = [...(formData[field] || [])];
    items[index] = value;
    setFormData({ ...formData, [field]: items });
  };

  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to delete ALL education records? This action cannot be undone.'
    );
    
    if (!confirmClear) return;

    try {
      setLoading(true);
      for (const edu of educations) {
        if (edu.id) {
          await portfolioService.deleteEducation(edu.id);
        }
      }
      alert('All education records have been deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error clearing education:', error);
      alert('Failed to clear all education records');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-tokyo-fg">Education Management</h2>
        <div className="flex gap-3">
          {educations.length > 0 && (
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
            Add Education
          </Button>
        </div>
      </div>

      {educations.length === 0 ? (
        <EmptyState 
          message="Using fallback configuration as no data found in database"
          actionLabel="Add First Education"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid gap-6">
          {educations.map((edu) => (
          <Card key={edu.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 flex-1">
                <div className="w-14 h-14 rounded-lg bg-tokyo-bg-highlight flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-tokyo-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-tokyo-blue">{edu.courseName}</h3>
                  <p className="text-tokyo-purple">{edu.universityName}</p>
                  <p className="text-tokyo-fg-dark text-sm">{edu.location}</p>
                  <div className="mt-2 flex gap-2 items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        edu.status === 'Completed'
                          ? 'bg-tokyo-green/20 text-tokyo-green'
                          : 'bg-tokyo-yellow/20 text-tokyo-yellow'
                      }`}
                    >
                      {edu.status}
                    </span>
                    <span className="text-tokyo-fg-dark text-sm">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(edu)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => edu.id && handleDelete(edu.id)}
                  className="text-tokyo-red hover:text-tokyo-red"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 p-4 bg-tokyo-bg-dark rounded-lg">
              <p className="text-tokyo-cyan font-medium mb-1">Academic Focus</p>
              <p className="text-tokyo-fg">{edu.academicFocus.mainCourse}</p>
              {edu.academicFocus.specialization && (
                <p className="text-tokyo-fg-dark text-sm">Specialization: {edu.academicFocus.specialization}</p>
              )}
            </div>
          </Card>
        ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>{editingId ? 'Edit Education' : 'Add Education'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4" id="edu-form">
            <Input
              label="Course Name"
              value={formData.courseName || ''}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              placeholder="Bachelor of Technology"
              required
            />

            <Input
              label="University/Institution Name"
              value={formData.universityName || ''}
              onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
              required
            />

            <Input
              label="Location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tokyo-fg mb-2">Status</label>
                <select
                  className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue"
                  value={formData.status || 'In Progress'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'Completed' | 'In Progress' })
                  }
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <Input
                label="Start Date"
                type="month"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <Input
              label="End Date (Optional)"
              type="month"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />

            <div className="p-4 bg-tokyo-bg-dark rounded-lg space-y-3">
              <h4 className="text-tokyo-cyan font-medium">Academic Focus</h4>
              <Input
                label="Main Course"
                value={formData.academicFocus?.mainCourse || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicFocus: { ...formData.academicFocus!, mainCourse: e.target.value },
                  })
                }
                placeholder="Computer Science and Engineering"
                required
              />
              <Input
                label="Specialization (Optional)"
                value={formData.academicFocus?.specialization || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    academicFocus: { ...formData.academicFocus!, specialization: e.target.value },
                  })
                }
                placeholder="Artificial Intelligence"
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-tokyo-fg">Relevant Coursework</label>
                <Button type="button" size="sm" onClick={() => addArrayItem('relevantCoursework')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {(formData.relevantCoursework || []).map((course, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={course}
                    onChange={(e) => updateArrayItem('relevantCoursework', index, e.target.value)}
                    placeholder="Course"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeArrayItem('relevantCoursework', index)}
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
          <Button type="submit" form="edu-form">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
