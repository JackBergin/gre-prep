import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, id, className = "", ...rest }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="chip mb-2 block" style={{ boxShadow: "none", background: "transparent", paddingLeft: 0 }}>
          {label}
        </label>
      )}
      <input id={id} className={`input ${className}`} {...rest} />
    </div>
  );
}
