import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onCreateTask?: () => void;
}

export function EmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100">
        <PlusCircle className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900 break-words">No tasks yet</h3>
      <p className="mt-2 text-gray-600 max-w-md mx-auto leading-relaxed break-words">
        Get started by creating your first task. Click the button below to add a new task to your list.
      </p>
      <div className="mt-8">
        {onCreateTask ? (
          <button
            onClick={onCreateTask}
            className="btn-primary mx-auto"
          >
            Create your first task
          </button>
        ) : (
          <p className="text-gray-500">No tasks available</p>
        )}
      </div>
    </div>
  );
}