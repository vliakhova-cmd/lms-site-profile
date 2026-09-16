import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faAngleLeft, faAngleRight, faEllipsis, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { color, type, table as t, checkbox as cb, pagination as pg, chipOutline as ch, button as btn, icon } from './tokens';

// The table chrome shared by every listing on this screen — lifted out of
// CourseTable once the Sites listing needed the same Checkbox, cell metrics
// and pagination. Column sets and cell contents stay with each table.

/** control/checkbox — DS Base 11252:112938. 15×15, radius 2, 1px rule. */
export function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const [hover, setHover] = useState(false);
  const bg = checked ? (hover ? cb.selectedHoverBg : cb.selectedBg) : hover ? cb.hoverBg : cb.restingBg;
  const border = checked ? (hover ? cb.selectedHoverBorder : cb.selectedBorder) : hover ? cb.hoverBorder : cb.restingBorder;
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: cb.size,
        height: cb.size,
        borderRadius: cb.radius,
        border: `${cb.borderWidth}px solid ${border}`,
        backgroundColor: bg,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M1 5.2L3.6 7.8L9 2.2" stroke={cb.icon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/** The same box with a dash — a header checkbox over a partial selection. */
export function PartialCheckbox({ onChange }: { onChange: (v: boolean) => void }) {
  return (
    <span
      role="checkbox"
      aria-checked="mixed"
      tabIndex={0}
      onClick={() => onChange(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: cb.size,
        height: cb.size,
        borderRadius: cb.radius,
        border: `${cb.borderWidth}px solid ${cb.selectedBorder}`,
        backgroundColor: cb.selectedBg,
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path d="M1.5 5H8.5" stroke={cb.icon} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export const HEAD: React.CSSProperties = {
  height: t.headerHeight,
  paddingLeft: t.headerPaddingLeft,
  paddingRight: t.headerPaddingRight,
  textAlign: 'left',
  ...type.tableHeader,
  color: color.textMuted,
  borderBottom: `1px solid ${color.borderSubtle}`,
  whiteSpace: 'nowrap',
  backgroundColor: color.white,
};

export const CELL: React.CSSProperties = {
  height: t.cellMinHeight,
  paddingLeft: t.cellPaddingLeft,
  paddingRight: t.cellPaddingRight,
  paddingTop: t.cellPaddingY,
  paddingBottom: t.cellPaddingY,
  borderBottom: `1px solid ${color.borderSubtle}`,
  ...type.tableCell,
  color: color.text,
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/** table/header/sorting — the active column carries the brand tone and an arrow. */
export function SortableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th style={HEAD}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: color.headerSortActive }}>
        {children}
        <FontAwesomeIcon icon={faArrowDown} style={{ width: 11, height: 11 }} />
      </span>
    </th>
  );
}

export type ChipTheme = keyof typeof ch.theme;

/**
 * Chip/Outline — DS - Base | IN PROGRESS | 2.0, Chip node 11712:23840.
 * Transparent fill, a tone-coloured 1px border and glyph, and a Body/Semibold
 * label. Hover fills it with the tone; the glyph is 15px inside a 20px
 * chip/icon-size-s box. The component has both shapes — these use
 * chip/round-radius.
 */
export function Chip({ glyph, label, theme = 'base' }: { glyph?: IconDefinition; label: React.ReactNode; theme?: ChipTheme }) {
  const [hover, setHover] = useState(false);
  const tone = ch.theme[theme];
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: ch.gap,
        minWidth: ch.minWidth,
        maxWidth: ch.labelMaxWidth,
        padding: `${ch.paddingY}px ${ch.paddingX}px`,
        border: `${ch.borderWidth}px solid ${hover ? tone.hoverBg : tone.border}`,
        borderRadius: ch.roundRadius,
        backgroundColor: hover ? tone.hoverBg : 'transparent',
        color: ch.text,
        ...type.bodySemibold,
        whiteSpace: 'nowrap',
        transition: 'background-color 100ms',
      }}
    >
      {glyph && (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: ch.iconBox, height: ch.iconBox, flexShrink: 0 }}>
          <FontAwesomeIcon icon={glyph} style={{ width: ch.glyph, height: ch.glyph, color: tone.icon }} />
        </span>
      )}
      {label}
    </span>
  );
}

/**
 * Row actions "···" — Button/Outline tertiary, as doa-log/DocumentGrid.tsx
 * builds it: TRANSPARENT fill so the row's hover/selected tint shows through,
 * a #dce1eb border (not the secondary blue), and a 15px glyph in a 20px box.
 */
export function RowActionsButton() {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label="More actions"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${btn.mediumPaddingY}px ${btn.iconBtnPaddingX}px`,
        border: `${btn.borderWidth}px solid ${color.outlineTertiaryBorder}`,
        borderRadius: btn.radius,
        background: hover ? color.surfaceSubtlest : color.outlineTertiaryBg,
        color: color.outlineTertiaryText,
        cursor: 'pointer',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: btn.iconBoxS, height: btn.iconBoxS }}>
        <FontAwesomeIcon icon={faEllipsis} style={{ width: icon.s, height: icon.s }} />
      </span>
    </button>
  );
}

/** favorite/resting-inactive-icon — an unstarred row. */
export function FavoriteStar() {
  return <FontAwesomeIcon icon={faStar} style={{ width: icon.s, height: icon.s, color: color.iconFaint }} />;
}

/** A cell link — Buttons/Medium-Link on brand, with an optional leading glyph. */
export function CellLink({ glyph, label, onClick }: { glyph?: IconDefinition; label: string; onClick?: () => void }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: t.gap, minWidth: 0 }}>
      {glyph && <FontAwesomeIcon icon={glyph} style={{ width: icon.s, height: icon.s, color: color.iconFaint, flexShrink: 0 }} />}
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          onClick?.();
        }}
        title={label}
        style={{ ...type.link, color: color.primary, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {label}
      </a>
    </span>
  );
}

/** pagination/* — "Showing X to Y from Z items" beside Previous / page / Next. */
export function Pagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPage,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPage: (p: number) => void;
}) {
  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  const step = (label: string, to: number, disabled: boolean, glyph: IconDefinition, trailing: boolean) => (
    <button
      type="button"
      onClick={() => onPage(to)}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        border: 'none',
        background: 'transparent',
        color: disabled ? color.iconMuted : color.primary,
        cursor: disabled ? 'default' : 'pointer',
        ...type.link,
      }}
    >
      {!trailing && <FontAwesomeIcon icon={glyph} style={{ width: icon.s, height: icon.s }} />}
      {label}
      {trailing && <FontAwesomeIcon icon={glyph} style={{ width: icon.s, height: icon.s }} />}
    </button>
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: pg.gapM,
        padding: `${pg.paddingTop}px ${pg.paddingX}px ${pg.paddingBottom}px`,
        borderTop: `1px solid ${color.borderSubtle}`,
        flexShrink: 0,
      }}
    >
      <span style={{ ...type.captionRegular, color: color.textMuted }}>
        Showing {rangeStart} to {rangeEnd} from {totalItems} items
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: pg.gapM }}>
        {step('Previous', Math.max(1, page - 1), page === 1, faAngleLeft, false)}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: pg.gapXs }}>
          <input
            value={page}
            onChange={e => {
              const n = Number(e.target.value.replace(/\D/g, ''));
              if (n >= 1 && n <= totalPages) onPage(n);
            }}
            style={{
              width: pg.pageInputWidth,
              height: 30,
              textAlign: 'center',
              backgroundColor: color.pageBg,
              border: 'none',
              borderBottom: `1px solid ${color.border}`,
              borderRadius: '5px 5px 0 0',
              outline: 'none',
              ...type.body,
              color: color.text,
            }}
          />
          <span style={{ ...type.body, color: color.textMuted }}>
            of <b style={{ color: color.text }}>{totalPages}</b>
          </span>
        </div>
        {step('Next', Math.min(totalPages, page + 1), page === totalPages, faAngleRight, true)}
      </div>
    </div>
  );
}

/** The white, rounded surface a listing sits on — table/bg, table/radius. */
export function TableSurface({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: '1 0 0',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: color.white,
        borderRadius: t.radius,
        border: `1px solid ${color.borderSubtle}`,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
