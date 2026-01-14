import { useState, useEffect } from 'react';

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
}