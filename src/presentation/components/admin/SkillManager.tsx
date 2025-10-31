import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, FormInput as Input, Card, LoadingScreen as Loading, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, EmptyState } from '../ui';
import { Plus, Edit, Trash2, Save, FolderPlus, RefreshCw } from 'lucide-react';
import type { Skill, SkillSection } from '../../../shared/types';

export const SkillManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [sections, setSections] = useState<SkillSection[]>([]);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [skillFormData, setSkillFormData] = useState<Partial<Skill>>({});
  const [sectionFormData, setSectionFormData] = useState<Partial<SkillSection>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillsData, sectionsData] = await Promise.all([
        portfolioService.getAllSkillsAdmin(),
        portfolioService.getAllSkillSectionsAdmin(),
      ]);
      setSkills(skillsData);
      setSections(sectionsData);
    } catch (error) {
      console.error('Error loading skills data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateSkillModal = () => {
    setSkillFormData({
      name: '',
      percentage: 50,
      section: sections[0]?.name || '',
      order: skills.length + 1,
    });
    setEditingSkillId(null);
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: Skill) => {
    setSkillFormData(skill);
    setEditingSkillId(skill.id || null);
    setIsSkillModalOpen(true);
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkillId) {
        await portfolioService.updateSkill(editingSkillId, skillFormData);
      } else {
        await portfolioService.createSkill(skillFormData as Omit<Skill, 'id'>);
      }
      setIsSkillModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await portfolioService.deleteSkill(id);
      loadData();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    }
  };

  const openCreateSectionModal = () => {
    setSectionFormData({
      name: '',
      order: sections.length + 1,
    });
    setEditingSectionId(null);
    setIsSectionModalOpen(true);
  };

  const openEditSectionModal = (section: SkillSection) => {
    setSectionFormData(section);
    setEditingSectionId(section.id || null);
    setIsSectionModalOpen(true);
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSectionId) {
        await portfolioService.updateSkillSection(editingSectionId, sectionFormData);
      } else {
        await portfolioService.createSkillSection(sectionFormData as Omit<SkillSection, 'id'>);
      }
      setIsSectionModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section? This will not delete the skills.')) return;
    try {
      await portfolioService.deleteSkillSection(id);
      loadData();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to delete ALL skill sections and skills? This action cannot be undone.'
    );
    
    if (!confirmClear) return;

    try {
      setLoading(true);
      for (const section of sections) {
        if (section.id) {
          await portfolioService.deleteSkillSection(section.id);
        }
      }
      alert('All skill sections have been deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error clearing skills:', error);
      alert('Failed to clear all skills');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const hasNoData = skills.length === 0 && sections.length === 0;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-tokyo-fg">Skills Management</h2>
        <div className="flex gap-2">
          {sections.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-tokyo-red hover:text-tokyo-red border-tokyo-red/30 hover:border-tokyo-red"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
          <Button onClick={openCreateSectionModal} variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
          <Button onClick={openCreateSkillModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      {hasNoData ? (
        <EmptyState 
          message="Using fallback configuration as no data found in database. Start by creating a skill section first."
          actionLabel="Add First Section"
          onAction={openCreateSectionModal}
        />
      ) : (
        <>
          {/* Sections Management */}
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-semibold text-tokyo-purple mb-4">Skill Sections</h3>
            <div className="flex flex-wrap gap-3">
              {sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center gap-2 px-4 py-2 bg-tokyo-bg-dark border border-tokyo-black rounded-lg"
            >
              <span className="text-tokyo-fg">{section.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openEditSectionModal(section)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => section.id && handleDeleteSection(section.id)}
                className="text-tokyo-red hover:text-tokyo-red"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills by Section */}
      {sections.map((section) => {
        const sectionSkills = skills.filter((s) => s.section === section.name);
        if (sectionSkills.length === 0) return null;

        return (
          <Card key={section.id} className="p-6 mb-6">
            <h3 className="text-xl font-semibold text-tokyo-blue mb-4">{section.name}</h3>
            <div className="grid gap-4">
              {sectionSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 bg-tokyo-bg-dark rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-tokyo-fg font-medium">{skill.name}</span>
                      <span className="text-tokyo-cyan">{skill.percentage}%</span>
                    </div>
                    <div className="w-full bg-tokyo-bg h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-tokyo-blue to-tokyo-cyan transition-all"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="ghost" onClick={() => openEditSkillModal(skill)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => skill.id && handleDeleteSkill(skill.id)}
                      className="text-tokyo-red hover:text-tokyo-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
        </>
      )}

      {/* Skill Modal */}
      <Modal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>{editingSkillId ? 'Edit Skill' : 'Add Skill'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSkillSubmit} className="space-y-4" id="skill-form">
            <Input
              label="Skill Name"
              value={skillFormData.name || ''}
              onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">Section</label>
              <select
                className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue"
                value={skillFormData.section || ''}
                onChange={(e) => setSkillFormData({ ...skillFormData, section: e.target.value })}
                required
              >
                <option value="">Select a section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.name}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">
                Proficiency: {skillFormData.percentage || 50}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={skillFormData.percentage || 50}
                onChange={(e) =>
                  setSkillFormData({ ...skillFormData, percentage: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={() => setIsSkillModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="skill-form">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </ModalFooter>
      </Modal>

      {/* Section Modal */}
      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} size="sm">
        <ModalHeader>
          <ModalTitle>{editingSectionId ? 'Edit Section' : 'Add Section'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSectionSubmit} className="space-y-4" id="section-form">
            <Input
              label="Section Name"
              value={sectionFormData.name || ''}
              onChange={(e) => setSectionFormData({ ...sectionFormData, name: e.target.value })}
              placeholder="e.g., Frontend, Backend, Languages"
              required
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={() => setIsSectionModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="section-form">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
