import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlask,
  faTableCellsLarge,
  faGraduationCap,
  faAddressCard,
  faGear,
  faFileLines,
  faCircleQuestion,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { color, nav, type } from '../tokens';

// Navigation — DS - Advanced | IN PROGRESS | 2.0, node 86:184835.
// Adapted from doa-log/src/appShell/LeftIconNav.tsx: same rail geometry and
// item states, retargeted to an LMS icon set with "Settings" selected (the
// "Manage Studies & Sites" section this screen lives in), plus a text label
// under Help and the real wordmark image instead of a placeholder glyph —
// both missing from the doa-log copy but present in the Figma frame.

interface NavIconProps {
  icon: IconDefinition;
  label: string;
  selected?: boolean;
}

function NavIcon({ icon, label, selected = false }: NavIconProps) {
  const [hover, setHover] = useState(false);

  const bg = selected ? color.navSelectedBg : hover ? color.navHoverBg : 'transparent';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-current={selected ? 'page' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: nav.itemWidth,
        height: nav.itemMaxHeight,
        minHeight: nav.itemMinHeight,
        padding: 0,
        border: 'none',
        backgroundColor: bg,
        cursor: 'pointer',
        transition: 'background-color 100ms',
      }}
    >
      {/* icon-container/icon-size-s (20) holding an Icons/solid/s glyph (15) */}
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: nav.iconBox, height: nav.iconBox }}>
        <FontAwesomeIcon icon={icon} style={{ width: nav.glyph, height: nav.glyph, color: color.navIcon }} />
      </span>
    </button>
  );
}

function HelpButton() {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label="Help"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        width: nav.itemWidth,
        height: nav.itemMaxHeight,
        padding: 0,
        border: 'none',
        backgroundColor: hover ? color.navHoverBg : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 100ms',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: nav.iconBox, height: nav.iconBox }}>
        <FontAwesomeIcon icon={faCircleQuestion} style={{ width: nav.glyph, height: nav.glyph, color: color.navIcon }} />
      </span>
      <span style={{ fontFamily: type.body.fontFamily, fontSize: 10, lineHeight: '12px', color: color.navIcon }}>Help</span>
    </button>
  );
}

export function LeftIconNav() {
  return (
    <div
      style={{
        width: nav.collapsedWidth,
        flexShrink: 0,
        backgroundColor: color.navBg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', paddingTop: nav.paddingY }}>
        <NavIcon icon={faFlask} label="Studies" />
        <NavIcon icon={faTableCellsLarge} label="Dashboard" />
        <NavIcon icon={faGraduationCap} label="Training" />
        <NavIcon icon={faAddressCard} label="Contacts" />
        <NavIcon icon={faGear} label="Manage Studies & Sites" selected />
        <NavIcon icon={faFileLines} label="Reports" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: nav.paddingY, gap: 10 }}>
        <HelpButton />
        {/* navigation-main/logo-container — height 55, padding-x 15. The
            collapsed rail carries the mark ALONE; the "Trial Interactive"
            wordmark beside it belongs to the 240px expanded nav only. The
            asset is stored flipped, so it is drawn scaleY(-1) here exactly as
            the header's LogoCrumb draws it. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: nav.logoHeight,
            padding: `0 ${nav.logoPaddingX}px`,
          }}
        >
          <img
            src={import.meta.env.BASE_URL + 'ti-logo.svg'}
            alt="Trial Interactive"
            style={{ width: 25.004, height: 40, transform: 'scaleY(-1)', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
}

export default LeftIconNav;
