"use client";
import { ButtonHTMLAttributes } from "react";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  as?: "button" | "span";
}

export default function Chip({ children, active, as: Tag = "button", className = "", ...rest }: ChipProps) {
  const activeClass = active ? "chip--active" : "";
  if (Tag === "span") {
    return <span className={`chip ${activeClass} ${className}`}>{children}</span>;
  }
  return (
    <button className={`chip ${activeClass} ${className}`} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
