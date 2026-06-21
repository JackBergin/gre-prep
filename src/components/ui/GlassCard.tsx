import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "panel" | "card";
}

export default function GlassCard({
  children,
  className = "",
  variant = "card",
  ...rest
}: GlassCardProps) {
  const base = variant === "panel" ? "glass-panel" : "glass-card";
  return (
    <div className={`${base} ${className}`} {...rest}>
      {children}
    </div>
  );
}
