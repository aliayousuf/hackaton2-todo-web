#!/usr/bin/env node

/**
 * Script to implement accessibility features and keyboard navigation
 */

const fs = require('fs');
const path = require('path');

function createAccessibilityUtils() {
  // Create accessibility utilities
  const accessibilityUtils = `import { useState, useEffect, useCallback } from 'react';

// Focus trap utility for modals and bottom sheets
export function useFocusTrap(ref, isActive) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus first element when activated
    firstElement.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, ref]);
}

// Keyboard navigation utilities
export function useKeyboardNavigation(itemsCount, currentIndex, setCurrentIndex) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentIndex(prev => Math.min(prev + 1, itemsCount - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentIndex(itemsCount - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [itemsCount, setCurrentIndex]);
}

// Announce utility for screen readers
export function useAnnouncer() {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!announcement) return;

    const announcementElement = document.createElement('div');
    announcementElement.setAttribute('aria-live', 'polite');
    announcementElement.setAttribute('aria-atomic', 'true');
    announcementElement.className = 'sr-only';
    announcementElement.textContent = announcement;

    document.body.appendChild(announcementElement);

    return () => {
      document.body.removeChild(announcementElement);
    };
  }, [announcement]);

  const announce = useCallback((message) => {
    setAnnouncement(message);
  }, []);

  return { announce };
}

// Focus visible utility
export function useFocusVisible() {
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsUsingKeyboard(false);
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') setIsUsingKeyboard(true);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return isUsingKeyboard;
}

// ARIA attributes helper
export const ariaAttributes = {
  // Dialog attributes
  dialog: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'dialog-title',
    'aria-describedby': 'dialog-description'
  },

  // Alert attributes
  alert: {
    role: 'alert',
    'aria-live': 'assertive',
    'aria-atomic': 'true'
  },

  // Status attributes
  status: {
    role: 'status',
    'aria-live': 'polite',
    'aria-atomic': 'true'
  },

  // Progressbar attributes
  progressbar: {
    role: 'progressbar',
    'aria-valuenow': 0,
    'aria-valuemin': 0,
    'aria-valuemax': 100
  },

  // Listbox attributes
  listbox: {
    role: 'listbox',
    'aria-orientation': 'vertical'
  },

  // Option attributes
  option: {
    role: 'option',
    'aria-selected': 'false'
  }
};

// Focus management utilities
export function useFocusManagement() {
  const focusPreviousElement = useCallback(() => {
    const previousElement = document.querySelector('[data-last-focused]');
    if (previousElement) {
      previousElement.focus();
    }
  }, []);

  const storeFocus = useCallback(() => {
    const currentElement = document.activeElement;
    if (currentElement) {
      currentElement.setAttribute('data-last-focused', 'true');
    }
  }, []);

  const restoreFocus = useCallback(() => {
    const lastFocused = document.querySelector('[data-last-focused]');
    if (lastFocused) {
      lastFocused.focus();
      lastFocused.removeAttribute('data-last-focused');
    }
  }, []);

  return { focusPreviousElement, storeFocus, restoreFocus };
}

// Keyboard shortcut handler
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey;
      const alt = e.altKey;
      const shift = e.shiftKey;

      shortcuts.forEach(({ keys, handler }) => {
        if (
          keys.key === key &&
          !!keys.ctrl === ctrl &&
          !!keys.alt === alt &&
          !!keys.shift === shift
        ) {
          e.preventDefault();
          handler();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

// High contrast mode detector
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleChange = (e) => setIsHighContrast(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    setIsHighContrast(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isHighContrast;
}

// Reduced motion detector
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e) => setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    setPrefersReducedMotion(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

// Screen reader only styles
export const srOnlyStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0'
};
`;

  // Create accessible components
  const accessibleComponents = `import { forwardRef, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFocusTrap, useFocusVisible, ariaAttributes, srOnlyStyle } from '@/lib/accessibility';
import { useReducedMotion } from '@/lib/accessibility';

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  visuallyHiddenText?: string;
  isLoading?: boolean;
  animate?: boolean;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    visuallyHiddenText,
    isLoading = false,
    animate = true,
    className = '',
    ...props
  }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const isFocusVisible = useFocusVisible();

    const variantClasses = {
      primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900',
      secondary: 'bg-slate-600 hover:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900',
      destructive: 'bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const animationProps = prefersReducedMotion || !animate ? {} : {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 }
    };

    return (
      <motion.button
        ref={ref}
        {...animationProps}
        className={\`\${variantClasses[variant]} \${sizeClasses[size]} text-white rounded-lg font-medium transition-colors \${isFocusVisible ? 'focus:outline-none' : ''} \${className} \${isLoading ? 'opacity-75 cursor-not-allowed' : ''}\`}
        disabled={isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {children}
        {visuallyHiddenText && (
          <span style={srOnlyStyle}>{visuallyHiddenText}</span>
        )}
      </motion.button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

// Accessible Modal Component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md'
}: AccessibleModalProps) {
  const modalRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useFocusTrap(modalRef, isOpen);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.95, opacity: 0 }}
        animate={prefersReducedMotion ? { scale: 1 } : { scale: 1, opacity: 1 }}
        exit={prefersReducedMotion ? { scale: 1 } : { scale: 0.95, opacity: 0 }}
        className={\`glass-modal \${sizeClasses[size]} w-full rounded-xl backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden\`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        tabIndex={-1}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="modal-title"
              className="text-xl font-bold text-white"
            >
              {title}
            </h2>
            <AccessibleButton
              onClick={onClose}
              variant="secondary"
              size="sm"
              aria-label="Close modal"
            >
              ×
            </AccessibleButton>
          </div>

          {description && (
            <p
              id="modal-description"
              className="text-slate-300 mb-4"
            >
              {description}
            </p>
          )}

          <div>
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Accessible Task Item Component
interface AccessibleTaskItemProps {
  task: any; // Replace with actual Task type
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  isActive?: boolean;
  onFocus?: () => void;
}

export function AccessibleTaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  isActive = false,
  onFocus
}: AccessibleTaskItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isFocusVisible = useFocusVisible();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onToggle(task.id);
        break;
      case 'Delete':
        onDelete(task.id);
        break;
      case 'F2':
        e.preventDefault();
        onEdit(task.id);
        break;
    }
  };

  return (
    <motion.div
      ref={itemRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ y: -2 }}
      className={\`\${task.completed ? 'bg-slate-800/30' : 'bg-slate-800/50'} glass-card rounded-xl backdrop-blur-md border \${isActive ? 'border-indigo-400 ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' : 'border-white/10'} p-4 mb-3 transition-all duration-300 \${isFocusVisible && isActive ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' : ''}\`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      role="listitem"
      aria-selected={isActive}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 pt-0.5">
          <AccessibleButton
            onClick={() => onToggle(task.id)}
            variant={task.completed ? 'primary' : 'secondary'}
            size="sm"
            className={\`h-6 w-6 rounded-full flex items-center justify-center \${task.completed ? 'bg-indigo-500' : 'border-2 border-slate-400'}\`}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? '✓' : ''}
          </AccessibleButton>
        </div>

        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <h3 className={\`text-lg font-medium break-words \${task.completed ? 'text-indigo-300 line-through' : 'text-white'}\`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={\`text-base break-words \${task.completed ? 'text-indigo-200/70' : 'text-slate-300'}\`}>
                {task.description}
              </p>
            )}
          </div>

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
        <AccessibleButton
          onClick={() => onEdit(task.id)}
          variant="secondary"
          size="sm"
          aria-label="Edit task"
        >
          ✏️
        </AccessibleButton>
        <AccessibleButton
          onClick={() => onDelete(task.id)}
          variant="destructive"
          size="sm"
          aria-label="Delete task"
        >
          🗑️
        </AccessibleButton>
      </div>
    </motion.div>
  );
}

// Accessible Task List Component
interface AccessibleTaskListProps {
  tasks: any[]; // Replace with actual Task type
  onTaskUpdate: (task: any) => void;
  onTaskDelete: (id: number) => void;
  children?: React.ReactNode;
}

export function AccessibleTaskList({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  children
}: AccessibleTaskListProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const focusedTask = tasks[focusedIndex];

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.focus();
      }
    }
  }, [focusedIndex]);

  return (
    <div className="space-y-3" role="list" aria-label="Task list">
      {tasks.map((task, index) => (
        <AccessibleTaskItem
          key={task.id}
          task={task}
          onToggle={(id) => {
            // Toggle completion logic
            onTaskUpdate({...task, completed: !task.completed});
          }}
          onDelete={onTaskDelete}
          onEdit={() => {
            // Edit logic
          }}
          isActive={focusedIndex === index}
          onFocus={() => setFocusedIndex(index)}
        />
      ))}
      {children}
    </div>
  );
}`;

  // Create the accessibility utilities directory
  const libDir = path.join(process.cwd(), 'frontend', 'lib');
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  fs.writeFileSync(path.join(libDir, 'accessibility.ts'), accessibilityUtils);

  // Create accessible components directory
  const uiDir = path.join(process.cwd(), 'frontend', 'components', 'ui');
  if (!fs.existsSync(uiDir)) {
    fs.mkdirSync(uiDir, { recursive: true });
  }

  fs.writeFileSync(path.join(uiDir, 'AccessibleComponents.tsx'), accessibleComponents);

  console.log('✅ Accessibility utilities and components created successfully!');
  console.log('- accessibility.ts (accessibility utilities)');
  console.log('- AccessibleComponents.tsx (accessible UI components)');
}

function updateGlobalStyles() {
  // Update global CSS to include accessibility-focused styles
  const globalsPath = path.join(process.cwd(), 'frontend', 'app', 'globals.css');

  if (fs.existsSync(globalsPath)) {
    let cssContent = fs.readFileSync(globalsPath, 'utf8');

    // Add accessibility-focused styles if not already present
    if (!cssContent.includes('focus-visible')) {
      const accessibilityStyles = `
/* Accessibility-focused styles */
.focus-visible {
  outline: 2px solid #6366f1; /* indigo-500 */
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .glass-card {
    border: 2px solid #ffffff;
    box-shadow: 0 0 0 2px #000000;
  }

  .btn-primary {
    border: 2px solid #ffffff;
  }

  .btn-secondary {
    border: 2px solid #ffffff;
  }

  .btn-destructive {
    border: 2px solid #ffffff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Skip to main content link for screen readers */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000000;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus indicators for keyboard users */
*:focus {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Ensure sufficient color contrast */
.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 shadow-lg;
}

.text-high-contrast {
  @apply text-white;
}

.bg-high-contrast {
  @apply bg-slate-900;
}

/* Interactive element enhancements */
.btn-primary,
.btn-secondary,
.btn-destructive {
  @apply transition-colors duration-200 ease-in-out;
}

.btn-primary:focus,
.btn-secondary:focus,
.btn-destructive:focus {
  @apply ring-2 ring-offset-2 ring-offset-slate-900;
}

/* Form element accessibility */
.input-base:focus {
  @apply ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900;
}

.input-error:focus {
  @apply ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-900;
}

/* Link accessibility */
a:focus {
  @apply ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900;
}

/* Ensure all interactive elements have proper focus */
button,
input,
select,
textarea,
a[href],
[tabindex] {
  @apply focus:outline-none;
}

/* Enhanced focus for high contrast mode */
@media (prefers-contrast: high) {
  *:focus {
    outline: 3px solid #ffffff;
    outline-offset: 2px;
  }
}`;

      fs.appendFileSync(globalsPath, accessibilityStyles);
      console.log('✅ Global CSS updated with accessibility styles!');
    }
  }
}

function updateExistingComponents() {
  // Update the dashboard layout to include accessibility features
  const dashboardLayoutPath = path.join(process.cwd(), 'frontend', 'components', 'dashboard', 'DashboardLayout.tsx');

  if (fs.existsSync(dashboardLayoutPath)) {
    const accessibleDashboardLayout = `import { motion } from 'framer-motion';
import { Plus, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { useReducedMotion } from '@/lib/accessibility';

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
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6"
      role="main"
      aria-label="Task dashboard"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white break-words"
              id="dashboard-title"
            >
              My Tasks
            </h1>
            <p
              className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed break-words"
              id="dashboard-description"
            >
              Manage your tasks efficiently
            </p>
          </div>
          <motion.button
            whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
            whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            onClick={onCreateTask}
            className="btn-primary min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-describedby="dashboard-description"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </motion.button>
        </motion.div>

        {/* Bento Grid Layout */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          role="region"
          aria-labelledby="stats-heading"
        >
          <h2 id="stats-heading" className="sr-only">Task Statistics</h2>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={!prefersReducedMotion ? { delay: 0.1 } : {}}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col"
            role="article"
            aria-labelledby="total-tasks-label"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-indigo-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white"
                id="total-tasks-label"
              >
                Total Tasks
              </h3>
            </div>
            <p className="text-3xl font-bold text-indigo-400" aria-label="Total tasks count">
              {stats.totalTasks}
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={!prefersReducedMotion ? { delay: 0.2 } : {}}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col"
            role="article"
            aria-labelledby="completed-label"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white"
                id="completed-label"
              >
                Completed
              </h3>
            </div>
            <p className="text-3xl font-bold text-green-400" aria-label="Completed tasks count">
              {stats.completedTasks}
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={!prefersReducedMotion ? { delay: 0.3 } : {}}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col"
            role="article"
            aria-labelledby="overdue-label"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white"
                id="overdue-label"
              >
                Overdue
              </h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400" aria-label="Overdue tasks count">
              {stats.overdueTasks}
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={!prefersReducedMotion ? { delay: 0.4 } : {}}
            className="glass-card p-5 rounded-xl backdrop-blur-md border border-white/10 flex flex-col"
            role="article"
            aria-labelledby="upcoming-label"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <h3
                className="text-lg font-semibold text-white"
                id="upcoming-label"
              >
                Upcoming
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-400" aria-label="Upcoming tasks count">
              {stats.upcomingTasks}
            </p>
          </motion.div>
        </div>

        {/* Task List Container */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={!prefersReducedMotion ? { delay: 0.5 } : {}}
          className="glass-card rounded-xl backdrop-blur-md border border-white/10 p-1"
          role="region"
          aria-labelledby="task-list-heading"
        >
          <h2 id="task-list-heading" className="sr-only">Task List</h2>
          {children}
        </motion.div>
      </div>
    </div>
  );
}`;

    fs.writeFileSync(dashboardLayoutPath, accessibleDashboardLayout);
    console.log('✅ Dashboard layout updated with accessibility features!');
  }
}

// Main execution
function main() {
  console.log('♿ Implementing accessibility features and keyboard navigation...');

  createAccessibilityUtils();
  updateGlobalStyles();
  updateExistingComponents();

  console.log('\\n🎉 Accessibility implementation complete!');
  console.log('\\nFeatures implemented:');
  console.log('1. Focus management utilities');
  console.log('2. Keyboard navigation hooks');
  console.log('3. Screen reader announcements');
  console.log('4. Focus visibility detection');
  console.log('5. ARIA attribute helpers');
  console.log('6. Accessible UI components');
  console.log('7. Reduced motion support');
  console.log('8. High contrast mode support');
  console.log('9. Proper ARIA roles and labels');
  console.log('10. Keyboard shortcut handling');
}

main();