#!/usr/bin/env node

/**
 * Script to implement enhanced Todo UI components with:
 * - Bento Grid layout
 * - Glassmorphism effects
 * - Framer Motion animations
 * - Responsive design
 */

const fs = require('fs');
const path = require('path');

// Create the enhanced components
function createEnhancedComponents() {
  // Create the enhanced TaskItem component
  const taskItemComponent = `import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Task } from '@/types/task';
import { updateTaskPartial, deleteTask } from '@/lib/api';
import { Trash2, Pencil, CheckCircle, X, Circle } from 'lucide-react';

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ y: -2 }}
      className={\`\${task.completed ? 'bg-slate-800/30' : 'bg-slate-800/50'} glass-card rounded-xl backdrop-blur-md border border-white/10 p-4 mb-3 hover:border-indigo-400/30 transition-all duration-300\`}
    >
      {task.completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 z-10"
        >
          <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
            Completed
          </span>
        </motion.div>
      )}

      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 pt-0.5">
          <button
            onClick={toggleCompletion}
            disabled={loading}
            className={\`h-6 w-6 rounded-full flex items-center justify-center transition-colors \${task.completed ? 'bg-indigo-500' : 'border-2 border-slate-400 hover:border-indigo-400'}\`}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? (
              <CheckCircle className="h-4 w-4 text-white" />
            ) : (
              <Circle className="h-4 w-4 text-transparent" />
            )}
          </button>
        </div>

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
            <div className="space-y-1">
              <motion.h3
                className={\`text-lg font-medium break-words \${task.completed ? 'text-indigo-300 line-through' : 'text-white'}\`}
                animate={{ color: task.completed ? '#c7d2fe' : '#ffffff' }}
              >
                {task.title}
              </motion.h3>
              {task.description && (
                <p className={\`text-base break-words \${task.completed ? 'text-indigo-200/70' : 'text-slate-300'}\`}>
                  {task.description}
                </p>
              )}
            </div>
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

  // Create the enhanced TaskList component
  const taskListComponent = `import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '@/types/task';
import { EnhancedTaskItem } from '@/components/tasks/EnhancedTaskItem';
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

export function EnhancedTaskList({ tasks, loading, error, onTaskUpdate, onTaskDelete, showOnlyCompleted = false, onCreateTask }: TaskListProps) {
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
        className="glass-card p-6 rounded-xl backdrop-blur-md border border-white/10"
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
    return <EmptyState {...(onCreateTask ? { onCreateTask } : {})} />;
  }

  return (
    <motion.div
      layout
      className="space-y-3"
    >
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <EnhancedTaskItem
            key={task.id}
            task={task}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}`;

  // Create the enhanced Dashboard layout
  const dashboardLayout = `import { motion } from 'framer-motion';
import { Plus, CheckCircle, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
}

interface DashboardLayoutProps {
  stats: DashboardStats;
  children: React.ReactNode;
  onCreateTask: () => void;
}

export function DashboardLayout({ stats, children, onCreateTask }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words">My Tasks</h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed break-words">Manage your tasks efficiently</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateTask}
            className="btn-primary min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </motion.button>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Total Tasks</h3>
            </div>
            <p className="text-3xl font-bold text-indigo-400">{stats.totalTasks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">{stats.completedTasks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Overdue</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{stats.overdueTasks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Upcoming</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{stats.upcomingTasks}</p>
          </motion.div>
        </div>

        {/* Task List Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl backdrop-blur-md border border-white/10 p-1"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}`;

  // Create the mobile bottom sheet component
  const bottomSheetComponent = `import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-xl z-50 p-4 rounded-t-3xl border-t border-white/10"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Create New Task</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}`;

  // Create the enhanced empty state
  const emptyStateComponent = `import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface EmptyStateProps {
  onCreateTask?: () => void;
}

export function EnhancedEmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500/20 mb-4"
      >
        <CheckCircle className="h-8 w-8 text-indigo-400" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-2 text-xl sm:text-2xl font-bold text-white break-words"
      >
        All Caught Up!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-2 text-slate-400 max-w-md mx-auto leading-relaxed break-words"
      >
        You have completed all your tasks. Take a moment to celebrate your productivity!
      </motion.p>

      {onCreateTask && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateTask}
            className="btn-primary mx-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-6 rounded-lg text-sm font-medium transition-colors"
          >
            Create New Task
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}`;

  // Write the components to files
  const componentsDir = path.join(process.cwd(), 'frontend', 'components', 'tasks');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(componentsDir, 'EnhancedTaskItem.tsx'), taskItemComponent);
  fs.writeFileSync(path.join(componentsDir, 'EnhancedTaskList.tsx'), taskListComponent);
  fs.writeFileSync(path.join(componentsDir, 'EnhancedEmptyState.tsx'), emptyStateComponent);

  // Create a dashboard directory if it doesn't exist
  const dashboardDir = path.join(process.cwd(), 'frontend', 'components', 'dashboard');
  if (!fs.existsSync(dashboardDir)) {
    fs.mkdirSync(dashboardDir, { recursive: true });
  }

  fs.writeFileSync(path.join(dashboardDir, 'DashboardLayout.tsx'), dashboardLayout);

  // Create a ui directory if it doesn't exist
  const uiDir = path.join(process.cwd(), 'frontend', 'components', 'ui');
  if (!fs.existsSync(uiDir)) {
    fs.mkdirSync(uiDir, { recursive: true });
  }

  fs.writeFileSync(path.join(uiDir, 'BottomSheet.tsx'), bottomSheetComponent);

  console.log('✅ Enhanced UI components created successfully!');
  console.log('- EnhancedTaskItem.tsx');
  console.log('- EnhancedTaskList.tsx');
  console.log('- EnhancedEmptyState.tsx');
  console.log('- DashboardLayout.tsx');
  console.log('- BottomSheet.tsx');
}

// Update tailwind config to include glassmorphism classes
function updateTailwindConfig() {
  const tailwindConfigPath = path.join(process.cwd(), 'frontend', 'tailwind.config.ts');

  if (fs.existsSync(tailwindConfigPath)) {
    let configContent = fs.readFileSync(tailwindConfigPath, 'utf8');

    // Check if glassmorphism is already defined
    if (!configContent.includes('glass')) {
      // Add glassmorphism utilities to the config
      const glassConfig = `
      extend: {
        colors: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554',
          },
          secondary: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            950: '#022c22',
          },
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16',
          },
          error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            950: '#450a0a',
          },
          background: {
            DEFAULT: '#0f172a', // midnight theme
            light: '#1e293b',
            card: '#1e293b',
          },
          text: {
            primary: '#f8fafc', // white
            secondary: '#cbd5e1', // slate-200
            muted: '#94a3b8', // slate-400
            disabled: '#64748b', // slate-500
          },
          border: {
            DEFAULT: '#334155', // slate-700
            light: '#475569', // slate-600
            dark: '#1e293b', // slate-800
          },
          accent: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
          // Midnight & Electric theme
          'midnight': {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
          },
          'electric': {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
        },
        boxShadow: {
          'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          'glass': 'rgba(255, 255, 255, 0.1) 0px 0px 10px, inset rgba(255, 255, 255, 0.2) 0px 0px 10px',
        },
      },`;

      configContent = configContent.replace(/extend:\s*{/, glassConfig);
      fs.writeFileSync(tailwindConfigPath, configContent);

      console.log('✅ Tailwind config updated with glassmorphism and midnight theme!');
    }
  }
}

// Install required dependencies
function installDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'frontend', 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Add framer-motion if not already present
    if (!packageJson.dependencies['framer-motion']) {
      packageJson.dependencies['framer-motion'] = '^11.0.0';

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Added framer-motion to dependencies!');
      console.log('Please run: cd frontend && npm install');
    }
  }
}

// Main execution
function main() {
  console.log('🚀 Starting Todo UI/UX Enhancement Setup...');

  createEnhancedComponents();
  updateTailwindConfig();
  installDependencies();

  console.log('\\n🎉 Setup complete!');
  console.log('\\nNext steps:');
  console.log('1. Run: cd frontend && npm install');
  console.log('2. Update your dashboard page to use the new components');
  console.log('3. Customize the glass card classes as needed');
}

main();