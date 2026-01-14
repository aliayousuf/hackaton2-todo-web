---
name: todo-ui-ux
description: Create world-class Todo application UI/UX with Tailwind CSS, Framer Motion, and modern design patterns. Use when building sophisticated, animated interfaces with glassmorphism effects, bento grid layouts, and responsive design for both desktop and mobile experiences.
---

# Todo UI/UX Skill

This skill provides comprehensive guidance for creating world-class Todo application interfaces with modern design patterns, animations, and responsive layouts.

## When to Use This Skill

Use this skill when you need to:
1. Create sophisticated Todo UI/UX with Tailwind CSS and Framer Motion
2. Implement bento grid layouts with glassmorphism effects
3. Build responsive designs with mobile bottom sheets
4. Add micro-interactions and smooth animations
5. Design progressive disclosure patterns and empty states
6. Create accessible interfaces with proper focus management

## Core Design Principles

### Visual Theme
- **Bento Grid Layout**: Create flexible grid systems that adapt to content
- **Glassmorphism Effects**: Use backdrop-blur for sidebar and modal elements
- **Midnight & Electric Theme**:
  - Background: `#0F172A` (deep charcoal)
  - Cards: `slate-800`
  - Primary Accent: `indigo-500`

### Responsive Design
- **Fluid Layout**: Adaptable components that work across screen sizes
- **Mobile Bottom Sheet**: Use for adding tasks on mobile devices
- **Collapsible Sidebar**: Desktop navigation with expand/collapse functionality
- **Touch Targets**: Ensure all interactive elements are at least 44px

## Component Architecture

### Task Item Component
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Pencil, Trash2, X } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, updates: Partial<Task>) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ y: -2 }}
      className="relative glass-card p-4 rounded-xl backdrop-blur-md border border-white/10"
    >
      {/* Task content */}
    </motion.div>
  );
}
```

### Dashboard Layout with Bento Grid
```tsx
import { motion } from 'framer-motion';

export function DashboardLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 rounded-xl backdrop-blur-md border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white">Total Tasks</h3>
        <p className="text-3xl font-bold text-indigo-400">24</p>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:col-span-2 lg:col-span-3 glass-card p-6 rounded-xl backdrop-blur-md border border-white/10"
      >
        <TaskList />
      </motion.div>
    </div>
  );
}
```

## Animation Patterns

### Layout Transitions
- Use `layout` prop on Framer Motion components for smooth reordering
- Animate position changes when tasks are added/removed

### Optimistic Completion
- Scale down and fade out completed tasks
- Trigger animation on checkbox toggle

```tsx
const toggleCompletion = (id: number) => {
  // Optimistically update UI
  setAnimatingTask(id);

  // Actual API call
  updateTask(id, { completed: true });
};
```

### Micro-interactions
- 3D lift effect on hover using `whileHover={{ y: -2 }}`
- Smooth transitions for all state changes
- Staggered animations for lists

## Responsive Implementation

### Mobile Bottom Sheet
```tsx
import { motion, AnimatePresence } from 'framer-motion';

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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-slate-800 rounded-t-2xl z-50 p-4"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Desktop Collapsible Sidebar
- Animated width transitions
- Icon-only state for collapsed view
- Preserve usability in both states

## Accessibility Features

### Keyboard Navigation
- Visible focus rings: `ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900`
- Logical tab order
- Accessible ARIA attributes

### Empty States
- Beautiful "All Caught Up" illustrations
- Fade-in animations for empty state components
- Encouraging messaging

## Asset Templates

### Glass Card Styling
```css
.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 shadow-lg;
}
```

### Motion Variants
Create reusable variants for consistent animations:

```tsx
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
```

## Implementation Checklist

- [ ] Bento grid layout implemented
- [ ] Glassmorphism effects on cards/modals
- [ ] Midnight & Electric color scheme applied
- [ ] Mobile bottom sheet for task creation
- [ ] Desktop collapsible sidebar
- [ ] Framer Motion animations integrated
- [ ] Layout transitions for task list
- [ ] Optimistic completion animations
- [ ] Hover state micro-interactions
- [ ] Empty state with animations
- [ ] Proper keyboard focus management
- [ ] Touch targets at least 44px
- [ ] Responsive design verified on all screens

## Advanced Patterns

### Progressive Disclosure
Hide advanced options until user interacts with the "New Task" input, revealing tags, priority, and reminders only when needed.

### Performance Optimization
- Use `memo` for task components
- Optimize re-renders with `useCallback`
- Lazy load heavy animations when possible

### State Management
Consider using Context API or Zustand for managing complex UI states like sidebar expansion, animation states, and bottom sheet visibility.

This skill enables the creation of sophisticated, professional-grade Todo applications with modern design aesthetics and smooth user interactions.