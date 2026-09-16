import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import type { SiteRow } from './sitesData';
import { Dashlet, Field } from './dashlet';
import { HEAD, CELL, CellLink } from './tableKit';
import { color, type, table as t, status as st, icon } from './tokens';

// The site's General Info — two dashlets, built with doa-log's panel chrome:
// a white surface on table/radius with a borderSubtle rule, a Body/Bold count
// above a list, table/cell metrics for the rows, and the green
// `confirmation` check it uses to mark something satisfied.

const STATUS_BG: Record<SiteRow['statusTone'], string> = {
  pending: color.statusOrange,
  ready: color.statusSolidGreen,
  active: color.statusSolidBlue,
};

/** An info-circle carrying its note as a tooltip. */
function InfoHint({ note }: { note: string }) {
  return (
    <FontAwesomeIcon
      icon={faCircleInfo}
      title={note}
      tabIndex={0}
      style={{ width: icon.s, height: icon.s, color: color.primary, flexShrink: 0, cursor: 'help' }}
    />
  );
}

/** Whether a coordinator holds one of the training permissions. */
function Granted({ on }: { on: boolean }) {
  return on ? (
    <FontAwesomeIcon icon={faCircleCheck} style={{ width: icon.m, height: icon.m, color: color.confirmation }} />
  ) : null;
}

interface Coordinator {
  name: string;
  email: string;
  /** Full sees every site's training; Scoped only the sites assigned to them. */
  scope: 'Full' | 'Scoped';
  viewAssignedSite: boolean;
  assignCourses: boolean;
  createCourse: boolean;
  certificateEmails: boolean;
  viewCertificate: boolean;
  viewTranscript: boolean;
}

/** The pool the extra, unnamed coordinators on a site are drawn from. */
const COORDINATOR_POOL = ['Bessie Cooper', 'Kristin Watson', 'Devon Lane', 'Courtney Henry', 'Jerome Bell'];

const emailOf = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`;

/**
 * A site's coordinators, derived from the row the Sites listing shows — a site
 * with a named coordinator has that one, a site with a count has that many —
 * so the two views cannot disagree about how many there are.
 */
function coordinatorsOf(site: SiteRow): Coordinator[] {
  const count = site.coordinator ? 1 : (site.coordinatorCount ?? 0);
  const names = site.coordinator ? [site.coordinator] : COORDINATOR_POOL.slice(0, count);

  return names.map((name, i) => ({
    name,
    email: emailOf(name),
    // The first coordinator runs the site's training; the rest are scoped to it.
    scope: i === 0 ? 'Full' : 'Scoped',
    viewAssignedSite: true,
    assignCourses: true,
    createCourse: i === 0,
    certificateEmails: true,
    viewCertificate: true,
    viewTranscript: i === 0,
  }));
}

export function SiteGeneralInfo({ site }: { site: SiteRow }) {
  // "0982 - Miles, H" — the number leads the label, the PI follows it.
  const [number, ...rest] = site.name.split(' - ');
  const siteName = rest.join(' - ') || site.name;
  const coordinators = coordinatorsOf(site);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15, minHeight: 0, overflowY: 'auto' }}>
      <Dashlet title="General Info">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 15, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px', minWidth: 220 }}>
            <Field label="Site Name" value={siteName} />
          </div>
          <Field label="Site Number" value={number} width={110} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: '1 1 260px', minWidth: 200 }}>
            <span style={{ ...type.captionRegular, color: color.textMuted }}>Status</span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: t.gap,
                height: 30,
                padding: '0 8px',
                backgroundColor: color.pageBg,
                borderBottom: `1px solid ${color.border}`,
                borderRadius: '5px 5px 0 0',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  maxWidth: st.labelMaxWidth,
                  padding: `0 ${st.paddingX}px`,
                  borderRadius: st.radius,
                  backgroundColor: STATUS_BG[site.statusTone],
                  color: color.text,
                  ...type.status,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {site.status}
              </span>
              <span style={{ marginLeft: 'auto' }}>
                <InfoHint note="Site status is relevant and updated only within a specific study." />
              </span>
            </span>
          </div>
        </div>
      </Dashlet>

      <Dashlet title="Site Coordinators">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ ...type.bodyBold, color: color.text }}>
            {coordinators.length} {coordinators.length === 1 ? 'Site Coordinator' : 'Site Coordinators'}
          </span>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
              <thead>
                <tr>
                  <th style={{ ...HEAD, paddingLeft: 0 }}>User</th>
                  <th style={HEAD}>Email</th>
                  <th style={HEAD}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      Training Visibility Scope
                      <InfoHint note="Full sees training across every site; Scoped sees only the sites assigned to them." />
                    </span>
                  </th>
                  <th style={{ ...HEAD, textAlign: 'center' }}>View Assigned Site</th>
                  <th style={{ ...HEAD, textAlign: 'center' }}>Assign Courses</th>
                  <th style={{ ...HEAD, textAlign: 'center' }}>Create Course</th>
                  <th style={{ ...HEAD, textAlign: 'center' }}>Receive Certificate Emails</th>
                  <th style={{ ...HEAD, textAlign: 'center' }}>View Certificate</th>
                  <th style={{ ...HEAD, textAlign: 'center' }}>View Transcript</th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map(c => (
                  <CoordinatorRow key={c.name} c={c} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Dashlet>
    </div>
  );
}

function CoordinatorRow({ c }: { c: Coordinator }) {
  const [hover, setHover] = useState(false);
  const cell = { ...CELL, textAlign: 'center' as const };

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ backgroundColor: hover ? color.cellHoverBg : 'transparent', transition: 'background-color 100ms' }}
    >
      <td style={{ ...CELL, paddingLeft: 0, maxWidth: 200 }}>
        <CellLink glyph={faUser} label={c.name} />
      </td>
      <td style={{ ...CELL, maxWidth: 220 }}>
        <span style={{ ...type.body, color: color.textMuted }}>{c.email}</span>
      </td>
      <td style={CELL}>{c.scope}</td>
      <td style={cell}><Granted on={c.viewAssignedSite} /></td>
      <td style={cell}><Granted on={c.assignCourses} /></td>
      <td style={cell}><Granted on={c.createCourse} /></td>
      <td style={cell}><Granted on={c.certificateEmails} /></td>
      <td style={cell}><Granted on={c.viewCertificate} /></td>
      <td style={cell}><Granted on={c.viewTranscript} /></td>
    </tr>
  );
}

export default SiteGeneralInfo;
