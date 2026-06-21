interface LogoProps {
  className?: string;
  size?: number;
}

const SPOKE_COUNT = 10;
const RADIUS = 11;
/** In the `rotate(a) translate(0,-R)` convention, angle 180° sits at the bottom. */
const BOTTOM_ANGLE = 180;
const SURVIVOR_INDEX = BOTTOM_ANGLE / (360 / SPOKE_COUNT); // 5

/**
 * Checkmark whose corner (vertex) points radially outward (local -y) with both
 * tips reaching inward toward the centre — so vertices trace the outer circle
 * and the tops converge at the middle.
 */
const CHECK_PATH = "M -2.6 -0.05 L -0.8 -1.95 L 2.6 1.95";

/**
 * Loop timing as percentages of the 5s cycle. The assembled ring is the resting
 * state, so it holds for the first ~42% before the checks merge counter-clockwise
 * into the bottom check, which then swells, settles, and the ring regenerates.
 */
const HOLD = 42;
const STEP = 2.5;
const WINDOW = 10;
const REGEN_START = 86;
const REGEN_END = 98;

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

/** Counter-clockwise (decreasing-angle) sweep needed to reach the bottom check. */
function counterClockwiseToBottom(angle: number): number {
  return ((angle - BOTTOM_ANGLE) % 360 + 360) % 360;
}

// Merge order: the spokes furthest (CCW) from the bottom launch first so the
// wave gathers into the bottom check, with the nearest clicking in last.
const MERGE_ORDER = new Map(
  SPOKES.filter((s) => s.index !== SURVIVOR_INDEX)
    .sort((a, b) => counterClockwiseToBottom(b.angle) - counterClockwiseToBottom(a.angle))
    .map((s, order) => [s.index, order] as const)
);

function spokeKeyframes(spoke: Spoke): string {
  const home = homeTransform(spoke.angle);

  if (spoke.index === SURVIVOR_INDEX) {
    // The bottom check survives, swells into the icon, then settles back.
    return `@keyframes ${spoke.keyframeName} {
  0%, 70% { transform: ${home}; }
  80%, 88% { transform: ${homeTransform(spoke.angle, 1.4)}; }
  96%, 100% { transform: ${home}; }
}`;
  }

  const order = MERGE_ORDER.get(spoke.index) ?? 0;
  const start = HOLD + order * STEP;
  const end = start + WINDOW;
  const merged = `rotate(${spoke.angle - counterClockwiseToBottom(spoke.angle)}deg) translate(0, -${RADIUS}px) scale(0.12)`;

  return `@keyframes ${spoke.keyframeName} {
  0%, ${start}% { transform: ${home}; opacity: 0.9; }
  ${end}% { transform: ${merged}; opacity: 0; }
  ${REGEN_START}% { transform: ${homeTransform(spoke.angle, 0.2)}; opacity: 0; }
  ${REGEN_END}%, 100% { transform: ${home}; opacity: 0.9; }
}`;
}

const LOGO_KEYFRAMES = SPOKES.map(spokeKeyframes).join("\n");

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
      {SPOKES.map((spoke) => {
        const isSurvivor = spoke.index === SURVIVOR_INDEX;
        return (
          <path
            key={spoke.index}
            className={`logo-check logo-spoke${isSurvivor ? " logo-survivor" : ""}`}
            style={{
              transform: homeTransform(spoke.angle),
              animationName: spoke.keyframeName,
            }}
            d={CHECK_PATH}
          />
        );
      })}
    </svg>
  );
}
