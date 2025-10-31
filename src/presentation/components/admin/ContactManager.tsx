import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, FormInput as Input, Card, LoadingScreen as Loading, EmptyState } from '../ui';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { ContactInfo, SocialLink } from '../../../shared/types';

export const ContactManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [formData, setFormData] = useState<ContactInfo>({
    email: '',
    phone: '',
    location: '',
    socialLinks: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getContactInfoAdmin();
      if (data) {
        setFormData(data);
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await portfolioService.updateContactInfo(formData);
      alert('Contact info saved successfully!');
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to save contact info');
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

  if (loading) return <Loading />;

  if (!hasData) {
    return (
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold text-tokyo-fg mb-6">Contact Information</h2>
        <EmptyState 
          message="Using fallback configuration as no data found in database"
          actionLabel="Add Contact Info"
          onAction={() => setHasData(true)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold text-tokyo-fg mb-6">Contact Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-tokyo-blue mb-4">Basic Contact Info</h3>
          
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Phone (Optional)"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Input
              label="Location (Optional)"
              placeholder="San Francisco, CA"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
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
                  placeholder="GitHub, LinkedIn, LeetCode, etc."
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  className="flex-1"
                />
                <Input
                  label="URL"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  className="flex-1"
                />
                <Input
                  label="Icon (Lucide name)"
                  placeholder="Github, Linkedin, Code"
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
