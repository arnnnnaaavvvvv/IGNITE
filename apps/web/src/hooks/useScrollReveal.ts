import { useEffect } from 'react';

export interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  selector?: string;
  activeClass?: string;
  deps?: any[];
}

/**
 * High-performance, lightweight scroll reveal hook using native IntersectionObserver.
 * Triggers bidirectional fade & slide animations live both when scrolling down and scrolling up.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -30px 0px',
    selector = '[data-reveal]',
    activeClass = 'reveal-active',
    deps = [],
  } = options;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add(activeClass);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(activeClass);
          } else {
            // Re-trigger live when scrolling back into view in either direction
            entry.target.classList.remove(activeClass);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin, selector, activeClass, ...deps]);
}
