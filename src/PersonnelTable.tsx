import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAddressCard, faGraduationCap, faBookOpen, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { PERSONNEL, Person, UserStatus, PERSONNEL_COUNT, PERSONNEL_PAGE_SIZE, PERSONNEL_PAGES } from './personnelData';
import { Checkbox, PartialCheckbox, HEAD, CELL, SortableHeader, Chip, CellLink, Pagination, TableSurface } from './tableKit';
import { color, type, table as t, status as st, progressBar as pb, icon } from './tokens';

// Site Personnel — everyone with access to the site. Same table chrome as
// every other listing here; the columns are the ones a site's training owner
// works from: who they are, what role they hold at the site and in the system,
// how far their training has got, and what they are enrolled in.

const STATUS_TONE: Record<UserStatus, string> = {
  active: color.statusSolidGreen,
  pending: color.statusOrange,
  inactive: color.statusSolidGrey,
};

function Status({ label, tone }: { label: string; tone: UserStatus }) {
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
      {label}
    </span>
  );
}

/**
 * Role — one named role reads as plain text; several collapse to a counter
 * chip rather than crowding the cell with a list.
 */
function RoleCell({ name, count, glyph }: { name?: string; count?: number; glyph?: typeof faAddressCard }) {
  if (name) return <span style={{ ...type.body, color: color.text }}>{name}</span>;
  if (count != null) return <Chip glyph={glyph} label={count} theme="info" />;
  return null;
}

/**
 * progress-bar/small with its two readings under it — "11 of 14" on the left,
 * the percent on the right. A person with nothing assigned gets no bar; a 0%
 * one would claim they are behind rather than simply unenrolled.
 */
function TrainingProgress({ person }: { person: Person }) {
  if (person.assigned === 0) return null;
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 130 }}>
      <span style={{ height: pb.height, borderRadius: pb.radius, backgroundColor: color.progressTrack, overflow: 'hidden' }}>
        <span
          style={{
            display: 'block',
            width: `${person.percent}%`,
            height: '100%',
            borderRadius: pb.radius,
            backgroundColor: color.primary,
          }}
        />
      </span>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ ...type.captionRegular, color: color.text }}>
          {person.completed} of {person.assigned}
        </span>
        <span style={{ ...type.captionRegular, color: color.text }}>{person.percent}%</span>
      </span>
    </span>
  );
}

function Row({
  row,
  checked,
  onCheck,
  marked,
  onOpen,
}: {
  row: Person;
  checked: boolean;
  onCheck: (v: boolean) => void;
  marked?: boolean;
  onOpen?: (person: Person) => void;
}) {
  const [hover, setHover] = useState(false);
  // Arriving from a training gap, the person you followed is marked so the
  // list opens on them rather than on a page of names to search.
  const bg = checked || marked ? color.cellSelectedBg : hover ? color.cellHoverBg : 'transparent';

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

      <td style={{ ...CELL, maxWidth: 220 }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, minWidth: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: t.gap, minWidth: 0 }}>
            <CellLink glyph={faUser} label={row.name} onClick={() => onOpen?.(row)} />
            {/* The eTMF check could not resolve this name to one contact */}
            {row.unresolved && (
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                title="This name on the DOA log matches more than one contact, so their training cannot be checked"
                style={{ width: icon.s, height: icon.s, color: color.outlineWarningBorder, flexShrink: 0 }}
              />
            )}
          </span>
          {row.siteCoordinator && (
            <span style={{ ...type.captionRegular, color: color.textMuted, textTransform: 'uppercase' }}>Site Coordinator</span>
          )}
        </span>
      </td>

      <td style={{ ...CELL, maxWidth: 220 }}>
        <span style={{ ...type.body, color: row.email === '—' ? color.iconFaint : color.textMuted }}>{row.email}</span>
      </td>

      <td style={CELL}>
        <Status label={row.status} tone={row.statusTone} />
      </td>

      <td style={{ ...CELL, maxWidth: 200 }}>
        <RoleCell name={row.siteRole} count={row.siteRoleCount} />
      </td>

      <td style={CELL}>
        <RoleCell name={row.userRole} count={row.userRoleCount} glyph={faAddressCard} />
      </td>

      <td style={{ ...CELL, minWidth: 150 }}>
        <TrainingProgress person={row} />
      </td>

      <td style={CELL}>{!!row.courses && <Chip glyph={faGraduationCap} label={row.courses} theme="info" />}</td>

      <td style={CELL}>{!!row.learningPlans && <Chip glyph={faBookOpen} label={row.learningPlans} theme="info" />}</td>
    </tr>
  );
}

export function PersonnelTable({
  onSelectionChange,
  marked,
  onOpenUser,
}: {
  onSelectionChange?: (n: number) => void;
  marked?: string | null;
  /** The name is the way into the person's own profile. */
  onOpenUser?: (person: Person) => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  const allChecked = selected.size === PERSONNEL.length;
  const someChecked = selected.size > 0 && !allChecked;

  const commit = (next: Set<number>) => {
    setSelected(next);
    onSelectionChange?.(next.size);
  };

  const toggleAll = (v: boolean) => commit(v ? new Set(PERSONNEL.map(p => p.id)) : new Set());
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
              <SortableHeader>User</SortableHeader>
              <th style={HEAD}>Email</th>
              <th style={HEAD}>User Status</th>
              <th style={HEAD}>Site Role</th>
              <th style={HEAD}>User Role</th>
              <th style={HEAD}>Training Progress</th>
              <th style={HEAD}>Courses</th>
              <th style={HEAD}>Learning Plans</th>
            </tr>
          </thead>
          <tbody>
            {PERSONNEL.map(row => (
              <Row
                key={row.id}
                row={row}
                checked={selected.has(row.id)}
                marked={row.name === marked}
                onCheck={v => toggleOne(row.id, v)}
                onOpen={onOpenUser}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={PERSONNEL_PAGES} pageSize={PERSONNEL_PAGE_SIZE} totalItems={PERSONNEL_COUNT} onPage={setPage} />
    </TableSurface>
  );
}

export default PersonnelTable;
