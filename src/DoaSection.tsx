import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faWandMagicSparkles,
  faFileLines,
  faArrowUpRightFromSquare,
  faXmark,
  faListCheck,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import {
  Duty,
  QualifyingCourse,
  Coverage,
  coverageOf,
  CATALOGUE,
  doaForSite,
  STUDY_DUTIES,
  TEMPLATE_DOCUMENT,
  TRAINING_MATRIX,
  etmfUrlForSite,
  etmfDocUrlForSite,
  ETMF_URL,
  aiAuthoringUrl,
} from './doaData';
import { notEnrolledFor } from './personnelData';
import { HEAD, CELL, SortableHeader, Chip, Pagination, TableSurface } from './tableKit';
import { color, type, progressBar as pb, button as btn, card, chipOutline, dialog, menu, sysMsg, icon } from './tokens';

// DOA — the study's delegation → training matrix.
//
// The eTMF DOA log answers "is this person trained for what they signed for?".
// This is where the mapping behind that answer is maintained: one row per
// delegated duty, the LMS course that qualifies it, and how far the delegated
// people have got. A duty with no course is the interesting row — it is a hole
// in the catalogue, so instead of a status it carries a proposed course built
// from the study's own documents.

const COVERAGE_LABEL: Record<Coverage, string> = {
  covered: 'Covered',
  partial: 'In progress',
  gap: 'No course linked',
};

/** A source document as a chip that opens it in eTMF — Chip/Outline, info tone. */
function DocLink({ label, title, href }: { label: string; title: string; href: string }) {
  const [hover, setHover] = useState(false);
  const tone = chipOutline.theme.info;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: chipOutline.gap,
        // No chip/medium-label-max-width here: that 200 cap is for chips in a
        // dense cell, and it clipped a document name the header has room for.
        flexShrink: 0,
        padding: `${chipOutline.paddingY}px ${chipOutline.paddingX}px`,
        border: `${chipOutline.borderWidth}px solid ${hover ? tone.hoverBg : tone.border}`,
        borderRadius: chipOutline.roundRadius,
        backgroundColor: hover ? tone.hoverBg : color.white,
        // button/link/primary/resting-text — the label is a link, so it takes
        // the link tone rather than the chip's dark resting-main-text.
        color: color.primary,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'background-color 100ms',
        ...type.bodySemibold,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: chipOutline.iconBox, height: chipOutline.iconBox, flexShrink: 0 }}>
        <FontAwesomeIcon icon={faFileLines} style={{ width: chipOutline.glyph, height: chipOutline.glyph, color: tone.icon }} />
      </span>
      {label}
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ width: 11, height: 11, color: tone.icon, flexShrink: 0 }} />
    </a>
  );
}

/**
 * Whether this visitor has already dismissed the generated-tasks note. It is a
 * per-viewer convenience, so localStorage is the right home — and every access
 * is guarded, since a private window or blocked site data makes it throw.
 */
const NOTE_DISMISSED_KEY = 'doa.generated-note.dismissed';

function noteDismissed(): boolean {
  try {
    return localStorage.getItem(NOTE_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberNoteDismissed() {
  try {
    localStorage.setItem(NOTE_DISMISSED_KEY, '1');
  } catch {
    // No storage — the note simply greets this visitor again next time.
  }
}

/**
 * The header's provenance cluster: the two source documents as links into
 * eTMF, plus the wand that holds the "what just happened" note.
 *
 * The note is a popover rather than a banner because it is an arrival message:
 * it greets a first visit and, once dismissed, is gone for good. There is no
 * re-open affordance on purpose — a one-time "here is what just happened" does
 * not earn a permanent control in the header.
 */
export function DoaHeaderLinks({ site }: { site?: string }) {
  const { site: s, document: d } = doaForSite(site);
  // A site's note counts its own log; the study's counts the standard list.
  const duties = site ? doaForSite(site).duties : STUDY_DUTIES;
  const dutyCount = duties.length;
  const linked = duties.filter(x => x.courses.length > 0).length;
  const gaps = dutyCount - linked;
  const purple = card.accent.purple;
  const [open, setOpen] = useState(() => !noteDismissed());

  function dismiss() {
    setOpen(false);
    rememberNoteDismissed();
  }

  return (
    // marginLeft auto pushes the sources to the right end of the header row,
    // away from the title.
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0, marginLeft: 'auto', position: 'relative' }}>
      {/* The study's blank form fixes which duties exist, so it belongs to the
          study's own view. A site works from its SIGNED log, not the template
          it was signed on, so the template is not offered there. */}
      {!site && (
        <DocLink
          label={`${TEMPLATE_DOCUMENT.name} ${TEMPLATE_DOCUMENT.version}`}
          href={ETMF_URL}
          title={`eTMF · ${TEMPLATE_DOCUMENT.folderPath.join(' › ')} · ${TEMPLATE_DOCUMENT.version} · owner ${TEMPLATE_DOCUMENT.owner}`}
        />
      )}
      {/* A SIGNED log belongs to one site, so it is offered on that site's own
          view. The study works from the template and the matrix — the documents
          that apply to every site — not from any one site's signature. */}
      {site && (
        <DocLink
          label={d.name}
          href={etmfDocUrlForSite(s.number)}
          title={`eTMF · ${d.folderPath.join(' › ')} · ${d.version} · ${d.status} · signed ${d.signedOn} by ${d.owner}`}
        />
      )}
      <DocLink label={`${TRAINING_MATRIX.name} ${TRAINING_MATRIX.version}`} href={site ? etmfUrlForSite(s.number) : ETMF_URL} title="Open in eTMF" />

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 29 }} onClick={dismiss} />
          <div
            role="dialog"
            aria-label="How these tasks were created"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              zIndex: 30,
              width: 360,
              padding: menu.paddingXY,
              borderRadius: card.radius * 2,
              background: `linear-gradient(140deg, ${purple.bg} 0%, ${color.white} 60%)`,
              border: `1px solid ${purple.hover}`,
              boxShadow: menu.shadow,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'flex-start', gap: sysMsg.gapS }}>
              <span
                className="doa-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  backgroundColor: color.white,
                  flexShrink: 0,
                }}
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} style={{ width: icon.s, height: icon.s, color: purple.bar }} />
              </span>

              <span style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 0 0', minWidth: 0 }}>
                {/* A site's list is that site's log; the study's is the
                    template's standard duty list, which names no site. */}
                <span style={{ ...type.h5, color: color.text }}>
                  {site ? `${dutyCount} tasks created for ${d.site}` : `${dutyCount} tasks created from ${TEMPLATE_DOCUMENT.name}`}
                </span>
                <span style={{ ...type.body, color: color.sysMsgText }}>
                  {/* The unmapped duties are not empty — each carries a
                      proposed course waiting on a person to accept it. */}
                  <b style={{ color: color.text }}>{linked} matched</b> to a course ·{' '}
                  <b style={{ color: color.text }}>{gaps} still need review</b>
                </span>
                <span style={{ ...type.captionRegular, color: color.textMuted }} title={`Generated ${d.syncedAt}`}>
                  Edit or re-link any time
                </span>
              </span>

              <button
                type="button"
                aria-label="Dismiss"
                onClick={dismiss}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  color: color.flatBaseText,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <FontAwesomeIcon icon={faXmark} style={{ width: icon.s, height: icon.s }} />
              </button>
            </span>
          </div>
        </>
      )}
    </span>
  );
}

/**
 * Card/Overview — taken from doa-log's cross-module check (DS - Advanced node
 * 14601:151877). Label on top, then the value row: a 20px semantic glyph beside
 * the count in Headings/H6/Semibold. Selected is a light fill with a same-colour
 * 2px halo that keeps its dark text — not an inversion and not a brand ring.
 */
function Tile({
  label,
  value,
  glyph,
  accent = 'neutral',
  active,
  onClick,
}: {
  label: string;
  value: number;
  glyph: IconDefinition;
  accent?: keyof typeof card.accent;
  active: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const tone = card.accent[accent];
  const bg = active ? tone.selected : hover ? tone.hover : tone.bg;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        flex: '1 0 0',
        minWidth: 0,
        textAlign: 'left',
        font: 'inherit',
        cursor: 'pointer',
        backgroundColor: bg,
        // Highlighted=On — a 2px left rule in the accent's saturated tone
        border: `0 solid ${tone.bar}`,
        borderLeftWidth: card.borderWidth,
        borderRadius: card.radius,
        padding: card.padding,
        overflow: 'hidden',
        boxShadow: active ? `0 0 0 2px ${tone.selected}` : hover ? card.hoverShadow : card.shadow,
        transition: 'background-color 120ms, box-shadow 120ms',
      }}
    >
      <span style={{ display: 'block', ...type.captionRegular, color: active ? card.text : card.label }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: card.valueGap, marginTop: card.valueGap }}>
        <FontAwesomeIcon icon={glyph} style={{ width: card.iconSize, height: card.iconSize, flexShrink: 0, color: tone.bar === 'transparent' ? color.primary : tone.bar }} />
        <span style={{ ...type.h6, color: card.text }}>{value}</span>
      </span>
    </button>
  );
}

function TrainedBar({ duty, siteLevel }: { duty: Duty; siteLevel: boolean }) {
  // No course linked means there is nothing to have completed — an empty cell,
  // not a dash standing in for a number that does not exist.
  if (duty.courses.length === 0) return null;

  // People the log delegates without an enrolment. The count is the duty's own,
  // so it works at both levels — a site's log, or every site's summed. Where
  // the roster is loaded (site 0982) the tooltip can name them; elsewhere it
  // says how many and leaves the names to the site.
  const missing = duty.notEnrolled ?? 0;
  const named = siteLevel ? notEnrolledFor(duty.name) : [];

  // The denominator is everyone the log DELEGATES, not everyone enrolled. That
  // is the whole point: counting only the enrolled let a task read 100% while
  // someone carried it untrained, because nobody had put them in the course.
  const delegated = duty.assigned + missing;
  const percent = delegated === 0 ? 0 : Math.round((duty.trained / delegated) * 100);
  const trainedWidth = delegated === 0 ? 0 : (duty.trained / delegated) * 100;
  const gapWidth = delegated === 0 ? 0 : (missing / delegated) * 100;

  return (
    <span
      title={
        missing === 0
          ? undefined
          : named.length > 0
          ? named.map(g => `${g.person.name} carries this task and is not enrolled in ${g.course}`).join('\n')
          : `${missing} ${missing === 1 ? 'person carries' : 'people carry'} this task with no enrolment in its course — open the site to see who`
      }
      style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 110 }}
    >
      <span style={{ ...type.captionRegular, color: color.text }}>
        {percent}% · {duty.trained} of {delegated}
      </span>

      {/* One bar, three states: trained, enrolled but not finished (the track),
          and — at the far end — delegated with no enrolment at all. The last
          is a different kind of missing, so it is a different colour rather
          than more empty track. */}
      <span style={{ display: 'flex', height: pb.height, borderRadius: pb.radius, backgroundColor: color.progressTrack, overflow: 'hidden' }}>
        <span style={{ width: `${trainedWidth}%`, backgroundColor: color.confirmation }} />
        <span style={{ width: `${gapWidth}%`, marginLeft: 'auto', backgroundColor: color.critical }} />
      </span>
    </span>
  );
}

/**
 * The proposal a gap row carries instead of a status: the course the study's
 * own documents would produce, routed into the AI course authoring flow.
 */
function SuggestionCell({ duty }: { duty: Duty }) {
  const s = duty.suggestion;
  if (!s) return null;
  return (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, minWidth: 0 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
        <FontAwesomeIcon icon={faWandMagicSparkles} style={{ width: icon.s, height: icon.s, color: color.discover, flexShrink: 0 }} />
        <span style={{ ...type.bodySemibold, color: color.text, overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.course}>
          {s.course}
        </span>
      </span>
      <span style={{ ...type.captionRegular, color: color.cellAdditionalText }} title={s.source}>
        from {s.source}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <a
          // Same tab, and carrying where to come back to: closing the authoring
          // modal returns here rather than stranding the visitor in the
          // content library behind it.
          href={aiAuthoringUrl()}
          title={`Draft "${s.course}" in AI course authoring, from ${s.source}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: `${btn.smallPaddingY}px ${btn.smallPaddingX}px`,
            border: `1px solid ${color.primary}`,
            borderRadius: btn.radius,
            backgroundColor: color.primary,
            color: color.white,
            textDecoration: 'none',
            cursor: 'pointer',
            ...type.buttonSmall,
          }}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} style={{ width: 11, height: 11 }} />
          Draft course
        </a>
        <button
          type="button"
          style={{
            padding: `${btn.smallPaddingY}px ${btn.smallPaddingX}px`,
            border: `1px solid ${color.border}`,
            borderRadius: btn.radius,
            backgroundColor: color.white,
            color: color.primary,
            cursor: 'pointer',
            ...type.buttonSmall,
          }}
        >
          Link existing
        </button>
      </span>
    </span>
  );
}

/**
 * Mapping dialog — the duty's linked courses, and how to change them.
 *
 * Built on a native <dialog>, so the focus trap, Esc and background inertness
 * come from the platform rather than being re-implemented. Edits are held as a
 * draft and only applied on Save, so Cancel really cancels.
 */
function MappingDialog({
  duty,
  onClose,
  onSave,
}: {
  duty: Duty;
  onClose: () => void;
  onSave: (courses: QualifyingCourse[]) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<QualifyingCourse[]>(duty.courses);
  const [picked, setPicked] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
  }, []);

  const linkable = CATALOGUE.filter(c => !draft.some(d => d.name === c.name));

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={e => {
        if (e.target === ref.current) onClose();
      }}
      style={{
        width: dialog.widthM,
        maxWidth: '90vw',
        padding: 0,
        border: 'none',
        borderRadius: dialog.radius,
        backgroundColor: dialog.bg,
        boxShadow: dialog.shadow,
        color: color.text,
        fontFamily: type.body.fontFamily,
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 15,
          padding: `${dialog.titlebarPaddingY}px ${dialog.titlebarPaddingX}px`,
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ ...type.h4, color: color.text }}>Qualifying courses</span>
          <span style={{ ...type.captionRegular, color: color.textMuted }}>
            {duty.no}. {duty.name} · {duty.roles.join(' · ')}
          </span>
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: color.flatBaseText,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <FontAwesomeIcon icon={faXmark} style={{ width: icon.s, height: icon.s }} />
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          margin: `0 ${dialog.contentInset}px`,
          padding: dialog.contentInset,
          backgroundColor: dialog.contentBg,
          borderRadius: dialog.contentRadius,
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
        }}
      >
        <span style={{ ...type.bodyBold, color: color.text }}>
          {draft.length} linked {draft.length === 1 ? 'course' : 'courses'}
        </span>

        {draft.length === 0 ? (
          <span style={{ ...type.body, color: color.textMuted }}>
            Nothing linked yet — anyone delegated this task has nothing to complete.
          </span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {draft.map(c => (
              <div
                key={c.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: `1px solid ${color.borderSubtle}`,
                }}
              >
                <FontAwesomeIcon icon={faGraduationCap} style={{ width: icon.s, height: icon.s, color: color.iconFaint, flexShrink: 0 }} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '1 0 0', minWidth: 0 }}>
                  <span style={{ ...type.body, color: color.text }}>{c.name}</span>
                  {c.source && <span style={{ ...type.captionRegular, color: color.cellAdditionalText }}>{c.source}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => setDraft(list => list.filter(x => x.name !== c.name))}
                  style={{
                    padding: `${btn.smallPaddingY}px ${btn.smallPaddingX}px`,
                    border: `1px solid ${color.outlineError}`,
                    borderRadius: btn.radius,
                    backgroundColor: 'transparent',
                    color: color.outlineError,
                    cursor: 'pointer',
                    flexShrink: 0,
                    ...type.buttonSmall,
                  }}
                >
                  Unlink
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Link another */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select
            value={picked}
            onChange={e => setPicked(e.target.value)}
            style={{
              flex: '1 1 300px',
              minWidth: 0,
              height: 30,
              padding: '0 5px',
              backgroundColor: color.pageBg,
              border: 'none',
              borderBottom: `1px solid ${color.border}`,
              borderRadius: '5px 5px 0 0',
              outline: 'none',
              ...type.body,
              color: color.text,
            }}
          >
            <option value="">Link a course from the catalogue…</option>
            {linkable.map(c => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!picked}
            onClick={() => {
              const found = CATALOGUE.find(c => c.name === picked);
              if (!found) return;
              setDraft(list => [...list, found]);
              setPicked('');
            }}
            style={{
              padding: `${btn.mediumPaddingY}px ${btn.mediumPaddingX}px`,
              border: `1px solid ${picked ? color.primary : color.border}`,
              borderRadius: btn.radius,
              backgroundColor: picked ? color.primary : color.white,
              color: picked ? color.white : color.iconMuted,
              cursor: picked ? 'pointer' : 'default',
              ...type.button,
            }}
          >
            Link
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 15, padding: dialog.contentInset }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            minWidth: btn.mediumMinWidth,
            padding: `${btn.mediumPaddingY}px ${btn.mediumPaddingX}px`,
            border: `1px solid ${color.border}`,
            borderRadius: btn.radius,
            backgroundColor: color.white,
            color: color.primary,
            cursor: 'pointer',
            ...type.button,
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(draft)}
          style={{
            minWidth: btn.mediumMinWidth,
            padding: `${btn.mediumPaddingY}px ${btn.mediumPaddingX}px`,
            border: `1px solid ${color.primary}`,
            borderRadius: btn.radius,
            backgroundColor: color.primary,
            color: color.white,
            cursor: 'pointer',
            ...type.button,
          }}
        >
          Save mapping
        </button>
      </div>
    </dialog>
  );
}

function Row({ duty, onConfigure, readOnly }: { duty: Duty; onConfigure: () => void; readOnly: boolean }) {
  const [hover, setHover] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ backgroundColor: hover ? color.cellHoverBg : 'transparent', transition: 'background-color 100ms' }}
    >
      <td style={{ ...CELL, width: 45, minWidth: 45, paddingLeft: 15, paddingRight: 5, color: color.textMuted }}>{duty.no}</td>

      <td style={{ ...CELL, maxWidth: 240, whiteSpace: 'normal' }}>{duty.name}</td>

      <td style={{ ...CELL, maxWidth: 200, whiteSpace: 'normal' }}>
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {duty.roles.map(r => (
            <Chip key={r} label={r} theme="base" />
          ))}
        </span>
      </td>

      <td style={{ ...CELL, maxWidth: 320, whiteSpace: 'normal' }}>
        {duty.courses.length > 0 ? (
          // The count is the summary. At STUDY level it opens the mapping
          // dialog; at site level the mapping is not editable, so the chip is
          // just the reading — the tooltip still names the courses.
          readOnly ? (
            <span title={duty.courses.map(c => c.name).join(' · ')}>
              <Chip glyph={faGraduationCap} label={duty.courses.length} theme="info" />
            </span>
          ) : (
            <button
              type="button"
              onClick={onConfigure}
              title={duty.courses.map(c => c.name).join(' · ')}
              style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <Chip glyph={faGraduationCap} label={duty.courses.length} theme="info" />
            </button>
          )
        ) : readOnly ? (
          // Nothing qualifies this duty yet. The fix belongs to the study's
          // catalogue, not to this site, so the site simply shows nothing
          // rather than offering an action it should not own.
          null
        ) : (
          <SuggestionCell duty={duty} />
        )}
      </td>

      <td style={{ ...CELL, minWidth: 130 }}>
        <TrainedBar duty={duty} siteLevel={readOnly} />
      </td>

    </tr>
  );
}

export function DoaSection({ site }: { site?: string }) {
  // Duty → course mapping is a STUDY decision: one catalogue, one mapping,
  // applied everywhere. A site profile reads the result of it — which courses
  // qualify each delegated duty, and how far its people have got — so nothing
  // here edits the mapping.
  const readOnly = !!site;
  const [filter, setFilter] = useState<Coverage | null>(null);
  // The mapping is editable, so the duties live in state rather than being
  // read straight from the module.
  const [duties, setDuties] = useState<Duty[]>(() => (site ? doaForSite(site).duties : STUDY_DUTIES));
  const [configuring, setConfiguring] = useState<number | null>(null);

  const counts = useMemo(() => {
    const linked = duties.filter(d => d.courses.length > 0);
    return {
      total: duties.length,
      linked: linked.length,
      gap: duties.length - linked.length,
    };
  }, [duties]);

  const rows = filter ? duties.filter(d => coverageOf(d) === filter) : duties;
  const editing = readOnly ? null : (duties.find(d => d.no === configuring) ?? null);

  const toggle = (c: Coverage) => setFilter(f => (f === c ? null : c));

  return (
    <>
      {/* The three counts the matrix is answering for, each one a filter.
          They are about the MAPPING — how much of it is done, what is still
          unmapped — which is a study question. A site reads the result, so it
          gets the list alone. */}
      {!readOnly && (
        <div style={{ display: 'flex', gap: card.gap, flexShrink: 0 }}>
          <Tile label="Delegated duties" value={counts.total} glyph={faListCheck} active={filter === null} onClick={() => setFilter(null)} />
          <Tile label="Duties with a course" value={counts.linked} glyph={faGraduationCap} accent="green" active={filter === 'covered'} onClick={() => toggle('covered')} />
          <Tile label="Unmapped duties" value={counts.gap} glyph={faWandMagicSparkles} accent="purple" active={filter === 'gap'} onClick={() => toggle('gap')} />
        </div>
      )}

      <span style={{ ...type.bodyBold, color: color.text }}>
        {rows.length} {rows.length === 1 ? 'Duty' : 'Duties'}
        {filter && <span style={{ ...type.body, color: color.textMuted }}> · filtered by {COVERAGE_LABEL[filter].toLowerCase()}</span>}
      </span>

      <TableSurface>
        <div style={{ flex: '1 0 0', minHeight: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ ...HEAD, width: 45, minWidth: 45, paddingLeft: 15, paddingRight: 5 }}>#</th>
                <SortableHeader>Delegated duty</SortableHeader>
                <th style={HEAD}>Delegated roles</th>
                <th style={HEAD}>Qualifying courses</th>
                {/* At site level the number IS this site's people: how many of
                    the personnel carrying the duty have completed the courses
                    linked to it. At study level it reads across sites. */}
                <th
                  style={HEAD}
                  title={
                    readOnly
                      ? 'Site personnel enrolled in the courses linked to this task, and how many have completed them'
                      : 'How far the people delegated this duty have got with its courses'
                  }
                >
                  {readOnly ? 'Personnel Trained' : 'Sites Trained'}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(duty => (
                <Row key={duty.no} duty={duty} readOnly={readOnly} onConfigure={() => setConfiguring(duty.no)} />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={1} totalPages={1} pageSize={rows.length} totalItems={rows.length} onPage={() => {}} />
      </TableSurface>

      {editing && (
        <MappingDialog
          duty={editing}
          onClose={() => setConfiguring(null)}
          onSave={courses => {
            setDuties(list => list.map(d => (d.no === editing.no ? { ...d, courses } : d)));
            setConfiguring(null);
          }}
        />
      )}
    </>
  );
}

export default DoaSection;
