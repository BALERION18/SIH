import { useEffect, useRef } from 'react';

export const useScrollAnimation = (
  animationType: 'up' | 'left' | 'right' | 'scale' | 'stagger' = 'up',
  threshold: number = 0.1,
  delay: number = 0
) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add initial classes
    element.classList.add('scroll-animate');
    if (delay > 0) {
      element.classList.add(`delay-${delay}`);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class based on type
            entry.target.classList.add(`animate-in-${animationType}`);
            // Remove observer after animation starts
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animationType, threshold, delay]);

  return elementRef;
};

// Utility function for multiple elements with stagger
export const useStaggeredScrollAnimation = (
  count: number,
  animationType: 'up' | 'left' | 'right' | 'scale' | 'stagger' = 'stagger',
  baseDelay: number = 100
) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (elements.length === 0) return;

    const observers: IntersectionObserver[] = [];

    elements.forEach((element, index) => {
      if (!element) return;

      element.classList.add('scroll-animate');
      element.classList.add(`delay-${baseDelay * (index + 1)}`);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(`animate-in-${animationType}`);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -30px 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [count, animationType, baseDelay]);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  };

  return setRef;
};