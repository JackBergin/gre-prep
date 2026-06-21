import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const paddingMap = { sm: "p-4", md: "p-6", lg: "p-10" };

export default function Card({ children, className = "", padding = "md", ...rest }: CardProps) {
  return (
    <div className={`card ${paddingMap[padding]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
