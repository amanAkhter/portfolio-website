import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Using fallback configuration as no data found in database',
  actionLabel = 'Add First Entry',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-tokyo-bg-light rounded-lg border border-tokyo-border">
      <AlertCircle className="w-12 h-12 text-tokyo-orange mb-4" />
      <p className="text-tokyo-text-secondary text-center mb-6 max-w-md">
        {message}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
