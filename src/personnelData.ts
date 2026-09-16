// Site Personnel — everyone with access to one site, not only the people the
// DOA log delegates to.
//
// The first nine ARE those delegated people, kept in step with doa-log's TEAM
// and the signed log's task codes, so the three prototypes agree on who works
// at 0982 - Miles, H. The rest are the site's other users — monitors, data
// managers, regulatory staff — who hold training without carrying a delegated
// duty. That is why this list is longer than the DOA matrix.

export type UserStatus = 'active' | 'inactive' | 'pending';

/**
 * A training gap: a duty this person is delegated on the site's DOA log whose
 * qualifying course they are not enrolled in — or are enrolled in and late for.
 *
 * The two are different problems and are kept apart on purpose. "Not enrolled"
 * means nobody has assigned them the course, which is an assignment failure;
 * "overdue" means they have it and have not done it, which is theirs. Merging
 * them into one "incomplete" number hides who has to act.
 */
export interface TrainingGap {
  duty: string;
  course: string;
  kind: 'not-enrolled' | 'overdue';
  /** For an overdue enrolment, when it was due. */
  due?: string;
}

export interface Person {
  id: number;
  name: string;
  email: string;
  status: string;
  statusTone: UserStatus;
  /** Marks the site's coordinator, shown as a caption under their name. */
  siteCoordinator?: boolean;
  /** One named role, or a count when the person holds several at this site. */
  siteRole?: string;
  siteRoleCount?: number;
  /** The several, named — what a profile needs to work out what they carry. */
  siteRoles?: string[];
  /** Same shape: "Learner", or a count of roles held. */
  userRole?: string;
  userRoleCount?: number;
  /** Training completed / assigned, and the percent the bar draws. */
  completed: number;
  assigned: number;
  percent: number;
  courses: number;
  learningPlans?: number;
  /**
   * Delegated duties whose course this person has not completed. Kept in step
   * with doa-log's cross-module check, which reports the same gaps from the
   * document side.
   */
  gaps?: TrainingGap[];
  /**
   * Set when the DOA log's name could not be resolved to exactly one contact —
   * the ambiguity the eTMF check reports, surfaced here as a person whose
   * training cannot be verified.
   */
  unresolved?: boolean;
}

export const PERSONNEL: Person[] = [
  {
    id: 1, name: 'Dr. Helena Miles', email: 'h.miles@site0982.example', status: 'Active', statusTone: 'active',
    siteRole: 'Principal Investigator', userRoleCount: 2, completed: 21, assigned: 21, percent: 100, courses: 22, learningPlans: 3,
  },
  {
    id: 2, name: 'Jacob Jones', email: 'j.jones@site0982.example', status: 'Active', statusTone: 'active',
    siteCoordinator: true, siteRoleCount: 2, siteRoles: ['Study Coordinator', 'Data Entry'],
    userRoleCount: 2, completed: 11, assigned: 14, percent: 79, courses: 11, learningPlans: 3,
  },
  {
    id: 3, name: 'Dr. Elena Ruiz', email: 'e.ruiz@site0982.example', status: 'Active', statusTone: 'active',
    siteRole: 'Sub-Investigator', userRole: 'Learner', completed: 9, assigned: 14, percent: 64, courses: 14, learningPlans: 2,
    gaps: [
      { duty: 'Eligibility assessment', course: 'Protocol Training — Eligibility Criteria & Assessment', kind: 'not-enrolled' },
      { duty: 'AE / SAE assessment and reporting', course: 'Safety Reporting — AE, SAE and Causality', kind: 'not-enrolled' },
    ],
  },
  {
    id: 4, name: 'Javier Moreno', email: 'j.moreno@site0982.example', status: 'Active', statusTone: 'active',
    siteRole: 'Study Coordinator', userRoleCount: 2, completed: 18, assigned: 18, percent: 100, courses: 18,
  },
  {
    id: 5, name: 'Lucía Ferrer', email: 'l.ferrer@site0982.example', status: 'Active', statusTone: 'active',
    siteRole: 'Study Coordinator', userRole: 'Learner', completed: 12, assigned: 16, percent: 75, courses: 16, learningPlans: 2,
  },
  {
    id: 6, name: 'Dr. Andrés Gil', email: 'a.gil@site0982.example', status: 'Active', statusTone: 'active',
    siteRole: 'Sub-Investigator', userRole: 'Learner', completed: 13, assigned: 13, percent: 100, courses: 13,
  },
  {
    id: 7, name: 'Carmen Ortega', email: 'c.ortega@site0982.example', status: 'Active', statusTone: 'active',
    siteRole: 'Research Nurse', userRole: 'Learner', completed: 5, assigned: 9, percent: 56, courses: 9, learningPlans: 2,
    gaps: [{ duty: 'Biological sample handling', course: 'Sample Handling & Processing', kind: 'overdue', due: '15 Jan 2026' }],
  },
  {
    id: 8, name: 'A. Delgado', email: '—', status: 'Pending', statusTone: 'pending',
    siteRole: 'Research Nurse', userRole: 'Learner', completed: 0, assigned: 0, percent: 0, courses: 0, unresolved: true,
  },
  {
    id: 9, name: 'Pablo Navarro', email: 'p.navarro@site0982.example', status: 'Active', statusTone: 'active',
    siteRole: 'Pharmacist', userRoleCount: 2, completed: 7, assigned: 8, percent: 88, courses: 8,
    gaps: [
      { duty: 'IP accountability & dispensing', course: 'Investigational Product Handling & Accountability', kind: 'not-enrolled' },
      { duty: 'Randomisation & unblinding', course: 'IWRS — Randomisation and Emergency Unblinding', kind: 'overdue', due: '20 Feb 2026' },
    ],
  },
  {
    id: 10, name: 'Sofía Márquez', email: 's.marquez@site0982.example', status: 'Active', statusTone: 'active',
    siteRole: 'Data Entry', userRole: 'Learner', completed: 4, assigned: 6, percent: 67, courses: 6, learningPlans: 1,
  },
];

/** Delegated duties whose course nobody has assigned to the person yet. */
export const notEnrolled = (p: Person) => (p.gaps ?? []).filter(g => g.kind === 'not-enrolled');

/** People carrying a duty they have not been enrolled for — the assignment gap. */
export const PEOPLE_NOT_ENROLLED = PERSONNEL.filter(p => notEnrolled(p).length > 0).length;

/**
 * One gap, flattened for listing: who, where, which delegated task, and the
 * course they are missing. It carries its own name and role rather than a
 * Person, because the study's list spans sites whose rosters are not loaded
 * here — only the people with a gap are.
 */
export interface GapRow {
  site: string;
  name: string;
  siteRole: string;
  duty: string;
  course: string;
  kind: TrainingGap['kind'];
  due?: string;
}

/** The site this module's roster belongs to. */
export const HOME_SITE = '0982 - Miles, H';

/** A missing enrolment is somebody's job today; an overdue one is a learner
 *  being chased. Sorting by kind puts the actionable at the top. */
const byKind = (a: GapRow, b: GapRow) => (a.kind === b.kind ? 0 : a.kind === 'not-enrolled' ? -1 : 1);

export const GAP_ROWS: GapRow[] = PERSONNEL.flatMap(person =>
  (person.gaps ?? []).map(g => ({
    site: HOME_SITE,
    name: person.name,
    siteRole: person.siteRole ?? `${person.siteRoleCount ?? 0} roles`,
    duty: g.duty,
    course: g.course,
    kind: g.kind,
    due: g.due,
  })),
).sort(byKind);

/**
 * The other sites' gaps. Only the people WITH one are listed — those sites'
 * full rosters live at their own site profile, not here. The counts match
 * doaData's per-duty `notEnrolled` exactly, so the tasks grid, the sites grid
 * and this list cannot disagree.
 */
const OTHER_SITE_GAPS: GapRow[] = [
  {
    site: '1643 - Hwang, S',
    name: 'Dr. Min-Ho Park',
    siteRole: 'Sub-Investigator',
    duty: 'Eligibility assessment',
    course: 'Protocol Training — Eligibility Criteria & Assessment',
    kind: 'not-enrolled',
  },
  {
    site: '1643 - Hwang, S',
    name: 'Dr. Soo-Jin Hwang',
    siteRole: 'Principal Investigator',
    duty: 'Eligibility assessment',
    course: 'Protocol Training — Eligibility Criteria & Assessment',
    kind: 'not-enrolled',
  },
  {
    site: '2208 - Rivera, C',
    name: 'Marta Quintero',
    siteRole: 'Study Coordinator',
    duty: 'Obtaining informed consent',
    course: 'Informed Consent Process — ICH GCP E6(R3)',
    kind: 'not-enrolled',
  },
];

/** Every gap the study holds, across the sites that have a signed log. */
export const STUDY_GAP_ROWS: GapRow[] = [...GAP_ROWS, ...OTHER_SITE_GAPS].sort(byKind);

/** A gap's identity — who, where and which task. */
export const gapKey = (r: GapRow) => `${r.site}|${r.name}|${r.duty}`;

/**
 * The list for wherever it is opened: one site's, or the whole study's, minus
 * the gaps already closed. Enrolling someone CLOSES the gap — that is the
 * whole action — so the list, the counters and the banners all read from here
 * and cannot go on claiming a gap that was just fixed.
 */
export const gapRowsFor = (site?: string, closed?: Set<string>) =>
  STUDY_GAP_ROWS.filter(r => (!site || r.site === site) && !closed?.has(gapKey(r)));

/** People with no enrolment for a task they carry — by site, and study-wide. */
export const peopleNotEnrolled = (site?: string, closed?: Set<string>) =>
  new Set(gapRowsFor(site, closed).filter(r => r.kind === 'not-enrolled').map(r => `${r.site}|${r.name}`)).size;

/** How many sites the study's open gaps are spread over — the banner says where. */
export const sitesWithGaps = (closed?: Set<string>) =>
  new Set(gapRowsFor(undefined, closed).filter(r => r.kind === 'not-enrolled').map(r => r.site)).size;

/** People whose DOA name could not be resolved — verifiable only by hand. */
export const UNRESOLVED = PERSONNEL.filter(p => p.unresolved);

/**
 * The same gap read from the DUTY's side: who this site's log delegates this
 * task to without anyone enrolling them in the course that qualifies it.
 *
 * The person's side answers "what is this user missing"; this answers "who is
 * covering this task untrained", which is the question the log itself raises
 * — so the Delegated Tasks grid can state it where the delegation is recorded.
 */
export function notEnrolledFor(duty: string): { person: Person; course: string }[] {
  return PERSONNEL.flatMap(person => notEnrolled(person).filter(g => g.duty === duty).map(g => ({ person, course: g.course })));
}

/** The site's full roster — only the first page of it is real data. */
export const PERSONNEL_COUNT = 14;
export const PERSONNEL_PAGE_SIZE = 10;
export const PERSONNEL_PAGES = 2;
