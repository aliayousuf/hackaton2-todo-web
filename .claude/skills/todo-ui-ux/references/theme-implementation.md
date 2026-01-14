# Midnight & Electric Theme Implementation Guide

This document describes the implementation of the Midnight & Electric theme for the Todo application.

## Color Palette

### Primary Colors
- **Deep Charcoal**: `#0F172A` (backgrounds)
- **Slate-800**: `#1E293B` (cards and containers)
- **Indigo-500**: `#6366F1` (primary accents)
- **White Text**: `#F8FAFC` (primary text)

### Semantic Colors
- **Success**: `#10B981` (green)
- **Warning**: `#F59E0B` (amber)
- **Error**: `#EF4444` (red)
- **Info**: `#3B82F6` (blue)

## Glassmorphism Effects

### CSS Classes
```css
.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 shadow-lg;
}

.glass-modal {
  @apply bg-slate-800/90 backdrop-blur-xl border border-white/10;
}
```

### Tailwind Configuration
```js
// In tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        glass: 'rgba(255, 255, 255, 0.1) 0px 0px 10px, inset rgba(255, 255, 255, 0.2) 0px 0px 10px',
      }
    }
  }
}
```

## Bento Grid Layout

### Grid Structure
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Individual cards -->
</div>
```

### Responsive Behavior
- Mobile: Single column
- Tablet: Two columns
- Desktop: Four columns
- Large screens: Four columns with flexible sizing

## Animation Guidelines

### Framer Motion Best Practices
1. Use layout animations for reordering items
2. Apply staggered animations for lists
3. Use spring physics for natural movement
4. Implement optimistic updates with animations

### Performance Tips
- Use `transform` properties instead of animating layout properties
- Memoize components that don't need re-rendering
- Use `initial`, `animate`, and `exit` variants consistently

## Component Architecture

### TaskItem Component Hierarchy
```
EnhancedTaskItem
├── Motion wrapper (layout animations)
├── Checkbox with completion animation
├── Content area (title, description, metadata)
└── Action buttons (edit, delete)
```

### Dashboard Component Hierarchy
```
DashboardLayout
├── Header (title, create button)
├── Stats Grid (bento-style cards)
└── Task List Container
    └── EnhancedTaskList
        └── EnhancedTaskItem(s)
```

## Accessibility Features

### Focus Management
- Use `focus-visible` for keyboard-only focus indicators
- Maintain visible focus rings: `ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900`
- Ensure logical tab order

### Screen Reader Support
- Include proper ARIA labels
- Use semantic HTML elements
- Provide alternative text for icons

## Mobile Considerations

### Touch Target Sizes
- Minimum 44px for all interactive elements
- Adequate spacing between touch targets
- Thumb-friendly positioning

### Bottom Sheet Implementation
- Slides up from bottom
- Overlay background
- Dismissible by tapping overlay
- Proper keyboard accessibility