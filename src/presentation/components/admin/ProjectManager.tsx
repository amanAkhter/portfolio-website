import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, FormInput as Input, Card, LoadingScreen as Loading, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, EmptyState } from '../ui';
import { Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';
import type { Project, ProjectTag } from '../../../shared/types';

export const ProjectManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAllProjectsAdmin();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      year: new Date().getFullYear(),
      description: '',
      shortDescription: '',
      coverImage: '',
      technologies: [''],
      tags: [],
      liveUrl: '',
      githubUrl: '',
      featured: false,
      order: projects.length + 1,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setFormData(project);
    setEditingId(project.id || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await portfolioService.updateProject(editingId, formData);
      } else {
        await portfolioService.createProject(formData as Omit<Project, 'id'>);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await portfolioService.deleteProject(id);
      loadData();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const addTechnology = () => {
    setFormData({
      ...formData,
      technologies: [...(formData.technologies || []), ''],
    });
  };

  const removeTechnology = (index: number) => {
    const techs = formData.technologies || [];
    setFormData({
      ...formData,
      technologies: techs.filter((_, i) => i !== index),
    });
  };

  const updateTechnology = (index: number, value: string) => {
    const techs = [...(formData.technologies || [])];
    techs[index] = value;
    setFormData({ ...formData, technologies: techs });
  };

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), { label: '', subHeading: '', icon: '' }],
    });
  };

  const removeTag = (index: number) => {
    const tags = formData.tags || [];
    setFormData({
      ...formData,
      tags: tags.filter((_, i) => i !== index),
    });
  };

  const updateTag = (index: number, field: keyof ProjectTag, value: string) => {
    const tags = [...(formData.tags || [])];
    tags[index] = { ...tags[index], [field]: value };
    setFormData({ ...formData, tags });
  };

  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to delete ALL projects? This action cannot be undone. The system will fallback to default configuration.'
    );
    
    if (!confirmClear) return;

    try {
      setLoading(true);
      
      // Delete all projects
      for (const project of projects) {
        if (project.id) {
          await portfolioService.deleteProject(project.id);
        }
      }
      
      // Clear the state immediately
      setProjects([]);
      
      alert('All projects have been deleted successfully! The system will now use fallback configuration.');
      
      // Reload to verify and show empty state
      await loadData();
    } catch (error) {
      console.error('Error clearing projects:', error);
      alert('Failed to clear all projects');
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
        <h2 className="text-3xl font-bold text-tokyo-fg">Project Management</h2>
        <div className="flex gap-3">
          {projects.length > 0 && (
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
            Add Project
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState 
          message="Using fallback configuration as no data found in database"
          actionLabel="Add First Project"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-tokyo-blue">{project.name}</h3>
                <p className="text-tokyo-purple text-sm">{project.year}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(project)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => project.id && handleDelete(project.id)}
                  className="text-tokyo-red hover:text-tokyo-red"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {project.coverImage && (
              <img src={project.coverImage} alt={project.name} className="w-full h-32 object-cover rounded mb-3" />
            )}
            <p className="text-tokyo-fg-dark text-sm mb-3">{project.shortDescription}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.featured && (
                <span className="px-2 py-1 bg-tokyo-yellow/20 text-tokyo-yellow text-xs rounded">Featured</span>
              )}
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span key={i} className="px-2 py-1 bg-tokyo-bg-highlight text-tokyo-cyan text-xs rounded">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 bg-tokyo-bg-highlight text-tokyo-fg-dark text-xs rounded">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </Card>
        ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>{editingId ? 'Edit Project' : 'Add Project'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4" id="project-form">
            <Input
              label="Project Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  Featured Project
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

            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">Short Description</label>
              <textarea
                className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue transition-colors"
                rows={2}
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">Full Description</label>
              <textarea
                className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue transition-colors"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Live URL (Optional)"
                value={formData.liveUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
              />

              <Input
                label="GitHub URL (Optional)"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-tokyo-fg">Technologies</label>
                <Button type="button" size="sm" onClick={addTechnology}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {(formData.technologies || []).map((tech, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={tech}
                    onChange={(e) => updateTechnology(index, e.target.value)}
                    placeholder="Technology"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeTechnology(index)}
                    className="text-tokyo-red"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-tokyo-fg">Project Tags</label>
                <Button type="button" size="sm" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {(formData.tags || []).map((tag, index) => (
                <div key={index} className="p-3 bg-tokyo-bg-dark rounded-lg border border-tokyo-black mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-tokyo-cyan text-sm">Tag {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(index)}
                      className="text-tokyo-red"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      value={tag.label}
                      onChange={(e) => updateTag(index, 'label', e.target.value)}
                      placeholder="Label"
                    />
                    <Input
                      value={tag.subHeading}
                      onChange={(e) => updateTag(index, 'subHeading', e.target.value)}
                      placeholder="Sub Heading"
                    />
                    <Input
                      value={tag.icon}
                      onChange={(e) => updateTag(index, 'icon', e.target.value)}
                      placeholder="Icon"
                    />
                  </div>
                </div>
              ))}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="project-form">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
