"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
}

/**
 * Defers mounting `children` (and, if they're a next/dynamic component,
 * fetching their JS chunk) until the wrapper scrolls near the viewport.
 * Used for heavy, below-the-fold components so their weight can't affect
 * the initial page load's performance budget.
 */
export function LazyMount({
  children,
  placeholder = null,
  rootMargin = "200px",
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : placeholder}</div>;
}
