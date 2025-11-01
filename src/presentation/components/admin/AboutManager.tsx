import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, FormInput as Input, Card, LoadingScreen as Loading, EmptyState } from '../ui';
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import type { AboutData } from '../../../shared/types';

export const AboutManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [formData, setFormData] = useState<AboutData>({
    intro: '',
    overview: '',
    latestPositions: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAboutDataAdmin();
      
      // Check if data exists and has meaningful content
      const hasValidData = data && (
        data.intro || 
        data.overview || 
        (data.latestPositions && data.latestPositions.length > 0)
      );
      
      if (hasValidData) {
        setFormData(data!);
        setHasData(true);
      } else {
        // No valid data, show empty state to use fallback
        setHasData(false);
      }
    } catch (error) {
      console.error('Error loading about data:', error);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await portfolioService.updateAboutData(formData);
      alert('About data saved successfully!');
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Failed to save about data');
    } finally {
      setSaving(false);
    }
  };

  const addPosition = () => {
    setFormData({
      ...formData,
      latestPositions: [...formData.latestPositions, { title: '', company: '', duration: '' }],
    });
  };

  const removePosition = (index: number) => {
    setFormData({
      ...formData,
      latestPositions: formData.latestPositions.filter((_, i) => i !== index),
    });
  };

  const updatePosition = (index: number, field: string, value: string) => {
    const updated = [...formData.latestPositions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, latestPositions: updated });
  };

  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear all About section data? This action cannot be undone. The system will fallback to default configuration.'
    );
    
    if (!confirmClear) return;

    try {
      setSaving(true);
      
      const emptyData: AboutData = {
        intro: '',
        overview: '',
        latestPositions: [],
      };
      
      await portfolioService.updateAboutData(emptyData);
      
      // Clear the state immediately
      setFormData(emptyData);
      setHasData(false);
      
      alert('All About section data has been cleared successfully! The system will now use fallback configuration.');
    } catch (error) {
      console.error('Error clearing about data:', error);
      alert('Failed to clear about data');
      // Reload to show current state
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (!hasData) {
    return (
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold text-tokyo-fg mb-6">About Section</h2>
        <EmptyState 
          message="Using fallback configuration as no data found in database"
          actionLabel="Add About Data"
          onAction={() => setHasData(true)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-tokyo-fg">About Section</h2>
        <Button
          type="button"
          variant="outline"
          onClick={handleClearAll}
          disabled={saving}
          className="text-tokyo-red hover:text-tokyo-red border-tokyo-red/30 hover:border-tokyo-red"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear All Data
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-tokyo-blue mb-4">Introduction</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">
                Intro
              </label>
              <textarea
                className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue transition-colors"
                rows={4}
                placeholder="A passionate Full Stack Developer..."
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">
                Overview
              </label>
              <textarea
                className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue transition-colors"
                rows={4}
                placeholder="With a proven track record..."
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                required
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-tokyo-purple">Latest Positions</h3>
            <Button type="button" onClick={addPosition} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </div>

          <div className="space-y-4">
            {formData.latestPositions.map((position, index) => (
              <div key={index} className="p-4 bg-tokyo-bg-dark rounded-lg border border-tokyo-black">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-tokyo-cyan font-medium">Position {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removePosition(index)}
                    className="text-tokyo-red hover:text-tokyo-red"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Input
                    label="Title"
                    placeholder="Senior Full Stack Developer"
                    value={position.title}
                    onChange={(e) => updatePosition(index, 'title', e.target.value)}
                    required
                  />
                  <Input
                    label="Company"
                    placeholder="Tech Company"
                    value={position.company}
                    onChange={(e) => updatePosition(index, 'company', e.target.value)}
                    required
                  />
                  <Input
                    label="Duration"
                    placeholder="2023 - Present"
                    value={position.duration}
                    onChange={(e) => updatePosition(index, 'duration', e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
