import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHospital,
  faCircleInfo,
  faBuilding,
  faBookOpen,
  faClipboardList,
  faFileContract,
  faUserGroup,
  faGraduationCap,
  faCertificate,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { color, type, subNav, avatar, status as st } from './tokens';

// Sub Nav — DS - Advanced | IN PROGRESS | 2.0, "Navigation / Type=Expand"
// (node 86:198814 → 86:198815), with the rules from "Sub Nav Behaviour"
// (node 86:198856).
//
// Things the component specifies that are easy to get wrong:
//   · the header is a LEFT-aligned row — a square Graphics/Avatar (radius 5)
//     beside a column of Name / Level / Status — not a centered stack
//   · Entity Name clamps to TWO lines, everything else to one, and every
//     truncated string carries its full text as a tooltip (Behaviour § Header)
//   · Info rows are label + value pairs in Caption/Regular; the value has
//     Text and Link variants
//   · a selected item changes ONLY its background (navigation-sub/item/
//     selected-bg): the icon stays #949daf and the label stays Body/Regular
//     #0b1528 — it does not go bold, blue, or grow an accent bar

/** Graphics/Avatar — icon-based, square */
/**
 * Graphics/Avatar. A study or a site is a square with its kind's glyph; a
 * PERSON is a round photo — the DS's two shapes, and the difference is worth
 * keeping: it says at a glance which kind of thing the panel is describing.
 * A photo that fails to load falls back to the glyph rather than a gap.
 */
function EntityAvatar({ glyph, photo, round }: { glyph: IconDefinition; photo?: string; round?: boolean }) {
  const [broken, setBroken] = useState(false);
  const radius = round ? avatar.roundRadius : avatar.squareRadius;

  return (
    <div style={{ width: avatar.size, height: avatar.size, flexShrink: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: avatar.size,
          height: avatar.size,
          borderRadius: radius,
          border: `${avatar.borderWidth}px solid ${avatar.border}`,
          backgroundColor: avatar.iconBasedBg,
          overflow: 'hidden',
        }}
      >
        {photo && !broken ? (
          <img
            src={photo}
            alt=""
            onError={() => setBroken(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          // avatar/icon-size-m (30) is the container; the glyph is Icons/regular/m (20)
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: avatar.iconBoxM,
              height: avatar.iconBoxM,
            }}
          >
            <FontAwesomeIcon icon={glyph} style={{ width: avatar.iconGlyphM, height: avatar.iconGlyphM, color: avatar.icon }} />
          </span>
        )}
      </div>
    </div>
  );
}

/** Status/Solid — the entity's state chip, ellipsised at status/medium-label-max-width */
function StatusChip({ label }: { label: string }) {
  return (
    <span
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        // The chip hugs its label inside the header's stretch column.
        alignSelf: 'flex-start',
        maxWidth: st.labelMaxWidth,
        padding: `0 ${st.paddingX}px`,
        borderRadius: st.radius,
        backgroundColor: color.statusSolidGreen,
        color: color.text,
        ...type.status,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {label}
    </span>
  );
}

export interface InfoRow {
  label: string;
  value: string;
  /** Subnav/Header/Info Value — Type=Link renders the value as a Button/Link. */
  link?: boolean;
  /** Where that link goes — usually the level above, in its own app. */
  onClick?: () => void;
}

/** Subnav/Header/Info — label + Info Value, gap-xs, both single-line with a tooltip */
function Info({ label, value, link, onClick }: InfoRow) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: subNav.headerGapXs, minWidth: 0 }}>
      <span style={{ ...type.captionRegular, color: subNav.headerAdditionalText, flexShrink: 0 }}>{label}</span>
      <span
        title={value}
        onClick={onClick}
        role={onClick ? 'link' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        style={{
          ...type.captionRegular,
          color: link ? color.primary : color.text,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: onClick ? 'pointer' : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export interface SubNavItem {
  id: string;
  icon: IconDefinition;
  label: string;
  /** Rendered under the label in Caption/Regular, per Behaviour § Navigation Item. */
  additionalText?: string;
  /** Right-aligned counter, per Behaviour § Navigation Item. */
  count?: number;
}

function Item({ item, selected, onSelect }: { item: SubNavItem; selected: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  // resting-bg is transparent; selected-bg wins over hover.
  const bg = selected ? subNav.itemSelectedBg : hover ? subNav.itemHoverBg : 'transparent';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? 'page' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        // The item is a row of [Right Part | counter] at gap-x-xs; the 10px
        // gap-x-s belongs to the icon/label row inside Right Part.
        display: 'flex',
        alignItems: 'center',
        gap: subNav.itemGapXs,
        width: '100%',
        minHeight: subNav.itemMinHeight,
        maxHeight: subNav.itemMaxHeight,
        padding: `0 ${subNav.itemPaddingX}px`,
        border: 'none',
        backgroundColor: bg,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 100ms',
      }}
    >
      {/* Right Part — the label row, with any additional text stacked under it */}
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5, flex: '1 0 0', minWidth: 0 }}>
        {/* Lable */}
        <span style={{ display: 'flex', alignItems: 'center', gap: subNav.itemGapS, width: '100%', minWidth: 0 }}>
          {/* Icon — a 20px container holding a 15px Icons/solid/s glyph. The
              glyph color is the same #949daf resting, hovered and selected. */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: subNav.itemIconBox,
              height: subNav.itemIconBox,
              flexShrink: 0,
            }}
          >
            <FontAwesomeIcon icon={item.icon} style={{ width: subNav.itemGlyph, height: subNav.itemGlyph, color: subNav.itemIcon }} />
          </span>
          <span
            title={item.label}
            style={{ ...type.body, color: subNav.itemText, flex: '1 0 0', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {item.label}
          </span>
        </span>
        {item.additionalText && (
          <span
            style={{
              ...type.captionRegular,
              color: subNav.itemAdditionalText,
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.additionalText}
          </span>
        )}
      </span>
      {/* Indicator/Counter — Counters/Medium, flat */}
      {item.count != null && <span style={{ ...type.counterMedium, color: subNav.itemText, flexShrink: 0 }}>{item.count}</span>}
    </button>
  );
}

export type SectionId = 'general-info' | 'sites' | 'training-library' | 'training-plans' | 'doa';

/** One source for the section's name — the nav item, the page title and the end crumb all read it. */
export const SECTION_LABELS: Record<SectionId, string> = {
  'general-info': 'General Info',
  sites: 'Sites',
  'training-library': 'Training Library',
  'training-plans': 'Training Plans',
  doa: 'Delegated Tasks',
};

export const STUDY_ITEMS: (SubNavItem & { id: SectionId })[] = [
  { id: 'general-info', icon: faCircleInfo, label: SECTION_LABELS['general-info'] },
  { id: 'sites', icon: faBuilding, label: SECTION_LABELS.sites },
  { id: 'training-library', icon: faBookOpen, label: SECTION_LABELS['training-library'] },
  { id: 'training-plans', icon: faClipboardList, label: SECTION_LABELS['training-plans'] },
  { id: 'doa', icon: faFileContract, label: SECTION_LABELS.doa },
];

/**
 * A site profile is the same screen one level down: same header, same sub nav,
 * same content column — only the entity and its sections change. A site has no
 * Sites list of its own, and no library (the catalogue belongs to the study);
 * what it does have is the people working at it.
 */
export type SiteSectionId = 'general-info' | 'site-personnel' | 'training-plans' | 'doa';

/**
 * A user's own sections. The four the source frames carry, plus TASKS — what
 * the site's DOA log delegates to them. Without it a user profile can say what
 * training they hold but never what they were supposed to hold.
 */
export type UserSectionId = 'general-info' | 'groups' | 'courses' | 'learning-plans' | 'certificates' | 'tasks';

export const SITE_SECTION_LABELS: Record<SiteSectionId, string> = {
  'general-info': 'General Info',
  'site-personnel': 'Site Personnel',
  'training-plans': 'Training Plans',
  doa: 'Delegated Tasks',
};

export const USER_SECTION_LABELS: Record<UserSectionId, string> = {
  'general-info': 'General Info',
  tasks: 'Tasks',
  courses: 'Courses',
  'learning-plans': 'Learning Plans',
  groups: 'Groups',
  certificates: 'Certificates',
};

export const USER_ITEMS: (SubNavItem & { id: UserSectionId })[] = [
  { id: 'general-info', icon: faCircleInfo, label: USER_SECTION_LABELS['general-info'] },
  { id: 'tasks', icon: faFileContract, label: USER_SECTION_LABELS.tasks },
  { id: 'courses', icon: faGraduationCap, label: USER_SECTION_LABELS.courses },
  { id: 'learning-plans', icon: faBookOpen, label: USER_SECTION_LABELS['learning-plans'] },
  { id: 'groups', icon: faUserGroup, label: USER_SECTION_LABELS.groups },
  { id: 'certificates', icon: faCertificate, label: USER_SECTION_LABELS.certificates },
];

export const SITE_ITEMS: (SubNavItem & { id: SiteSectionId })[] = [
  { id: 'general-info', icon: faCircleInfo, label: SITE_SECTION_LABELS['general-info'] },
  { id: 'site-personnel', icon: faUserGroup, label: SITE_SECTION_LABELS['site-personnel'] },
  { id: 'training-plans', icon: faClipboardList, label: SITE_SECTION_LABELS['training-plans'] },
  { id: 'doa', icon: faFileContract, label: SITE_SECTION_LABELS.doa },
];

export interface StudySidebarProps {
  name: string;
  level: string;
  statusLabel: string;
  info: InfoRow[];
  /** Graphics/Avatar's glyph — the entity's kind. */
  glyph?: IconDefinition;
  /** A person's photo, in the round avatar. */
  photo?: string;
  round?: boolean;
  /** The sections this entity has. */
  items: SubNavItem[];
  /** The section drives the page beside it, so the selection lives above this. */
  selected: string;
  onSelect: (id: string) => void;
}

export function StudySidebar({ name, level, statusLabel, info, glyph = faHospital, photo, round, items, selected, onSelect }: StudySidebarProps) {
  return (
    <div
      style={{
        // Width and the splitter-bar/border live on the CollapsiblePanel that
        // wraps this; the nav just fills it.
        width: '100%',
        height: '100%',
        backgroundColor: color.panelBg,
        display: 'flex',
        flexDirection: 'column',
        gap: subNav.gap,
        overflowY: 'auto',
      }}
    >
      {/* Subnav/Header — Back Button=off, so it takes the 30px top padding */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: subNav.headerGapM,
          padding: `${subNav.headerPaddingTopButtonOff}px ${subNav.headerPaddingX}px ${subNav.headerPaddingTop}px`,
          borderBottom: `${subNav.headerBorderWidth}px solid ${subNav.headerBorder}`,
        }}
      >
        {/* Details — avatar beside the Name / Level / Status column */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: subNav.headerGapM, minWidth: 0 }}>
          <EntityAvatar glyph={glyph} photo={photo} round={round} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: subNav.headerGapXs, minWidth: 0, flex: '1 0 0' }}>
            <span
              title={name}
              style={{
                ...type.h5,
                color: subNav.headerTitleText,
                // Entity Name clamps to two lines before it ellipsises.
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              }}
            >
              {name}
            </span>
            <span
              title={level}
              style={{
                ...type.h7,
                color: subNav.headerAdditionalText,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {level}
            </span>
            <StatusChip label={statusLabel} />
          </div>
        </div>

        {/* info slot — Info 1 / Info 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: subNav.headerGapXs, minWidth: 0 }}>
          {info.map(row => (
            <Info key={row.label} {...row} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map(item => (
          <Item key={item.id} item={item} selected={selected === item.id} onSelect={() => onSelect(item.id)} />
        ))}
      </div>
    </div>
  );
}

export default StudySidebar;
