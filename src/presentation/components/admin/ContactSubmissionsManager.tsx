import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../../core/usecases';
import { Button, Card, LoadingScreen as Loading } from '../ui';
import { Mail, Phone, Trash2, Eye, Clock, CheckCircle } from 'lucide-react';
import type { ContactSubmission } from '../../../shared/types';

export const ContactSubmissionsManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getAllContactSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await portfolioService.markSubmissionAsRead(id);
      loadData();
    } catch (error) {
      console.error('Error marking as read:', error);
      alert('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      await portfolioService.deleteContactSubmission(id);
      loadData();
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === 'unread') return !sub.read;
    if (filter === 'read') return sub.read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-tokyo-fg">Contact Submissions</h2>
          <p className="text-tokyo-fg-dark mt-1">
            {unreadCount > 0 && (
              <span className="text-tokyo-yellow">
                {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
              </span>
            )}
            {unreadCount === 0 && <span>No unread messages</span>}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({submissions.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('read')}
          >
            Read ({submissions.length - unreadCount})
          </Button>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="w-12 h-12 text-tokyo-fg-dark mx-auto mb-3" />
          <p className="text-tokyo-fg-dark">No submissions found</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className={`p-6 ${!submission.read ? 'border-tokyo-blue border-l-4' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-tokyo-fg">{submission.name}</h3>
                    {!submission.read && (
                      <span className="px-2 py-1 bg-tokyo-blue/20 text-tokyo-blue text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-tokyo-fg-dark mb-3">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${submission.email}`} className="hover:text-tokyo-blue">
                        {submission.email}
                      </a>
                    </div>
                    {submission.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${submission.phone}`} className="hover:text-tokyo-blue">
                          {submission.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(submission.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-tokyo-cyan font-medium mb-1">Subject:</p>
                    <p className="text-tokyo-fg">{submission.subject}</p>
                  </div>
                  <div>
                    <p className="text-tokyo-purple font-medium mb-1">Message:</p>
                    <p className="text-tokyo-fg whitespace-pre-wrap">{submission.message}</p>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!submission.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => submission.id && handleMarkAsRead(submission.id)}
                      title="Mark as read"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => submission.id && handleDelete(submission.id)}
                    className="text-tokyo-red hover:text-tokyo-red"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
