'use client';

import type { Task } from '@/types/task';
import { TaskItem } from '@/components/tasks/TaskItem';
import { EmptyState } from '@/components/tasks/EmptyState';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (deletedTaskId: number) => void;
  showOnlyCompleted?: boolean;
  onCreateTask?: () => void;
}

export function TaskList({ tasks, loading, error, onTaskUpdate, onTaskDelete, showOnlyCompleted = false, onCreateTask }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 break-words">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  const filteredTasks = showOnlyCompleted ? tasks.filter(task => task.completed) : tasks;

  if (filteredTasks.length === 0) {
    return <EmptyState {...(onCreateTask ? { onCreateTask } : {})} />;
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
        />
      ))}
    </div>
  );
}