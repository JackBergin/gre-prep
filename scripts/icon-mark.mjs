/** SVG mark shared by favicons, PWA icons, and the in-app logo. */

export const ICON_MARK_LIGHT = "#424858";
export const ICON_MARK_DARK = "#FFFFFF";

/**
 * PrismPrep mark: three checkmarks arranged with 120° rotational symmetry
 * to form a pinwheel — nodding to the three prep paths (Verbal, Quant,
 * Writing) and a prism's three-fold refraction, while the checks read as
 * "test prep". Monochrome, drawn entirely with round-capped strokes.
 */
const CHECK = "M 12.3 9.0 L 15 11.9 L 20.9 4.6";

const MARK_PATHS = `
  <g class="logo-mark logo-pinwheel">
    <path class="logo-blade" d="${CHECK}" />
    <path class="logo-blade" d="${CHECK}" transform="rotate(120 16 16)" />
    <path class="logo-blade" d="${CHECK}" transform="rotate(240 16 16)" />
  </g>
`;

const BASE_STYLES = `
  .logo-blade {
    fill: none;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

export function iconMarkSvg(markColor, { adaptive = false } = {}) {
  const styles = adaptive
    ? `
    .logo-mark {
      stroke: ${ICON_MARK_LIGHT};
      fill: ${ICON_MARK_LIGHT};
    }
    ${BASE_STYLES}
    @media (prefers-color-scheme: dark) {
      .logo-mark {
        stroke: ${ICON_MARK_DARK};
        fill: ${ICON_MARK_DARK};
      }
    }
  `
    : `
    .logo-mark {
      stroke: ${markColor};
      fill: ${markColor};
    }
    ${BASE_STYLES}
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <style>${styles}</style>
  ${MARK_PATHS}
</svg>
`;
}
