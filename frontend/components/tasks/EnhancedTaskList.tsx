import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '@/types/task';
import { EnhancedTaskItem } from '@/components/tasks/EnhancedTaskItem';
import { EnhancedEmptyState } from '@/components/tasks/EnhancedEmptyState';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskToggle?: (taskId: number) => void;
  showOnlyCompleted?: boolean;
  onCreateTask?: () => void;
}

export function EnhancedTaskList({ tasks, loading, error, onTaskUpdate, onTaskDelete, onTaskToggle, showOnlyCompleted = false, onCreateTask }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl backdrop-blur-md border border-white border-opacity-10"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-rose-300 break-words">{error}</h3>
          </div>
        </div>
      </motion.div>
    );
  }

  const filteredTasks = showOnlyCompleted ? tasks.filter(task => task.completed) : tasks;

  if (filteredTasks.length === 0) {
    return <EnhancedEmptyState {...(onCreateTask ? { onCreateTask } : {})} />;
  }

  return (
    <motion.div
      layout
      className="space-y-3"
    >
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EnhancedTaskItem
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              onToggle={onTaskToggle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}