interface LogoProps {
  className?: string;
  size?: number;
}

const SPOKE_COUNT = 8;
const RADIUS = 12;
/** In the `rotate(a) translate(0,-R)` convention, angle 180° sits at the bottom. */
const BOTTOM_ANGLE = 180;
const SURVIVOR_INDEX = BOTTOM_ANGLE / (360 / SPOKE_COUNT); // 4

/** Small checkmark blade, centred on the origin so it can be placed on the rim. */
const SPOKE_CHECK_PATH = "M -2.6 0.3 L -0.9 2.1 L 2.9 -2.3";
/** Large checkmark, centred on the origin — the resolved icon. */
const CENTER_CHECK_PATH = "M -8.5 0.5 L -2 7.6 L 9.6 -6.6";

/** Loop timing, as percentages of the 5s cycle. */
const HOLD_START = 6;
const STEP = 6;
const WINDOW = 12;
const EASE = "cubic-bezier(0.5, 0, 0.5, 1)";

interface Spoke {
  index: number;
  angle: number;
  keyframeName: string;
}

const SPOKES: Spoke[] = Array.from({ length: SPOKE_COUNT }, (_, index) => ({
  index,
  angle: index * (360 / SPOKE_COUNT),
  keyframeName: `pp-spoke-${index}`,
}));

function homeTransform(angle: number, scale = 1): string {
  return `rotate(${angle}deg) translate(0, -${RADIUS}px) scale(${scale})`;
}

/** Clockwise (increasing-angle) sweep needed to reach the bottom collection point. */
function clockwiseToBottom(angle: number): number {
  return ((BOTTOM_ANGLE - angle) % 360 + 360) % 360;
}

/** Merge sequence index: a wave that starts just past the bottom and travels clockwise. */
function mergeOrder(index: number): number {
  return ((index - (SURVIVOR_INDEX + 1)) % SPOKE_COUNT + SPOKE_COUNT) % SPOKE_COUNT;
}

function spokeKeyframes(spoke: Spoke): string {
  if (spoke.index === SURVIVOR_INDEX) {
    // The lone survivor lingers at the bottom, then hands off to the big check.
    const home = homeTransform(spoke.angle);
    return `@keyframes ${spoke.keyframeName} {
  0%, 56% { transform: ${home}; opacity: 0.9; }
  64% { transform: ${homeTransform(spoke.angle, 0.3)}; opacity: 0; }
  96% { transform: ${home}; opacity: 0; }
  100% { transform: ${home}; opacity: 0.9; }
}`;
  }

  const start = HOLD_START + mergeOrder(spoke.index) * STEP;
  const end = start + WINDOW;
  const home = homeTransform(spoke.angle);
  const merged = `rotate(${spoke.angle + clockwiseToBottom(spoke.angle)}deg) translate(0, -${RADIUS}px) scale(0.12)`;

  return `@keyframes ${spoke.keyframeName} {
  0%, ${start}% { transform: ${home}; opacity: 0.9; }
  ${end}% { transform: ${merged}; opacity: 0; }
  96% { transform: ${home}; opacity: 0; }
  100% { transform: ${home}; opacity: 0.9; }
}`;
}

const CENTER_KEYFRAMES = `@keyframes pp-center {
  0%, 52% { opacity: 0; transform: scale(0.25); }
  70%, 86% { opacity: 1; transform: scale(1); }
  95% { opacity: 0; transform: scale(1.12); }
  100% { opacity: 0; transform: scale(0.25); }
}`;

const LOGO_KEYFRAMES = [...SPOKES.map(spokeKeyframes), CENTER_KEYFRAMES].join("\n");

export default function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-20 -20 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo ${className}`.trim()}
      aria-hidden="true"
    >
      <style>{LOGO_KEYFRAMES}</style>
      <g className="logo-spokes">
        {SPOKES.map((spoke) => (
          <path
            key={spoke.index}
            className="logo-check logo-spoke"
            style={{ animationName: spoke.keyframeName }}
            d={SPOKE_CHECK_PATH}
          />
        ))}
      </g>
      <path className="logo-check logo-check--center logo-center" d={CENTER_CHECK_PATH} />
    </svg>
  );
}
