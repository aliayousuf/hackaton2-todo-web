#!/usr/bin/env node

/**
 * Script to implement comprehensive animations with Framer Motion
 */

const fs = require('fs');
const path = require('path');

function createAnimationUtils() {
  // Create animation variants utility
  const animationVariants = `import { Variants } from 'framer-motion';

// Common animation variants for the Todo app
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideInFromTop = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideInFromBottom = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideInFromLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideInFromRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { duration: 0.2 }
};

export const scaleInOut = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { duration: 0.2 }
};

export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export const taskItem = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: { duration: 0.2 }
  },
  whileHover: {
    y: -2,
    transition: { duration: 0.2 }
  },
  whileTap: { scale: 0.98 }
};

export const completionAnimation = {
  initial: { scale: 1, rotate: 0 },
  animate: {
    scale: 1.1,
    rotate: 4,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    rotate: -4,
    transition: { duration: 0.3 }
  }
};

export const bounce = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: 0,
      ease: "easeInOut"
    }
  }
};

export const pulse = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const shake = {
  animate: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};
`;

  // Create animation hooks
  const animationHooks = `import { useState, useEffect } from 'react';

// Custom hook for managing animation states
export function useAnimationState() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState('');
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);

  const startAnimation = (type = '', itemId = 0) => {
    setIsAnimating(true);
    setAnimationType(type);

    if (itemId) {
      setAnimatedItems(prev => [...prev, itemId]);
    }

    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType('');

      if (itemId) {
        setAnimatedItems(prev => prev.filter(id => id !== itemId));
      }
    }, 500);
  };

  return {
    isAnimating,
    animationType,
    animatedItems,
    startAnimation
  };
}

// Custom hook for staggered animations
export function useStaggeredAnimation(itemsCount: number, delay = 0.1) {
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const interval = delay * 1000;

    const showNextItem = () => {
      setVisibleItems(prev => {
        if (prev >= itemsCount) {
          clearInterval(timer as any);
          return prev;
        }
        return prev + 1;
      });
    };

    // Show first item immediately
    setVisibleItems(1);

    // Set up intervals for remaining items
    if (itemsCount > 1) {
      timer = setInterval(showNextItem, interval);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [itemsCount, delay]);

  return visibleItems;
}

// Custom hook for page transition animations
export function usePageTransition() {
  const [transitionState, setTransitionState] = useState<'idle' | 'entering' | 'entered' | 'exiting'>('idle');

  const startEntering = () => {
    setTransitionState('entering');
    setTimeout(() => setTransitionState('entered'), 300);
  };

  const startExiting = () => {
    setTransitionState('exiting');
    setTimeout(() => setTransitionState('idle'), 300);
  };

  return {
    transitionState,
    startEntering,
    startExiting
  };
}`;

  // Create animated UI components
  const animatedComponents = `import { motion, AnimatePresence } from 'framer-motion';
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
      className={\`\${task.completed ? 'bg-slate-800/30' : 'bg-slate-800/50'} glass-card rounded-xl backdrop-blur-md border border-white/10 p-4 mb-3 transition-all duration-300\`}
    >
      {task.completed && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-3 right-3 z-10"
        >
          <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
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
            variants={bounce}
            whileHover="animate"
            whileTap="animate"
            className={\`\${task.completed ? 'bg-indigo-500' : 'border-2 border-slate-400 hover:border-indigo-400'} h-6 w-6 rounded-full flex items-center justify-center transition-colors\`}
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
                className="input-base w-full text-lg font-medium bg-slate-700/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                placeholder="Task title..."
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-base w-full bg-slate-700/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400"
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
              <h3 className={\`text-lg font-medium break-words \${task.completed ? 'text-indigo-300' : 'text-white'}\`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={\`text-base break-words \${task.completed ? 'text-indigo-200/70' : 'text-slate-300'}\`}>
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
      className={\`\${baseClasses} \${variantClasses[variant]} \${className} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
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
      className={\`\${sizeClasses[size]} \${className}\`}
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
}`;

  // Create the animation utilities directory
  const libDir = path.join(process.cwd(), 'frontend', 'lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  fs.writeFileSync(path.join(libDir, 'animations.ts'), animationVariants);
  fs.writeFileSync(path.join(libDir, 'animation-hooks.ts'), animationHooks);

  // Create animated components directory
  const animatedDir = path.join(process.cwd(), 'frontend', 'components', 'ui');
  if (!fs.existsSync(animatedDir)) {
    fs.mkdirSync(animatedDir, { recursive: true });
  }

  fs.writeFileSync(path.join(animatedDir, 'AnimatedComponents.tsx'), animatedComponents);

  console.log('✅ Animation utilities and components created successfully!');
  console.log('- animations.ts (animation variants)');
  console.log('- animation-hooks.ts (custom hooks)');
  console.log('- AnimatedComponents.tsx (animated UI components)');
}

function updateExistingComponents() {
  // Update the EnhancedTaskItem component to use animations
  const enhancedTaskItemPath = path.join(process.cwd(), 'frontend', 'components', 'tasks', 'EnhancedTaskItem.tsx');

  if (fs.existsSync(enhancedTaskItemPath)) {
    const animatedTaskItem = `import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Task } from '@/types/task';
import { updateTaskPartial, deleteTask } from '@/lib/api';
import { Trash2, Pencil, CheckCircle, X, Circle } from 'lucide-react';
import { taskItem, completionAnimation, bounce } from '@/lib/animations';

interface TaskItemProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
}

export function EnhancedTaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);

  const toggleCompletion = async () => {
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
      variants={taskItem}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="whileHover"
      whileTap="whileTap"
      className={\`\${task.completed ? 'bg-slate-800/30' : 'bg-slate-800/50'} glass-card rounded-xl backdrop-blur-md border border-white/10 p-4 mb-3 transition-all duration-300\`}
    >
      {task.completed && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-3 right-3 z-10"
        >
          <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
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
            onClick={toggleCompletion}
            disabled={loading}
            variants={bounce}
            whileHover="animate"
            whileTap="animate"
            className={\`\${task.completed ? 'bg-indigo-500' : 'border-2 border-slate-400 hover:border-indigo-400'} h-6 w-6 rounded-full flex items-center justify-center transition-colors\`}
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
                className="input-base w-full text-lg font-medium bg-slate-700/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                placeholder="Task title..."
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-base w-full bg-slate-700/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400"
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
              <h3 className={\`text-lg font-medium break-words \${task.completed ? 'text-indigo-300' : 'text-white'}\`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={\`text-base break-words \${task.completed ? 'text-indigo-200/70' : 'text-slate-300'}\`}>
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              className="btn-secondary flex items-center gap-1 px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
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
}`;

    fs.writeFileSync(enhancedTaskItemPath, animatedTaskItem);
    console.log('✅ EnhancedTaskItem updated with animations!');
  }
}

// Main execution
function main() {
  console.log('🎭 Implementing comprehensive animations with Framer Motion...');

  createAnimationUtils();
  updateExistingComponents();

  console.log('\\n🎉 Animation implementation complete!');
  console.log('\\nFeatures implemented:');
  console.log('1. Comprehensive animation variants');
  console.log('2. Custom animation hooks');
  console.log('3. Animated UI components');
  console.log('4. Optimistic completion animations');
  console.log('5. Layout transition animations');
  console.log('6. Micro-interactions and hover effects');
}

main();