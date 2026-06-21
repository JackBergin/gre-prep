/** SVG mark shared by favicons, PWA icons, and the in-app logo. */

export const ICON_MARK_LIGHT = "#424858";
export const ICON_MARK_DARK = "#FFFFFF";

const MARK_PATHS = `
  <rect class="logo-mark logo-box" x="3" y="3" width="26" height="26" rx="6" />
  <path class="logo-mark logo-triangle" d="M16 9 L9.5 22.5 L22.5 22.5 Z" />
  <circle class="logo-mark logo-dot" cx="16" cy="18" r="1.9" />
`;

const BASE_STYLES = `
  .logo-box {
    fill: none;
    stroke-width: 2;
  }

  .logo-triangle {
    fill: none;
    stroke-width: 2;
    stroke-linejoin: round;
  }

  .logo-dot {
    stroke: none;
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
