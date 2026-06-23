interface LogoProps {
  className?: string;
  size?: number;
}

const CHECK = "M 12.3 9.0 L 15 11.9 L 20.9 4.6";

/** PrismPrep mark: three checkmarks in a pinwheel. Matches public/icon.svg. */
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
      <path className="logo__blade" d={CHECK} />
      <path className="logo__blade" d={CHECK} transform="rotate(120 16 16)" />
      <path className="logo__blade" d={CHECK} transform="rotate(240 16 16)" />
    </svg>
  );
}
