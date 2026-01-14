import { useState, useEffect, useCallback } from 'react';
import type { RefObject, MouseEvent, KeyboardEvent, CSSProperties } from 'react';

// Define MediaQueryListEvent if not available in current TypeScript environment
type MediaQueryListEvent = Event & {
  matches: boolean;
  media: string;
};

// Focus trap utility for modals and bottom sheets
export function useFocusTrap(ref: RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const focusableElements = ref.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    const keydownHandler = handleKeyDown as (e: globalThis.KeyboardEvent) => void;
    document.addEventListener('keydown', keydownHandler);

    // Focus first element when activated
    firstElement.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, ref]);
}

// Keyboard navigation utilities
export function useKeyboardNavigation(itemsCount: number, currentIndex: number, setCurrentIndex: (index: number) => void) {
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentIndex(Math.min(currentIndex + 1, itemsCount - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex(Math.max(currentIndex - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentIndex(itemsCount - 1);
      }
    };

    const keydownHandler = handleKeyDown as (e: globalThis.KeyboardEvent) => void;
    window.addEventListener('keydown', keydownHandler);

    return () => {
      window.removeEventListener('keydown', keydownHandler);
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

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  return { announce };
}

// Focus visible utility
export function useFocusVisible() {
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsUsingKeyboard(false);
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Tab') setIsUsingKeyboard(true);
    };

    document.addEventListener('mousedown', handleMouseDown);
    const keydownHandler = handleKeyDown as (e: globalThis.KeyboardEvent) => void;
    document.addEventListener('keydown', keydownHandler);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', keydownHandler);
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
    const previousElement = document.querySelector('[data-last-focused]') as HTMLElement | null;
    if (previousElement) {
      previousElement.focus();
    }
  }, []);

  const storeFocus = useCallback(() => {
    const currentElement = document.activeElement;
    if (currentElement instanceof HTMLElement) {
      currentElement.setAttribute('data-last-focused', 'true');
    }
  }, []);

  const restoreFocus = useCallback(() => {
    const lastFocused = document.querySelector('[data-last-focused]') as HTMLElement | null;
    if (lastFocused) {
      lastFocused.focus();
      lastFocused.removeAttribute('data-last-focused');
    }
  }, []);

  return { focusPreviousElement, storeFocus, restoreFocus };
}

// Keyboard shortcut handler
interface ShortcutConfig {
  keys: {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
  };
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
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

    const keydownHandler = handleKeyDown as (e: globalThis.KeyboardEvent) => void;
    document.addEventListener('keydown', keydownHandler);

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, [shortcuts]);
}

// High contrast mode detector
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleChange = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);

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

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

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
