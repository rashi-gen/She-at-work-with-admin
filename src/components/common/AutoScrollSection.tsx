"use client";

import { useEffect, useRef, useState } from "react";

export function AutoScrollSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let scroll = 0;
    const speed = 0.4;

    const animate = () => {
      if (!paused) {
        scroll += speed;
        if (scroll >= container.scrollWidth / 2) {
          scroll = 0;
        }
        container.scrollLeft = scroll;
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, [paused]);

  return (
    <div
      className="relative overflow-hidden"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 1200)}
    >
      <div
        ref={ref}
        className="flex gap-4 overflow-x-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
