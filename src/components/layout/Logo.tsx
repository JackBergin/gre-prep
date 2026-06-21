interface LogoProps {
  className?: string;
  size?: number;
}

/** PrismPrep mark: transparent canvas, themed box/triangle/dot. Matches public/icon.svg. */
export default function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo ${className}`.trim()}
      aria-hidden="true"
    >
      <rect className="logo__box" x="3" y="3" width="26" height="26" rx="6" />
      <path
        className="logo__triangle"
        d="M16 9 L9.5 22.5 L22.5 22.5 Z"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle className="logo__dot" cx="16" cy="18" r="1.9" />
    </svg>
  );
}
