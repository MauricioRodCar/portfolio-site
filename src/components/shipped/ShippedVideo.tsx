"use client";

import { useEffect, useRef } from "react";

interface ShippedVideoProps {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
}

/**
 * Muted, looping product demo that only plays while on screen.
 *
 * `preload="none"` + no `autoPlay` attribute keeps the video entirely off
 * the critical path: nothing past the poster is fetched until the player
 * scrolls into view, so it can't compete with the hero for LCP. Visitors
 * who prefer reduced motion get the poster and native controls instead of
 * an autoplaying loop.
 */
export function ShippedVideo({ src, poster, width, height, label }: ShippedVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the browser blocks autoplay (e.g. data saver);
          // the poster + controls are an acceptable fallback, so swallow it.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="block h-auto w-full bg-[#1b2236]"
      src={src}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      controls
      preload="none"
      aria-label={label}
    />
  );
}
