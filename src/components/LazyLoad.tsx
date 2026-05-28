"use client";

import { useEffect, useRef, useState } from "react";

type LazyLoadProps = {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  placeholder?: React.ReactNode;
};

/**
 * LazyLoad: only renders children when the element is visible in viewport.
 * Reduces initial JS execution and API calls for below-the-fold content.
 */
export function LazyLoad({ children, className, rootMargin = "200px", placeholder }: LazyLoadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (placeholder || <div className="min-h-[100px]" />)}
    </div>
  );
}
