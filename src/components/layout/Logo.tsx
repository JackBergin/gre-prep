interface LogoProps {
  className?: string;
  size?: number;
}

/** Static PrismPrep mark: a triangle with a centre dot. Matches src/app/icon.svg. */
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
      <rect width="32" height="32" rx="7" fill="#5B7CFA" />
      <path d="M16 7 L7 24 L25 24 Z" stroke="#FFFFFF" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="16" cy="18.5" r="2.1" fill="#FFFFFF" />
    </svg>
  );
}
