"use client";

import { ArrowRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { scrollToTarget } from "@/lib/scroll";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
};

/** Pill button. In-page anchors ("#download") scroll smoothly through the film. */
export function Cta({ href, children, variant = "primary", size = "md", arrow = variant === "primary", className }: Props) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollToTarget(href);
    history.replaceState(null, "", href);
  };
  return (
    <a href={href} onClick={onClick} className={cn("btn", variant === "primary" ? "btn-primary" : "btn-secondary", size === "sm" && "btn-sm", className)}>
      {children}
      {arrow && <ArrowRight size={size === "sm" ? 15 : 17} className="btn-arrow" aria-hidden />}
    </a>
  );
}
