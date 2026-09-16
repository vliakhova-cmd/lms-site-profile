import { useState } from 'react';
import { VIEW_TABS, DEFAULT_VIEW_TAB, ViewTab } from './learnerData';
import { color, type, button as btn } from './tokens';

// doa-log/src/PageHeader.tsx's ViewChip verbatim (outline tertiary pill,
// selected → solid #5391c6 + white text) — this is the "View by ___"
// selector, moved from a tree-panel dropdown to page-header tabs per that
// file's own note that view selection belongs beside the title.

function ViewChip({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: btn.mediumMinWidth,
        padding: `${btn.mediumPaddingY}px ${btn.mediumPaddingX}px`,
        border: `${btn.borderWidth}px solid ${selected ? color.chipSelectedBg : color.chipRestingBorder}`,
        borderRadius: btn.radius,
        backgroundColor: selected ? color.chipSelectedBg : hover ? color.white : 'transparent',
        color: selected ? color.chipSelectedText : color.chipRestingText,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 100ms',
        ...type.button,
      }}
    >
      {label}
    </button>
  );
}

export interface ViewTabsProps {
  /** Defaults to the learner tree's Site / Role / Learner views. */
  tabs?: readonly string[];
  /**
   * Pass these two when the page needs the selection — Training Library swaps
   * its whole grid on it. Left out, the chips keep their own state.
   */
  value?: string;
  onChange?: (v: string) => void;
}

export function ViewTabs({ tabs = VIEW_TABS, value, onChange }: ViewTabsProps) {
  const [own, setOwn] = useState<ViewTab>(DEFAULT_VIEW_TAB);
  const active = value ?? own;
  const select = (v: string) => (onChange ? onChange(v) : setOwn(v as ViewTab));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {tabs.map(v => (
        <ViewChip key={v} label={v} selected={v === active} onSelect={() => select(v)} />
      ))}
    </div>
  );
}

export default ViewTabs;
