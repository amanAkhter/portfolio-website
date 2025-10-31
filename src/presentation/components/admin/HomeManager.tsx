import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, FormInput as Input, Card, LoadingScreen as Loading, EmptyState } from '../ui';
import { Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import type { HomeData, SocialLink } from '../../../shared/types';

export const HomeManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [formData, setFormData] = useState<HomeData>({
    profileURL: '',
    resumeURL: '',
    email: '',
    socialLinks: [],
    greeting: '',
    name: '',
    tagline: '',
    taglines: [],
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getHomeDataAdmin();
      if (data) {
        setFormData(data);
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await portfolioService.updateHomeData(formData);
      alert('Home data saved successfully!');
    } catch (error) {
      console.error('Error saving home data:', error);
      alert('Failed to save home data');
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: '', url: '', icon: '' }],
    });
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_, i) => i !== index),
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  const addTagline = () => {
    setFormData({
      ...formData,
      taglines: [...(formData.taglines || []), ''],
    });
  };

  const removeTagline = (index: number) => {
    setFormData({
      ...formData,
      taglines: (formData.taglines || []).filter((_, i) => i !== index),
    });
  };

  const updateTagline = (index: number, value: string) => {
    const updatedTaglines = [...(formData.taglines || [])];
    updatedTaglines[index] = value;
    setFormData({ ...formData, taglines: updatedTaglines });
  };

  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear all Home section data? This action cannot be undone.'
    );
    
    if (!confirmClear) return;

    try {
      setSaving(true);
      // Reset to empty state
      const emptyData: HomeData = {
        profileURL: '',
        resumeURL: '',
        email: '',
        socialLinks: [],
        greeting: '',
        name: '',
        tagline: '',
        taglines: [],
        description: '',
      };
      
      await portfolioService.updateHomeData(emptyData);
      setFormData(emptyData);
      setHasData(false);
      alert('All Home section data has been cleared successfully!');
    } catch (error) {
      console.error('Error clearing home data:', error);
      alert('Failed to clear home data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (!hasData) {
    return (
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold text-tokyo-fg mb-6">Home Section</h2>
        <EmptyState 
          message="Using fallback configuration as no data found in database"
          actionLabel="Add Home Data"
          onAction={() => setHasData(true)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-tokyo-fg">Home Section</h2>
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
          <h3 className="text-xl font-semibold text-tokyo-blue mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <Input
              label="Profile Image URL"
              placeholder="Google Drive URL for profile picture"
              value={formData.profileURL}
              onChange={(e) => setFormData({ ...formData, profileURL: e.target.value })}
              required
            />

            <Input
              label="Resume URL"
              placeholder="Google Drive URL for resume"
              value={formData.resumeURL}
              onChange={(e) => setFormData({ ...formData, resumeURL: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Greeting"
              placeholder="Hi, I am"
              value={formData.greeting || ''}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
            />

            <Input
              label="Name"
              placeholder="Your Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Tagline (Single - Fallback)"
              placeholder="Full Stack Developer"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />

            <div className="border-t border-tokyo-black pt-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <label className="block text-sm font-medium text-tokyo-fg mb-1">
                    Animated Taglines (Multiple)
                  </label>
                  <p className="text-xs text-tokyo-comment">
                    Add multiple taglines for typing/backspace animation effect. Leave empty to use single tagline above.
                  </p>
                </div>
                <Button type="button" onClick={addTagline} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tagline
                </Button>
              </div>

              <div className="space-y-3">
                {(formData.taglines || []).map((tagline, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <Input
                      placeholder={`Tagline ${index + 1} (e.g., Full Stack Developer)`}
                      value={tagline}
                      onChange={(e) => updateTagline(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeTagline(index)}
                      className="text-tokyo-red hover:text-tokyo-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {(formData.taglines || []).length === 0 && (
                <div className="text-sm text-tokyo-comment italic py-3 text-center border border-dashed border-tokyo-black rounded-lg">
                  No animated taglines added. Click "Add Tagline" to create typing animation effect.
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-tokyo-fg mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-tokyo-bg-dark border border-tokyo-black rounded-lg text-tokyo-fg focus:outline-none focus:border-tokyo-blue transition-colors"
                rows={4}
                placeholder="Brief description about yourself"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-tokyo-purple">Social Links</h3>
            <Button type="button" onClick={addSocialLink} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>

          <div className="space-y-4">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-4 items-end">
                <Input
                  label="Platform"
                  placeholder="GitHub"
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  className="flex-1"
                />
                <Input
                  label="URL"
                  placeholder="https://github.com/username"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  className="flex-1"
                />
                <Input
                  label="Icon (Lucide name)"
                  placeholder="Github"
                  value={link.icon || ''}
                  onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeSocialLink(index)}
                  className="mb-1 text-tokyo-red hover:text-tokyo-red"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
