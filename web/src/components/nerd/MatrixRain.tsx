"use client";

import { useEffect, useRef, useState } from "react";
import { createAnimationLoop, createVisibilityHandler } from "@/lib/nerd/animation-loop";
import { usePrefersReducedMotion } from "./use-reduced-motion";

const GLYPHS = "01アカサタナハマヤラワ<>/{}[]$#*+=ABCDEF";
const FONT_SIZE = 14;

type MatrixRainProps = { className?: string };

/**
 * Matrix-rain canvas. Pauses when off-screen or when the tab is hidden; never animates
 * with prefers-reduced-motion. `data-animating` reflects the loop state (used by e2e tests).
 */
export function MatrixRain({ className = "" }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || reducedMotion) return;

    const color =
      getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() ||
      "#39ff88";
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim();
    let drops: number[] = [];

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width));
      canvas.height = Math.max(1, Math.floor(height));
      drops = Array.from({ length: Math.ceil(canvas.width / FONT_SIZE) }, () =>
        Math.floor((Math.random() * canvas.height) / FONT_SIZE),
      );
    };
    resize();

    const loop = createAnimationLoop(
      () => {
        ctx.fillStyle = `color-mix(in srgb, ${bg || "#000"} 85%, transparent)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = `${FONT_SIZE}px monospace`;
        drops.forEach((y, i) => {
          const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          ctx.fillText(ch, i * FONT_SIZE, y * FONT_SIZE);
          drops[i] = y * FONT_SIZE > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
        });
      },
      { fps: 20 },
    );

    let inView = true;
    const sync = () => {
      if (!document.hidden && inView) loop.start();
      else loop.stop();
      setAnimating(loop.running);
    };
    const visibilityHandler = createVisibilityHandler(loop, document, () => inView);
    const onVisibility = () => {
      visibilityHandler();
      setAnimating(loop.running);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      loop.stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      setAnimating(false);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="matrix-canvas"
      data-animating={animating ? "true" : "false"}
      className={className}
    />
  );
}
