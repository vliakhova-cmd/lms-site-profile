import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation, faClock, faUser, faFileContract, faGraduationCap, faBuilding, faUserPlus, faBell, faCheck } from '@fortawesome/free-solid-svg-icons';
import { gapRowsFor, peopleNotEnrolled, gapKey, type GapRow } from './personnelData';
import { Checkbox, PartialCheckbox, HEAD, CELL, CellLink, TableSurface } from './tableKit';
import { color, type, dialog as dlg, button as btn, toolbar as tb, table as t, status as st, icon } from './tokens';

// Training Gaps — the whole list, opened from the banner that counts them.
//
// It used to be a column, which could only ever show a number per row: the
// duty and the course behind it lived in a tooltip, and the site's gaps were
// scattered down a paged table you had to read row by row. Gathered here they
// are one list, ordered by what someone has to do about them.
//
// Two kinds, kept apart. NOT ENROLLED means nobody assigned the course — an
// administrator's job, today. OVERDUE means they have it and have not done it
// — a learner's. Merging them into "incomplete" would hide who has to act.

const KIND = {
  'not-enrolled': { label: 'Not enrolled', glyph: faCircleExclamation, tone: color.critical, fill: color.statusSolidRed },
  overdue: { label: 'Overdue', glyph: faClock, tone: color.statusFlatOrange, fill: color.statusOrange },
} as const;

function ToolbarAction({ glyph, label, disabled, onClick }: { glyph: typeof faBell; label: string; disabled?: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: btn.flatGap,
        padding: `${btn.flatPaddingY}px ${btn.flatPaddingX}px`,
        border: `${btn.flatBorderWidth}px solid transparent`,
        borderRadius: btn.flatRadius,
        backgroundColor: hover && !disabled ? color.flatPrimaryHoverBg : 'transparent',
        color: color.flatPrimaryText,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? t.cellDisabledOpacity / 100 : 1,
        whiteSpace: 'nowrap',
        ...type.button,
      }}
    >
      <FontAwesomeIcon icon={glyph} style={{ width: icon.s, height: icon.s }} />
      {label}
    </button>
  );
}

/**
 * The row's own way out. The toolbar does these in bulk; here it sits next to
 * the gap it closes, so fixing one is a click rather than tick-then-aim. Which
 * action appears is decided by the gap: enrolling is for someone who was never
 * given the course, reminding is for someone sitting on one.
 */
function RowAction({ glyph, label, done, onClick }: { glyph: typeof faBell; label: string; done?: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);

  if (done) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, ...type.captionSemibold, color: color.confirmation }}>
        <FontAwesomeIcon icon={faCheck} style={{ width: icon.xs, height: icon.xs }} />
        Sent
      </span>
    );
  }

  // Button/Outline tertiary, small — a bordered control reads as a thing to
  // press, where the flat link read as part of the row's text.
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: btn.flatGap,
        minWidth: btn.smallMinWidth,
        padding: `${btn.smallPaddingY}px ${btn.smallPaddingX}px`,
        border: `${btn.borderWidth}px solid ${color.outlineTertiaryBorder}`,
        borderRadius: btn.radius,
        backgroundColor: hover ? color.cellHoverBg : color.outlineTertiaryBg,
        color: color.outlineTertiaryText,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        ...type.buttonSmall,
      }}
    >
      <FontAwesomeIcon icon={glyph} style={{ width: icon.xs, height: icon.xs }} />
      {label}
    </button>
  );
}

function KindChip({ row }: { row: GapRow }) {
  const k = KIND[row.kind];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: `0 ${st.paddingX}px`,
          borderRadius: st.radius,
          backgroundColor: k.fill,
          color: color.text,
          ...type.status,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <FontAwesomeIcon icon={k.glyph} style={{ width: 11, height: 11, color: k.tone }} />
        {k.label}
      </span>
      {/* A due date only means something for training somebody actually has. */}
      {row.due && <span style={{ ...type.captionRegular, color: color.cellAdditionalText }}>due {row.due}</span>}
    </span>
  );
}

export function TrainingGapsDialog({
  site,
  closed,
  onEnroll,
  onOpenUser,
  onClose,
}: {
  site?: string;
  /** Gaps already closed by enrolling someone — they drop off the list. */
  closed?: Set<string>;
  onEnroll: (keys: string[]) => void;
  onOpenUser?: (row: GapRow) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // Opened from a site it is that site's list; from the study it is every
  // site's, and then WHICH site is the first thing you need to know.
  const rows = gapRowsFor(site, closed);
  const people = peopleNotEnrolled(site, closed);

  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [reminded, setReminded] = useState<Set<string>>(new Set());

  const pickedRows = rows.filter(r => picked.has(gapKey(r)));
  // Each action fits one kind of gap and not the other. You cannot enrol
  // someone who already has the course, and you cannot remind someone about a
  // course nobody has given them — so each acts on the rows it applies to and
  // says how many that is.
  const toEnrol = pickedRows.filter(r => r.kind === 'not-enrolled');
  const toRemind = pickedRows.filter(r => r.kind === 'overdue');

  const toggle = (k: string, on: boolean) =>
    setPicked(prev => {
      const next = new Set(prev);
      if (on) next.add(k);
      else next.delete(k);
      return next;
    });

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
      style={{
        // Seven columns at study scope, two of them long names — wide, but
        // inside dialog/extralarge-large-max-width.
        width: 1300,
        maxWidth: `min(${dlg.maxWidth}px, calc(100vw - 40px))`,
        maxHeight: `min(${dlg.maxHeight}px, calc(100vh - 40px))`,
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        border: 'none',
        borderRadius: dlg.radius,
        backgroundColor: dlg.bg,
        boxShadow: dlg.shadow,
        color: color.text,
        fontFamily: type.body.fontFamily,
        overflow: 'hidden',
      }}
    >
      {/* dialog/titlebar — transparent fill and border */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: dlg.titlebarGap,
          padding: `${dlg.titlebarPaddingY}px ${dlg.titlebarPaddingX}px`,
          flexShrink: 0,
        }}
      >
        <FontAwesomeIcon icon={faCircleExclamation} style={{ width: icon.s, height: icon.s, color: color.critical, flexShrink: 0 }} />
        <span style={{ display: 'flex', flexDirection: 'column', flex: '1 0 0', minWidth: 0 }}>
          <span style={{ ...type.h3, color: color.text }}>Training Gaps</span>
          <span style={{ ...type.captionRegular, color: color.textMuted }}>
            Delegated on {site ? `${site}'s` : "each site's"} DOA log, without the training the task requires
          </span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: dlg.titlebarXSize,
            height: dlg.titlebarXSize,
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: color.flatPrimaryText,
            flexShrink: 0,
          }}
        >
          <FontAwesomeIcon icon={faXmark} style={{ width: icon.s, height: icon.s }} />
        </button>
      </div>

      {/* dialog/content — white, inset margin-x 15 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          height: 420,
          flex: '1 1 auto',
          minHeight: 0,
          margin: `0 ${dlg.contentInset}px`,
          padding: dlg.contentPaddingY,
          backgroundColor: dlg.contentBg,
          borderRadius: dlg.contentRadius,
          overflow: 'hidden',
        }}
      >
        {/* Toolbar/eTMF — what to do about the ticked rows */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tb.gap,
            height: tb.height,
            padding: `0 ${tb.paddingX}px`,
            backgroundColor: color.toolbarBg,
            borderRadius: tb.radius,
            flexShrink: 0,
          }}
        >
          <ToolbarAction
            glyph={faUserPlus}
            label={toEnrol.length > 0 ? `Enroll (${toEnrol.length})` : 'Enroll'}
            disabled={toEnrol.length === 0}
            onClick={() => {
              onEnroll(toEnrol.map(gapKey));
              setPicked(new Set());
            }}
          />
          <ToolbarAction
            glyph={faBell}
            label={toRemind.length > 0 ? `Send Reminder (${toRemind.length})` : 'Send Reminder'}
            disabled={toRemind.length === 0}
            onClick={() => {
              setReminded(prev => new Set([...prev, ...toRemind.map(gapKey)]));
              setPicked(new Set());
            }}
          />
        </div>

        <span style={{ ...type.bodyBold, color: color.text, flexShrink: 0 }}>
          {rows.length} {rows.length === 1 ? 'Gap' : 'Gaps'}
          <span style={{ ...type.body, color: color.textMuted }}>
            {' '}
            {people} {people === 1 ? 'person' : 'people'} not enrolled
            {picked.size > 0 && ` · ${picked.size} selected`}
          </span>
        </span>

        <TableSurface>
          <div style={{ flex: '1 0 0', minHeight: 0, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...HEAD, width: t.colCheckbox, minWidth: t.colCheckbox, paddingLeft: 10, paddingRight: 5 }}>
                    {picked.size > 0 && picked.size < rows.length ? (
                      <PartialCheckbox onChange={() => setPicked(new Set())} />
                    ) : (
                      <Checkbox
                        checked={rows.length > 0 && picked.size === rows.length}
                        onChange={v => setPicked(v ? new Set(rows.map(gapKey)) : new Set())}
                      />
                    )}
                  </th>
                  {!site && <th style={{ ...HEAD, width: 150 }}>Site</th>}
                  <th style={{ ...HEAD, width: 180 }}>User</th>
                  <th style={{ ...HEAD, width: 140 }}>Site Role</th>
                  <th style={HEAD}>Delegated Task</th>
                  <th style={HEAD}>Required Course</th>
                  <th style={{ ...HEAD, width: 170 }}>Gap</th>
                  <th style={{ ...HEAD, width: 140 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={`${row.site}-${row.name}-${row.duty}-${i}`}>
                    <td style={{ ...CELL, width: t.colCheckbox, minWidth: t.colCheckbox, paddingLeft: 10, paddingRight: 5 }}>
                      <Checkbox checked={picked.has(gapKey(row))} onChange={v => toggle(gapKey(row), v)} />
                    </td>
                    {!site && (
                      <td style={{ ...CELL, width: 150 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                          <FontAwesomeIcon icon={faBuilding} style={{ width: icon.s, height: icon.s, color: color.iconFaint, flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.site}</span>
                        </span>
                      </td>
                    )}
                    {/* The person is the thing you act on next, so their name
                        goes where their record is. */}
                    <td style={{ ...CELL, width: 180 }}>
                      <CellLink glyph={faUser} label={row.name} onClick={() => onOpenUser?.(row)} />
                    </td>
                    <td style={{ ...CELL, width: 140, color: color.cellAdditionalText }}>{row.siteRole}</td>
                    <td style={CELL}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                        <FontAwesomeIcon icon={faFileContract} style={{ width: icon.s, height: icon.s, color: color.iconFaint, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.duty}</span>
                      </span>
                    </td>
                    <td style={CELL}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 0 }} title={row.course}>
                        <FontAwesomeIcon icon={faGraduationCap} style={{ width: icon.s, height: icon.s, color: color.iconFaint, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.course}</span>
                      </span>
                    </td>
                    <td style={{ ...CELL, width: 170 }}>
                      <KindChip row={row} />
                    </td>
                    <td style={{ ...CELL, width: 140 }}>
                      {row.kind === 'not-enrolled' ? (
                        <RowAction glyph={faUserPlus} label="Enroll" onClick={() => onEnroll([gapKey(row)])} />
                      ) : (
                        <RowAction
                          glyph={faBell}
                          label="Send Reminder"
                          done={reminded.has(gapKey(row))}
                          onClick={() => setReminded(prev => new Set([...prev, gapKey(row)]))}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableSurface>
      </div>

      {/* dialog/footer — the action centred, no rule above it */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: dlg.footerGap,
          padding: `${dlg.footerPaddingY}px ${dlg.footerPaddingX}px`,
          backgroundColor: dlg.footerBg,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: btn.mediumMinWidth,
            padding: `${btn.mediumPaddingY}px ${btn.mediumPaddingX}px`,
            border: `${btn.borderWidth}px solid ${color.border}`,
            borderRadius: btn.radius,
            backgroundColor: color.white,
            color: color.primary,
            cursor: 'pointer',
            ...type.button,
          }}
        >
          Close
        </button>
      </div>
    </dialog>
  );
}

export default TrainingGapsDialog;
