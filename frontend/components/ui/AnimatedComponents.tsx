import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Pencil, Trash2, X, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { taskItem, completionAnimation, bounce, pulse } from '@/lib/animations';
import type { Task } from '@/types/task';

interface AnimatedTaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, updates: Partial<Task>) => void;
}

export function AnimatedTaskItem({ task, onToggle, onDelete, onEdit }: AnimatedTaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSaveEdit = () => {
    onEdit(task.id, { title: editTitle, description: editDescription });
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      variants={taskItem}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="whileHover"
      whileTap="whileTap"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={`${task.completed ? 'bg-slate-800 bg-opacity-30' : 'bg-slate-800 bg-opacity-50'} glass-card rounded-xl backdrop-blur-md border border-white border-opacity-10 p-4 mb-3 transition-all duration-300`}
    >
      {task.completed && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-3 right-3 z-10"
        >
          <span className="inline-flex items-center rounded-full bg-indigo-500 bg-opacity-20 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
            Completed
          </span>
        </motion.div>
      )}

      <div className="flex items-start gap-3 flex-1 min-w-0">
        <motion.div
          className="flex-shrink-0 pt-0.5"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.button
            onClick={() => onToggle(task.id)}
            disabled={task.completed}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
              <h3 className={`text-lg font-medium break-words ${task.completed ? 'text-indigo-300' : 'text-white'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-base break-words ${task.completed ? 'text-indigo-200 text-opacity-70' : 'text-slate-300'}`}>
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
      </div>

      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
        {isEditing ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveEdit}
              className="btn-primary flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
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
              className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
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
              className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
              title="Edit task"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Edit</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(task.id)}
              className="btn-destructive flex items-center gap-1 px-3 py-1.5 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Delete</span>
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  className?: string;
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = ''
}: AnimatedButtonProps) {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors";

  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-slate-600 hover:bg-slate-700 text-white",
    destructive: "bg-rose-600 hover:bg-rose-700 text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

interface AnimatedSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AnimatedSpinner({ size = 'md', className = '' }: AnimatedSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );
}

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ from, to, duration = 1, className = '' }: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        content: [from.toString(), to.toString()]
      }}
      transition={{
        duration: duration,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      className={className}
    >
      {to}
    </motion.span>
  );
}