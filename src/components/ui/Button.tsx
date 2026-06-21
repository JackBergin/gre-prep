"use client";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export default function Button({
  children,
  variant = "accent",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  const ghost = variant === "ghost" ? "btn--ghost" : "";
  return (
    <button className={`btn ${ghost} ${sizeMap[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
