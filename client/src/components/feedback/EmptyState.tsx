import { FolderOpen, AlertCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

const EmptyState = ({ icon: Icon = FolderOpen, title, description, className }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-secondary-500 dark:text-secondary-400 max-w-sm mb-4">{description}</p>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

const ErrorState = ({ title = 'Something went wrong', message, retry, className }: ErrorStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-error-500 dark:text-error-400" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{title}</h3>
      {message && (
        <p className="text-sm text-secondary-500 dark:text-secondary-400 max-w-sm mb-4">{message}</p>
      )}
      {retry && (
        <Button onClick={retry}>Try Again</Button>
      )}
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState = ({ message = 'Loading...', className }: LoadingStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 dark:border-primary-400" />
      <p className="mt-4 text-sm text-secondary-500 dark:text-secondary-400">{message}</p>
    </div>
  );
};

export { EmptyState, ErrorState, LoadingState };
