import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Task } from '@/types/task';
import { updateTaskPartial, deleteTask } from '@/lib/api';
import { Trash2, Pencil, CheckCircle, X, Circle } from 'lucide-react';
import { taskItem, completionAnimation } from '@/lib/animations';

interface TaskItemProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
  onToggle: ((taskId: number) => void) | undefined;
}

export function EnhancedTaskItem({ task, onUpdate, onDelete, onToggle }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);

  const toggleCompletion = async () => {
    if (onToggle) {
      // Use the optimistic toggle callback if provided
      onToggle(task.id);
    } else {
      // Otherwise use the traditional approach
      setLoading(true);
      try {
        const result = await updateTaskPartial(task.id, {
          completed: !task.completed,
        });
        if (result.success && result.data) {
          onUpdate(result.data);
        }
      } catch (error) {
        console.error('Error updating task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const result = await updateTaskPartial(task.id, {
        title: editTitle,
        description: editDescription,
      });
      if (result.success && result.data) {
        onUpdate(result.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteTask(task.id);
      if (result.success) {
        onDelete(task.id);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      className={`${
        task.completed
          ? 'bg-[rgba(255,255,255,0.1)]'
          : 'bg-[rgba(255,255,255,0.05)]'
      } glass-card p-6 mb-4 transition-all duration-300 relative`}
      whileHover={{ y: -4 }}
    >
      {task.completed && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-4 right-4 z-10"
        >
          <span className="inline-flex items-center rounded-full bg-indigo-500 bg-opacity-20 px-3 py-1 text-xs font-medium text-indigo-300">
            Completed
          </span>
        </motion.div>
      )}

      <div className="flex items-center gap-4 flex-1 min-w-0"> {/* Fixed overlapping with flex items-center gap-4 */}
        <motion.div
          className="flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.button
            onClick={toggleCompletion}
            disabled={loading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${task.completed ? 'bg-indigo-500' : 'border-2 border-slate-400 hover:border-indigo-400'} h-6 w-6 rounded-full flex items-center justify-center transition-colors`}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <CheckCircle className="h-4 w-4 text-white" />
              </motion.div>
            ) : (
              <Circle className="h-4 w-4 text-transparent" />
            )}
          </motion.button>
        </motion.div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-base w-full text-lg font-medium bg-slate-700 bg-opacity-50 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                placeholder="Task title..."
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-base w-full bg-slate-700 bg-opacity-50 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                rows={3}
                placeholder="Task description..."
              />
            </div>
          ) : (
            <motion.div
              initial={false}
              animate={task.completed ? { textDecoration: 'line-through', color: '#c7d2fe' } : { textDecoration: 'none', color: '#ffffff' }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              <h3 className={`text-lg font-medium break-words ${task.completed ? 'text-indigo-300' : 'text-slate-100'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-base break-words ${task.completed ? 'text-indigo-200 text-opacity-70' : 'text-slate-400'}`}>
                  {task.description}
                </p>
              )}
            </motion.div>
          )}

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <span className="font-normal">Created:</span>
              <span>{new Date(task.created_at).toLocaleDateString()}</span>
            </div>
            {task.updated_at !== task.created_at && (
              <div className="flex items-center gap-1">
                <span className="font-normal">Updated:</span>
                <span>{new Date(task.updated_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveEdit}
                disabled={loading}
                className="btn-primary flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                  setEditDescription(task.description || '');
                }}
                disabled={loading}
                className="btn-secondary flex items-center gap-1 px-4 py-2 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="btn-secondary flex items-center gap-1 px-4 py-2 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
                title="Edit task"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Edit</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                disabled={loading || isDeleting}
                className="btn-destructive flex items-center gap-1 px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Delete</span>
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}