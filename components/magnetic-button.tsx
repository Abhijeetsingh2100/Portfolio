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
  const springConfig = { stiffness: 240, damping: 18, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const rotate = useTransform(springX, [-12, 12], [-2, 2]);

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.22);
    y.set(dy * 0.22);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    variant === "primary"
      ? "bg-[rgb(var(--cyan))] text-slate-900 dark:text-slate-900 border-[rgb(var(--line))] font-bold hover:bg-[rgb(var(--teal))]"
      : "bg-[rgb(var(--accent))] text-slate-900 dark:text-slate-900 border-[rgb(var(--line))] font-bold hover:opacity-90";

  const content = (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY, rotate }}
      whileHover={{
        scale: 1.03,
        boxShadow: "6px 6px 0px 0px rgb(var(--card-shadow-color))",
        transform: "translate3d(-2px, -2px, 0)",
      }}
      whileTap={{
        scale: 0.97,
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
        transform: "translate3d(3px, 3px, 0)",
      }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border-[3px] px-6 py-3 text-sm tracking-wider uppercase backdrop-blur-xl shadow-[4px_4px_0px_0px_rgb(var(--card-shadow-color))] transition-colors duration-150 cursor-pointer ${base}`}
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
