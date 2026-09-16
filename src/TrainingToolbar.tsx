import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faBan,
  faRotateLeft,
  faMagnifyingGlass,
  faFilter,
  faEllipsis,
  faChevronDown,
  faCircleDown,
  faGraduationCap,
  faPen,
  faPaperPlane,
  faLinkSlash,
  faCircleUp,
  faUserPlus,
  faUserCheck,
  faTrashCan,
  faCirclePlay,
  faTableList,
  faWandMagicSparkles,
  faFileLines,
  faBell,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { color, type, button as btn, toolbar as tb, table as t, icon } from './tokens';

// Ported from ai-course-authoring-flow/src/ContentLibraryLauncher.tsx —
// ToolbarAction + LeftActionBar + MoreActionsMenu.
//
// The part that matters is LeftActionBar: the action row NEVER wraps. It
// measures each action against the space it actually has and hands whatever
// stops fitting to a "More" menu, left to right, so a narrow content column
// collapses actions instead of pushing Search/Filters onto a second line.
//
// Its colours are mapped onto this project's tokens rather than kept as the
// source file's literals: that file predates tokens.ts and hardcodes its own
// palette (#053c80 hover, 13px glyphs, radius 4). The behaviour is identical;
// the chrome is Button/Flat — hover inverts to
// button/flat/primary/{pressed-bg,pressed-text}, disabled is the DS's 40%.

const ACTION_GAP = 15;

/** `key` identifies an action in the list; it is not a prop the button renders. */
const stripKey = ({ key: _key, ...rest }: Action): Omit<Action, 'key'> => rest;

interface Action {
  key: string;
  icon: IconDefinition;
  label: string;
  /** A trailing caret, for an action that opens a menu. */
  rightIcon?: IconDefinition;
  disabled?: boolean;
  onClick?: () => void;
  /**
   * Turns the action into a dropdown: clicking it lists these instead of
   * firing onClick. Create Course uses it for its two ways to author one.
   */
  menu?: Action[];
  /** A menu item's own glyph colour, for an item that carries a tone (AI = purple). */
  iconColor?: string;
}

/** The dropdown body shared by "More" and by any action that carries a menu. */
function ActionMenuList({ items, onPick, style }: { items: Action[]; onPick: () => void; style: { top: number; left: number } }) {
  return (
    <div
      style={{
        position: 'fixed',
        backgroundColor: color.white,
        border: `1px solid ${color.border}`,
        borderRadius: btn.radius,
        boxShadow: btn.solidShadow,
        padding: 5,
        minWidth: 180,
        zIndex: 50,
        ...style,
      }}
    >
      {items.map(item => (
        <button
          key={item.key}
          type="button"
          disabled={item.disabled}
          onClick={() => {
            onPick();
            item.onClick?.();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: btn.flatGap,
            width: '100%',
            padding: 5,
            background: 'none',
            border: 'none',
            borderRadius: btn.flatRadius,
            cursor: item.disabled ? 'not-allowed' : 'pointer',
            opacity: item.disabled ? t.cellDisabledOpacity / 100 : 1,
            textAlign: 'left',
            whiteSpace: 'nowrap',
            ...type.body,
            color: color.text,
          }}
          onMouseEnter={e => {
            if (!item.disabled) e.currentTarget.style.backgroundColor = color.cellHoverBg;
          }}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <FontAwesomeIcon icon={item.icon} style={{ width: icon.s, height: icon.s, color: item.iconColor ?? color.primary }} />
          {item.label}
        </button>
      ))}
    </div>
  );
}

/** Button/Flat — resting is transparent with a primary glyph+label; hover inverts the whole button. */
function ToolbarAction({ icon: glyph, label, rightIcon, onClick, disabled = false, menu }: Omit<Action, 'key'>) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const active = (hover || open) && !disabled;
  const fg = active ? color.flatPrimaryPressedText : color.flatPrimaryText;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // Same reason as MoreActionsMenu: the action group clips its overflow, so a
  // dropdown has to be positioned `fixed` from the trigger's live coordinates.
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 5, left: rect.left });
  }, [open]);

  const button = (
    <button
      ref={btnRef}
      type="button"
      onClick={menu ? () => setOpen(o => !o) : onClick}
      disabled={disabled}
      aria-haspopup={menu ? 'menu' : undefined}
      aria-expanded={menu ? open : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: btn.flatGap,
        padding: `${btn.flatPaddingY}px ${btn.flatPaddingX}px`,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        border: `${btn.flatBorderWidth}px solid transparent`,
        borderRadius: btn.flatRadius,
        backgroundColor: active ? color.flatPrimaryPressedBg : 'transparent',
        color: fg,
        cursor: disabled ? 'not-allowed' : 'pointer',
        // table/cell/disabled-opacity
        opacity: disabled ? t.cellDisabledOpacity / 100 : 1,
        transition: 'background-color 100ms',
        ...type.button,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: btn.iconBoxS, height: btn.iconBoxS, flexShrink: 0 }}>
        <FontAwesomeIcon icon={glyph} style={{ width: icon.s, height: icon.s }} />
      </span>
      {label}
      {rightIcon && <FontAwesomeIcon icon={rightIcon} style={{ width: 11, height: 11, flexShrink: 0 }} />}
    </button>
  );

  if (!menu) return button;

  return (
    <div ref={wrapRef} style={{ position: 'relative', flexShrink: 0 }}>
      {button}
      {open && menuPos && <ActionMenuList items={menu} onPick={() => setOpen(false)} style={menuPos} />}
    </div>
  );
}

/**
 * Always-visible trigger; when actions from the left group don't fit on one
 * line, LeftActionBar hands the overflow here instead of wrapping.
 */
function MoreActionsMenu({ items }: { items: Action[] }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // The action group clips overflow (so a too-narrow row never collides with
  // Search/Filters), so the menu is positioned `fixed` from the trigger's live
  // coordinates — that lets it escape the clip instead of being cut off by it.
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 5, left: rect.left });
  }, [open]);

  const active = hover || open;

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: btn.flatGap,
          padding: `${btn.flatPaddingY}px ${btn.flatPaddingX}px`,
          border: `${btn.flatBorderWidth}px solid transparent`,
          borderRadius: btn.flatRadius,
          backgroundColor: active ? color.flatPrimaryPressedBg : 'transparent',
          color: active ? color.flatPrimaryPressedText : color.flatPrimaryText,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'background-color 100ms',
          ...type.button,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: btn.iconBoxS, height: btn.iconBoxS, flexShrink: 0 }}>
          <FontAwesomeIcon icon={faEllipsis} style={{ width: icon.s, height: icon.s }} />
        </span>
        More
        <FontAwesomeIcon icon={faChevronDown} style={{ width: 11, height: 11, flexShrink: 0 }} />
      </button>

      {open && items.length > 0 && menuPos && <ActionMenuList items={items} onPick={() => setOpen(false)} style={menuPos} />}
    </div>
  );
}

/**
 * Map Course is the primary action and always stays on the line; the state
 * actions collapse into the More menu, left to right, as soon as they stop
 * fitting — so the action row never wraps onto a second line.
 */
function LeftActionBar({ primary, candidates }: { primary: Action; candidates: Action[] }) {
  const groupRef = useRef<HTMLDivElement>(null);
  const primaryMeasureRef = useRef<HTMLDivElement>(null);
  const moreMeasureRef = useRef<HTMLDivElement>(null);
  const candidateMeasureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [visibleCount, setVisibleCount] = useState(candidates.length);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const recalc = () => {
      const available = group.offsetWidth;
      const primaryWidth = primaryMeasureRef.current?.offsetWidth ?? 0;
      const moreWidth = moreMeasureRef.current?.offsetWidth ?? 0;

      let used = primaryWidth + ACTION_GAP + moreWidth;
      let count = 0;
      for (let i = 0; i < candidates.length; i++) {
        const w = (candidateMeasureRefs.current[i]?.offsetWidth ?? 0) + ACTION_GAP;
        if (used + w > available) break;
        used += w;
        count++;
      }
      setVisibleCount(count);
    };

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(group);
    return () => observer.disconnect();
  }, [candidates.length]);

  const visibleActions = candidates.slice(0, visibleCount);
  const overflowActions = candidates.slice(visibleCount);

  return (
    <>
      <div
        ref={groupRef}
        style={{ display: 'flex', alignItems: 'center', gap: ACTION_GAP, flex: '1 1 auto', minWidth: 0, flexWrap: 'nowrap', overflow: 'hidden' }}
      >
        <ToolbarAction {...stripKey(primary)} />
        {visibleActions.map(action => (
          <ToolbarAction key={action.key} {...stripKey(action)} />
        ))}
        {overflowActions.length > 0 && <MoreActionsMenu items={overflowActions} />}
      </div>

      {/* Off-screen clones used only to measure natural widths for the overflow calc above */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', visibility: 'hidden', top: -9999, left: -9999, display: 'flex', gap: ACTION_GAP, whiteSpace: 'nowrap', pointerEvents: 'none' }}
      >
        <div ref={primaryMeasureRef}>
          <ToolbarAction {...stripKey(primary)} />
        </div>
        {candidates.map((action, i) => (
          <div key={action.key} ref={el => (candidateMeasureRefs.current[i] = el)}>
            <ToolbarAction {...stripKey(action)} />
          </div>
        ))}
        <div ref={moreMeasureRef}>
          <MoreActionsMenu items={[]} />
        </div>
      </div>
    </>
  );
}

function SearchField({ placeholder }: { placeholder: string }) {
  const [value, setValue] = useState('');
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        width: 200,
        // The field yields width before the action group starts clipping its
        // own labels — the source sits on a much wider page and never has to.
        minWidth: 120,
        flexShrink: 1,
        height: 30,
        padding: '0 8px',
        backgroundColor: color.white,
        border: `1px solid ${color.border}`,
        borderRadius: btn.radius,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: btn.iconBoxS, height: btn.iconBoxS, flexShrink: 0 }}>
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: icon.s, height: icon.s, color: color.iconMuted }} />
      </span>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{ flex: '1 0 0', minWidth: 0, border: 'none', outline: 'none', background: 'transparent', ...type.body, color: color.text }}
      />
    </div>
  );
}

/**
 * Actions that act ON rows stay disabled until something is selected — the
 * same rule ai-course-authoring-flow applies to Download/Edit/Delete. Add,
 * Import and Export always apply to the list as a whole.
 */
export const sitesActions = (hasSelection: boolean) => ({
  primary: { key: 'add', icon: faPlus, label: 'Add', rightIcon: faChevronDown } as Action,
  candidates: [
    { key: 'import', icon: faCircleDown, label: 'Import' },
    { key: 'assign', icon: faGraduationCap, label: 'Assign Trainings', disabled: !hasSelection },
    { key: 'change-status', icon: faPen, label: 'Change Status', disabled: !hasSelection },
    { key: 'release', icon: faPaperPlane, label: 'Release Training', disabled: !hasSelection },
    { key: 'remove', icon: faLinkSlash, label: 'Remove', disabled: !hasSelection },
    { key: 'export', icon: faCircleUp, label: 'Export' },
  ] as Action[],
});

// The DOA log is authored and signed in eTMF and imported here, so there is
// nothing to create — the actions are about the mapping, and the document
// itself is opened from the source-document bar at the top of the section.
export const doaActions = (hasSelection: boolean, readOnly = false) => ({
  // Drafting a course from the study documents is offered on the unmapped
  // duties themselves, not here — the toolbar only maintains the mapping, so
  // the always-available re-check leads and the row action stays disabled
  // until something is selected.
  //
  // Inside a site profile the mapping is not editable at all — it is a study
  // decision — so the site's Link course is dropped rather than replaced.
  primary: { key: 'recheck', icon: faRotateLeft, label: 'Re-run eTMF check' } as Action,
  candidates: [
    ...(readOnly
      ? [
          // Chases the people this matrix shows as short of their training.
          // People belong to a site, so the reminder is a site action — the
          // study has no one in particular to send it to.
          { key: 'remind', icon: faBell, label: 'Send reminder' },
        ]
      : [{ key: 'link', icon: faGraduationCap, label: 'Link course', disabled: !hasSelection }]),
    { key: 'export', icon: faCircleUp, label: 'Export matrix' },
  ] as Action[],
});

/**
 * Training Library. Add and Export apply to the catalogue as a whole;
 * everything that acts ON catalogue items waits for a selection. The order is
 * the source screen's, so the tail (Manage Learner Status / View Activity
 * Completion / Export) is what LeftActionBar hands to "More" first.
 */
export const libraryActions = (
  hasSelection: boolean,
  view: 'Courses' | 'Learning Plans',
  /** Create Course → AI Course Authoring. Opens the authoring modal. */
  onAiAuthoring?: () => void,
  onBlankCourse?: () => void,
) => ({
  primary:
    view === 'Courses'
      ? ({
          key: 'create',
          icon: faPlus,
          label: 'Create Course',
          rightIcon: faChevronDown,
          // Ported from ai-course-authoring-flow's CreateCourseMenu — the same
          // two ways in, on this project's Button/Flat chrome.
          menu: [
            { key: 'ai', icon: faWandMagicSparkles, iconColor: color.accentPurpleSaturated, label: 'AI Course Authoring', onClick: onAiAuthoring },
            { key: 'blank', icon: faFileLines, label: 'Blank Course', onClick: onBlankCourse },
          ],
        } as Action)
      : ({ key: 'add', icon: faPlus, label: 'Add Learning Plan' } as Action),
  candidates: [
    { key: 'assignment', icon: faUserPlus, label: 'Manage Assignment', rightIcon: faChevronDown, disabled: !hasSelection },
    { key: 'edit', icon: faPen, label: 'Edit', disabled: !hasSelection },
    { key: 'delete', icon: faTrashCan, label: 'Delete', disabled: !hasSelection },
    { key: 'publish', icon: faCirclePlay, label: 'Publish', disabled: !hasSelection },
    { key: 'release', icon: faPaperPlane, label: 'Release', disabled: !hasSelection },
    { key: 'learner-status', icon: faUserCheck, label: 'Manage Learner Status', disabled: !hasSelection },
    { key: 'activity', icon: faTableList, label: 'View Activity Completion', disabled: !hasSelection },
    { key: 'export', icon: faCircleUp, label: 'Export to Excel' },
  ] as Action[],
});

/**
 * A user profile's actions. The source frames put Export Progress Report and
 * Remove in the page header; here they join the toolbar every other listing
 * uses, with the section's own actions beside them. What acts ON rows waits
 * for a selection, as everywhere else.
 */
export const userActions = (section: string) => ({
  primary: { key: 'export-progress', icon: faCircleDown, label: 'Export Progress Report' } as Action,
  candidates: [
    ...(section === 'courses' || section === 'learning-plans'
      ? [
          { key: 'status', icon: faUserCheck, label: 'Manage User Status', disabled: true },
          { key: 'unenrol', icon: faLinkSlash, label: 'Unenrol', disabled: true },
          { key: 'remind', icon: faBell, label: 'Send Reminder', disabled: true },
        ]
      : []),
    ...(section === 'tasks' ? [{ key: 'enroll', icon: faUserPlus, label: 'Enroll in Missing Courses' }] : []),
    ...(section === 'groups' ? [{ key: 'remove-group', icon: faLinkSlash, label: 'Remove User from Group', disabled: true }] : []),
    ...(section === 'certificates'
      ? [
          { key: 'download', icon: faCircleDown, label: 'Download', disabled: true },
          { key: 'resend', icon: faPaperPlane, label: 'Resend Certificate', disabled: true },
        ]
      : []),
    { key: 'export', icon: faCircleUp, label: 'Export to Excel' },
    { key: 'remove', icon: faTrashCan, label: 'Remove' },
  ] as Action[],
});

/**
 * Site Personnel. Adding users and exporting apply to the site's roster;
 * everything that acts ON people waits for a selection.
 */
export const personnelActions = (hasSelection: boolean) => ({
  primary: { key: 'add', icon: faPlus, label: 'Add Users' } as Action,
  candidates: [
    { key: 'site-role', icon: faPen, label: 'Edit Site Role', disabled: !hasSelection },
    { key: 'plans', icon: faGraduationCap, label: 'Training Plans', disabled: !hasSelection },
    { key: 'release', icon: faPaperPlane, label: 'Release', disabled: !hasSelection },
    { key: 'remove', icon: faTrashCan, label: 'Remove', disabled: !hasSelection },
    { key: 'export', icon: faCircleUp, label: 'Export', rightIcon: faChevronDown },
  ] as Action[],
});

/**
 * A site's Training Plans. Mapping a course applies to the site; marking
 * something not applicable, reverting it, releasing it and removing it act on
 * the selection.
 */
export const siteTrainingActions = (hasSelection: boolean, view: 'Courses' | 'Learning Plans') => ({
  primary: { key: 'map', icon: faPlus, label: view === 'Courses' ? 'Map Course' : 'Map Learning Plan' } as Action,
  candidates: [
    { key: 'not-applicable', icon: faBan, label: 'Not Applicable', disabled: !hasSelection },
    { key: 'revert', icon: faRotateLeft, label: 'Revert to Applicable', disabled: !hasSelection },
    { key: 'release', icon: faPaperPlane, label: 'Release', disabled: !hasSelection },
    { key: 'remove', icon: faTrashCan, label: 'Remove', disabled: !hasSelection },
  ] as Action[],
});

export const trainingPlansActions = (hasSelection: boolean) => ({
  primary: { key: 'map-course', icon: faPlus, label: 'Map Course' } as Action,
  candidates: [
    { key: 'not-applicable', icon: faBan, label: 'Not Applicable', disabled: !hasSelection },
    { key: 'revert', icon: faRotateLeft, label: 'Revert to Applicable', disabled: !hasSelection },
  ] as Action[],
});


export interface ActionToolbarProps {
  /** Always stays on the line. */
  primary: Action;
  /** Collapse into "More", left to right, as the row runs out of room. */
  candidates: Action[];
  searchPlaceholder?: string;
}

export function TrainingToolbar({ primary, candidates, searchPlaceholder = 'Search' }: ActionToolbarProps) {
  return (
    // toolbar/* — height 40, bg #e5f1fb, radius 5, padding-x 15, gap 15.
    // (The source file bands its row in #edf5fb at full bleed; this uses the
    // DS Base toolbar token the rest of the project is on.)
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: tb.gap,
        height: tb.height,
        padding: `0 ${tb.paddingX}px`,
        backgroundColor: color.toolbarBg,
        borderRadius: tb.radius,
        flexShrink: 0,
        flexWrap: 'nowrap',
      }}
    >
      <LeftActionBar primary={primary} candidates={candidates} />

      <div style={{ display: 'flex', alignItems: 'center', gap: tb.gap, flexWrap: 'nowrap', minWidth: 0 }}>
        <SearchField placeholder={searchPlaceholder} />
        <ToolbarAction key="filters" icon={faFilter} label="Filters" />
      </div>
    </div>
  );
}

export default TrainingToolbar;
