"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  download?: boolean;
};

export function MagneticButton({
  href,
  children,
  variant = "primary",
  download,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 260, damping: 20, mass: 0.7 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const rotate = useTransform(springX, [-12, 12], [-1.5, 1.5]);

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.18);
    y.set(dy * 0.18);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    variant === "primary"
      ? "bg-[rgb(var(--cyan)/0.12)] text-white border-[rgb(var(--cyan)/0.35)] hover:bg-[rgb(var(--cyan)/0.2)]"
      : "bg-[rgba(255,255,255,0.04)] text-[rgb(var(--text))] border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.08)]";

  const content = (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY, rotate }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium backdrop-blur-xl transition ${base}`}
    >
      {children}
    </motion.span>
  );

  if (download) {
    return (
      <a href={href} download className="inline-flex">
        {content}
      </a>
    );
  }

  const external = href.startsWith("http") || href.startsWith("mailto:");

  if (external) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="inline-flex"
      >
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}
