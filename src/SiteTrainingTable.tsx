import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBookOpen, faAddressCard, faUser, faUsers, faCircleInfo, faFileContract } from '@fortawesome/free-solid-svg-icons';
import { SITE_COURSES, SITE_PLANS, SiteTrainingRow, ReleaseStatus, RolesTarget, SITE_TRAINING_PAGE_SIZE } from './siteTrainingData';
import { linkedTasksForCourses, planCourseNames, type LibraryStatus, type Due } from './libraryData';
import type { SiteRow } from './sitesData';
import { doaForSite } from './doaData';
import { Checkbox, PartialCheckbox, HEAD, CELL, SortableHeader, Chip, CellLink, Pagination, TableSurface } from './tableKit';
import { color, type, table as t, status as st, icon } from './tokens';

// A site's Training Plans — what is mapped TO this site, listed either as the
// courses themselves or as the learning plans that bundle them. Same chrome as
// every other listing; the columns a site owner works from are the mapping's
// release state, who it targets, and when it is due.

export const SITE_TRAINING_VIEWS = ['Courses', 'Learning Plans'] as const;
export type SiteTrainingView = (typeof SITE_TRAINING_VIEWS)[number];

const STATUS_TONE: Record<LibraryStatus, string> = {
  published: color.statusSolidGreen,
  draft: color.statusSolidGrey,
};

const STATUS_LABEL: Record<LibraryStatus, string> = { published: 'Published', draft: 'Draft' };

function Status({ tone }: { tone: LibraryStatus }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        maxWidth: st.labelMaxWidth,
        padding: `0 ${st.paddingX}px`,
        borderRadius: st.radius,
        backgroundColor: STATUS_TONE[tone],
        color: color.text,
        ...type.status,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {STATUS_LABEL[tone]}
    </span>
  );
}

/**
 * Release Status is flat text, not a chip — it is the mapping's state, not the
 * item's. N/A carries the reason as a tooltip rather than a fourth colour.
 */
function Release({ state }: { state?: ReleaseStatus }) {
  if (!state) return null;
  if (state === 'na') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ ...type.body, color: color.textMuted }}>N/A</span>
        <FontAwesomeIcon
          icon={faCircleInfo}
          title="This course is assigned directly rather than released to the site, so it has no release state."
          tabIndex={0}
          style={{ width: icon.s, height: icon.s, color: color.primary, flexShrink: 0, cursor: 'help' }}
        />
      </span>
    );
  }
  const released = state === 'released';
  return (
    <span style={{ ...type.bodySemibold, color: released ? color.statusFlatGreen : color.statusFlatOrange, textTransform: 'uppercase' }}>
      {released ? 'Released' : 'Not Released'}
    </span>
  );
}

/** Roles — every role, a count of them, or one named role, as a Chip/Outline. */
function RolesCell({ roles }: { roles: RolesTarget }) {
  if (roles.kind === 'named') return <Chip glyph={faAddressCard} label={roles.name} />;
  const count = roles.kind === 'all' ? 'All' : roles.count;
  return <Chip glyph={faAddressCard} label={<>{count} <span style={type.body}>Roles</span></>} />;
}

/**
 * Linked task — the delegated duties this mapping qualifies someone for at
 * this site. One duty shows its name, several collapse to a counter, and
 * either opens the site's DOA log. Nothing linked leaves the cell empty: the
 * course is mapped here for a reason other than a delegated duty.
 */
function LinkedTaskCell({
  row,
  view,
  siteLabel,
  onOpenTasks,
}: {
  row: SiteTrainingRow;
  view: SiteTrainingView;
  siteLabel: string;
  onOpenTasks?: () => void;
}) {
  const names = view === 'Learning Plans' ? planCourseNames(row.id) : [row.name];
  // Resolved against THIS site's DOA log — a course can qualify a duty at one
  // site and no duty at another, because each site delegates its own.
  const tasks = linkedTasksForCourses(names, doaForSite(siteLabel).duties);

  if (tasks.length === 0) return null;

  const title = tasks.map(d => `${d.no}. ${d.name}`).join(' · ');

  if (tasks.length === 1) {
    return (
      <span title={title} style={{ display: 'inline-flex', minWidth: 0 }} onClick={onOpenTasks}>
        <CellLink glyph={faFileContract} label={tasks[0].name} />
      </span>
    );
  }

  return (
    <button type="button" onClick={onOpenTasks} title={title} style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}>
      <Chip glyph={faFileContract} label={tasks.length} theme="info" />
    </button>
  );
}

/** The due value with the rule that produced it stacked underneath. */
function DueCell({ due }: { due: Due }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
      <span style={{ ...type.bodySemibold, color: color.text }}>{due.value}</span>
      {due.rule && <span style={{ ...type.captionRegular, color: color.cellAdditionalText }}>{due.rule}</span>}
    </span>
  );
}

function Row({
  row,
  view,
  checked,
  onCheck,
  siteLabel,
  onOpenTasks,
}: {
  row: SiteTrainingRow;
  view: SiteTrainingView;
  siteLabel: string;
  checked: boolean;
  onCheck: (v: boolean) => void;
  onOpenTasks?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const bg = checked ? color.cellSelectedBg : hover ? color.cellHoverBg : 'transparent';

  return (
    <tr
      aria-selected={checked}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ backgroundColor: bg, transition: 'background-color 100ms' }}
    >
      <td style={{ ...CELL, width: t.colCheckbox, minWidth: t.colCheckbox, paddingLeft: 10, paddingRight: 5 }}>
        <Checkbox checked={checked} onChange={onCheck} />
      </td>

      <td style={{ ...CELL, maxWidth: 300 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: t.gap, minWidth: 0 }}>
          <CellLink glyph={view === 'Courses' ? faGraduationCap : faBookOpen} label={row.name} />
          {/* Marked Not Applicable at this site. Said outright rather than by
              dimming the row: a faded row reads as "loading" or "you may not
              touch this", and this one is fully actionable — it is exactly the
              row someone selects to revert. */}
          {row.notApplicable && (
            <span
              title="Marked Not Applicable at this site — select it and use Revert to Applicable to undo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: `0 ${st.paddingX}px`,
                borderRadius: st.radius,
                backgroundColor: color.statusSolidGrey,
                color: color.textMuted,
                ...type.status,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Not Applicable
            </span>
          )}
        </span>
      </td>

      <td style={CELL}>
        <Status tone={row.status} />
      </td>

      <td style={{ ...CELL, minWidth: 120 }}>
        <Release state={row.release} />
      </td>

      <td style={{ ...CELL, maxWidth: 70 }}>{row.version}</td>

      <td style={{ ...CELL, minWidth: 130 }}>
        <RolesCell roles={row.roles} />
      </td>

      {view === 'Learning Plans' && (
        <td style={CELL}>{!!row.courses && <Chip glyph={faGraduationCap} label={row.courses} theme="info" />}</td>
      )}

      <td style={CELL}>{!!row.groups && <Chip glyph={faUsers} label={row.groups} theme="info" />}</td>

      <td style={CELL}>{!!row.users && <Chip glyph={faUser} label={row.users} theme="info" />}</td>

      <td style={{ ...CELL, maxWidth: 240 }}>
        <LinkedTaskCell row={row} view={view} siteLabel={siteLabel} onOpenTasks={onOpenTasks} />
      </td>

      <td style={CELL}>
        <DueCell due={row.due} />
      </td>
    </tr>
  );
}

export function SiteTrainingTable({
  view,
  site,
  onSelectionChange,
  onOpenTasks,
}: {
  view: SiteTrainingView;
  /** The totals come from the site's own row, so the Sites grid cannot disagree. */
  site: SiteRow;
  onSelectionChange?: (n: number) => void;
  /** Opening a linked duty switches the site profile to its DOA log. */
  onOpenTasks?: () => void;
}) {
  const rows = view === 'Courses' ? SITE_COURSES : SITE_PLANS;
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  const total = view === 'Courses' ? site.courses : (site.learningPlans ?? SITE_PLANS.length);
  const totalPages = Math.max(1, Math.ceil(total / SITE_TRAINING_PAGE_SIZE));

  const allChecked = rows.every(r => selected.has(r.id));
  const someChecked = rows.some(r => selected.has(r.id)) && !allChecked;

  const commit = (next: Set<number>) => {
    setSelected(next);
    onSelectionChange?.(next.size);
  };

  const toggleAll = (v: boolean) => commit(v ? new Set(rows.map(r => r.id)) : new Set());
  const toggleOne = (id: number, v: boolean) => {
    const next = new Set(selected);
    if (v) next.add(id);
    else next.delete(id);
    commit(next);
  };

  return (
    <TableSurface>
      <div style={{ flex: '1 0 0', minHeight: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ ...HEAD, width: t.colCheckbox, minWidth: t.colCheckbox, paddingLeft: 10, paddingRight: 5 }}>
                {someChecked ? <PartialCheckbox onChange={toggleAll} /> : <Checkbox checked={allChecked} onChange={toggleAll} />}
              </th>
              <SortableHeader>{view === 'Courses' ? 'Course Name' : 'Learning Plan Name'}</SortableHeader>
              <th style={HEAD}>Status</th>
              <th style={HEAD}>Release Status</th>
              <th style={HEAD}>Version</th>
              <th style={HEAD}>Roles</th>
              {view === 'Learning Plans' && <th style={HEAD}>Courses</th>}
              <th style={HEAD}>Groups</th>
              <th style={HEAD}>Users</th>
              <th style={HEAD}>Linked task</th>
              <th style={HEAD}>Due</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <Row
                key={row.id}
                row={row}
                view={view}
                checked={selected.has(row.id)}
                onCheck={v => toggleOne(row.id, v)}
                siteLabel={site.name}
                onOpenTasks={onOpenTasks}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} pageSize={SITE_TRAINING_PAGE_SIZE} totalItems={total} onPage={setPage} />
    </TableSurface>
  );
}

export default SiteTrainingTable;
