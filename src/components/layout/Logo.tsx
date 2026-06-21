interface LogoProps {
  className?: string;
  size?: number;
}

const SPOKE_COUNT = 8;
const SPOKE_ANGLES = Array.from({ length: SPOKE_COUNT }, (_, index) => index * 45);

/** Small checkmark path, drawn near the origin for spoke placement. */
const SPOKE_CHECK_PATH = "M -2.2 -0.4 L -0.6 1.2 L 2.4 -2.2";

/** Larger central checkmark. */
const CENTER_CHECK_PATH = "M 10 20.5 L 16.5 27 L 28 13.5";

export default function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo ${className}`.trim()}
      aria-hidden="true"
    >
      <g className="logo-spokes">
        {SPOKE_ANGLES.map((angle, index) => (
          <g
            key={angle}
            className="logo-spoke"
            style={
              {
                "--spoke-angle": `${angle}deg`,
                "--spoke-index": index,
              } as React.CSSProperties
            }
          >
            <path className="logo-check" d={SPOKE_CHECK_PATH} />
          </g>
        ))}
      </g>
      <g className="logo-center">
        <path className="logo-check logo-check--center" d={CENTER_CHECK_PATH} />
      </g>
    </svg>
  );
}
