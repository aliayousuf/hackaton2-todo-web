import { forwardRef, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { useFocusVisible } from '@/lib/accessibility';
import { useReducedMotion } from '@/lib/accessibility';
import type { ComponentPropsWithoutRef } from 'react';

// Define a type that combines React button props with Motion props
type MotionButtonProps = HTMLMotionProps<'button'> & ComponentPropsWithoutRef<'button'>;

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  visuallyHiddenText?: string;
  isLoading?: boolean;
  animate?: boolean;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (props, ref) => {
    const {
      children,
      variant = 'primary',
      size = 'md',
      visuallyHiddenText,
      isLoading = false,
      animate = true,
      className = '',
      ...restProps
    } = props;
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
        className={`${variantClasses[variant]} ${sizeClasses[size]} text-white rounded-lg font-medium transition-colors ${isFocusVisible ? 'focus:outline-none' : ''} ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        disabled={isLoading || restProps.disabled}
        aria-busy={isLoading}
        {...restProps as any}
      >
        {children}
        {visuallyHiddenText && (
          <span style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: '0'
          }}>
            {visuallyHiddenText}
          </span>
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
  const modalRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
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

    // Focus first element when modal opens
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.95, opacity: 0 }}
        animate={prefersReducedMotion ? { scale: 1 } : { scale: 1, opacity: 1 }}
        exit={prefersReducedMotion ? { scale: 1 } : { scale: 0.95, opacity: 0 }}
        className={`glass-modal ${sizeClasses[size]} w-full rounded-xl backdrop-blur-xl border border-white border-opacity-10 shadow-2xl overflow-hidden`}
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
      className={`${task.completed ? 'bg-slate-800 bg-opacity-30' : 'bg-slate-800 bg-opacity-50'} glass-card rounded-xl backdrop-blur-md border ${isActive ? 'border-indigo-400 ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' : 'border-white border-opacity-10'} p-4 mb-3 transition-all duration-300 ${isFocusVisible && isActive ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900' : ''} relative`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      role="listitem"
      aria-selected={isActive}
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
        <div className="flex-shrink-0 pt-0.5">
          <AccessibleButton
            onClick={() => onToggle(task.id)}
            variant={task.completed ? 'primary' : 'secondary'}
            size="sm"
            className={`h-6 w-6 rounded-full flex items-center justify-center ${task.completed ? 'bg-indigo-500' : 'border-2 border-slate-400'}`}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? '✓' : ''}
          </AccessibleButton>
        </div>

        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <h3 className={`text-lg font-medium break-words ${task.completed ? 'text-indigo-300 line-through' : 'text-white'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-base break-words ${task.completed ? 'text-indigo-200 text-opacity-70' : 'text-slate-300'}`}>
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
}