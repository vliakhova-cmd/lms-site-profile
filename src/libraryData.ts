import { STUDY_DUTIES, type Duty } from './doaData';

// The Training Library — the study's catalogue, listed two ways: the courses
// themselves, and the Learning Plans that bundle them.
//
// Course names are deliberately the SAME strings the DOA section maps duties
// to (doaData's CATALOGUE), so the "Linked task" column is a real join rather
// than a second set of made-up labels: a course here shows which delegated
// duties it qualifies someone for.

/** Published/Draft — the two states a catalogue item is listed in. */
export type LibraryStatus = 'published' | 'draft';

/**
 * Site & Roles reads as a pair of chips — "All Sites AND 3 Roles" — unless the
 * item is assigned differently per site, which the grid collapses to one
 * "Mixed Values" chip rather than listing every combination.
 */
export type Assignment = { kind: 'none' } | { kind: 'mixed' } | { kind: 'pair'; sites: 'All' | number; roles: 'All' | number };

/** Due is a value with the rule that produced it stacked underneath. */
export interface Due {
  value: string;
  rule?: 'Max Date' | 'Max Days';
}

export interface LibraryItem {
  id: number;
  name: string;
  status: LibraryStatus;
  version: string;
  assignment: Assignment;
  /** Training groups it is assigned through; absent when there are none. */
  groups?: number;
  users: number;
  due: Due;
  /** Courses inside a Learning Plan — not set on a course row. */
  courses?: number;
}

export const LIBRARY_COURSES: LibraryItem[] = [
  {
    id: 1,
    name: 'Informed Consent Process — ICH GCP E6(R3)',
    status: 'published',
    version: '2.0',
    assignment: { kind: 'pair', sites: 'All', roles: 'All' },
    users: 39,
    due: { value: '12 May 2026', rule: 'Max Date' },
  },
  {
    id: 2,
    name: 'ICF v4.0 — Study-Specific Consent Walkthrough',
    status: 'published',
    version: '1.0',
    assignment: { kind: 'mixed' },
    groups: 2,
    users: 38,
    due: { value: '28 Apr 2026', rule: 'Max Date' },
  },
  {
    id: 3,
    name: 'Protocol Training — Eligibility Criteria & Assessment',
    status: 'draft',
    version: '2.0',
    // Reaches every site, so its rule folds into one "All Sites" row.
    assignment: { kind: 'none' },
    users: 0,
    due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 4,
    name: 'Investigational Product Handling & Accountability',
    status: 'draft',
    version: '1.0',
    assignment: { kind: 'pair', sites: 'All', roles: 3 },
    groups: 3,
    users: 45,
    due: { value: 'No Due Date' },
  },
  {
    id: 5,
    name: 'IWRS — Randomisation and Emergency Unblinding',
    status: 'draft',
    version: '2.0',
    // Authored but never scoped — nobody has said who randomises.
    assignment: { kind: 'none' },
    users: 0,
    due: { value: '5 Days', rule: 'Max Days' },
  },
  {
    id: 6,
    name: 'Sample Handling & Processing',
    status: 'draft',
    version: '1.0',
    assignment: { kind: 'none' },
    users: 0,
    due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 7,
    name: 'Safety Reporting — AE, SAE and Causality',
    status: 'published',
    version: '1.0',
    assignment: { kind: 'pair', sites: 'All', roles: 3 },
    groups: 2,
    users: 49,
    due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 8,
    name: 'GCP Refresher 2026',
    status: 'published',
    version: '2.0',
    assignment: { kind: 'mixed' },
    users: 27,
    due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 9,
    name: 'Protocol Amendment 3 — What Changed',
    status: 'published',
    version: '2.0',
    assignment: { kind: 'mixed' },
    groups: 2,
    users: 9,
    due: { value: '10 Days', rule: 'Max Days' },
  },
  {
    id: 11,
    name: 'IP Handling at Site 2208 — Local Pharmacy Addendum',
    status: 'draft',
    version: '1.0',
    // Nothing assigned yet — the suggestion is what works out who it reaches.
    assignment: { kind: 'none' },
    users: 0,
    due: { value: 'No Due Date' },
  },
  {
    id: 10,
    name: 'Investigator Oversight & Delegation',
    status: 'published',
    version: '1.0',
    assignment: { kind: 'pair', sites: 'All', roles: 2 },
    users: 12,
    due: { value: '21 Jun 2026', rule: 'Max Date' },
  },
];

export const LEARNING_PLANS: LibraryItem[] = [
  {
    id: 101,
    name: 'Investigator Onboarding — Bivivid',
    status: 'published',
    version: '3.0',
    assignment: { kind: 'pair', sites: 'All', roles: 2 },
    groups: 2,
    users: 18,
    courses: 6,
    due: { value: '30 Days', rule: 'Max Days' },
  },
  {
    id: 102,
    name: 'Coordinator Core Curriculum',
    status: 'published',
    version: '2.0',
    assignment: { kind: 'pair', sites: 'All', roles: 'All' },
    users: 24,
    courses: 8,
    due: { value: '12 May 2026', rule: 'Max Date' },
  },
  {
    id: 103,
    name: 'Pharmacy & IP Handling',
    status: 'published',
    version: '1.0',
    assignment: { kind: 'pair', sites: 3, roles: 2 },
    users: 7,
    courses: 4,
    due: { value: '28 Apr 2026', rule: 'Max Date' },
  },
  {
    id: 104,
    name: 'Laboratory & Sample Management',
    status: 'draft',
    version: '1.0',
    assignment: { kind: 'mixed' },
    groups: 2,
    users: 11,
    courses: 3,
    due: { value: 'No Due Date' },
  },
  {
    id: 105,
    name: 'Amendment 3 Re-Training',
    status: 'draft',
    version: '1.0',
    assignment: { kind: 'pair', sites: 'All', roles: 'All' },
    users: 45,
    courses: 2,
    due: { value: '14 Days', rule: 'Max Days' },
  },
  {
    id: 106,
    name: 'Safety & Pharmacovigilance',
    status: 'published',
    version: '2.0',
    assignment: { kind: 'pair', sites: 'All', roles: 3 },
    groups: 3,
    users: 29,
    courses: 5,
    due: { value: '3 May 2026', rule: 'Max Date' },
  },
];

/** The Learning Plans a course belongs to — used for the plans' own task join. */
const PLAN_COURSES: Record<number, string[]> = {
  101: ['Informed Consent Process — ICH GCP E6(R3)', 'Investigator Oversight & Delegation', 'Safety Reporting — AE, SAE and Causality'],
  102: ['Informed Consent Process — ICH GCP E6(R3)', 'ICF v4.0 — Study-Specific Consent Walkthrough', 'Sample Handling & Processing'],
  103: ['Investigational Product Handling & Accountability', 'IWRS — Randomisation and Emergency Unblinding'],
  104: ['Sample Handling & Processing'],
  105: ['Protocol Amendment 3 — What Changed'],
  106: ['Safety Reporting — AE, SAE and Causality'],
};

/** A delegated duty a catalogue item qualifies someone for. */
export interface LinkedTask {
  no: number;
  name: string;
}

/**
 * The join back to Delegated Tasks: a course is linked to every duty whose
 * qualifying courses name it. Read from the module's DUTIES, so it reflects
 * the seeded mapping — re-linking inside the DOA dialog is section-local state
 * and does not travel here.
 */
export function linkedTasksForCourses(names: string[], duties: Duty[] = STUDY_DUTIES): LinkedTask[] {
  return duties.filter(d => d.courses.some(c => names.includes(c.name))).map(d => ({ no: d.no, name: d.name }));
}

/** The courses a learning plan bundles, by its id. */
export function planCourseNames(id: number): string[] {
  return PLAN_COURSES[id] ?? [];
}

export function linkedTasksOf(item: LibraryItem): LinkedTask[] {
  return linkedTasksForCourses(item.courses != null ? planCourseNames(item.id) : [item.name]);
}

/**
 * A course that has just been authored. It lands in the study's library as a
 * DRAFT: nothing is assigned to it, nobody is enrolled, and it has no due rule
 * until somebody publishes and assigns it.
 */
export function draftCourse(name: string, existing: LibraryItem[]): LibraryItem {
  return {
    id: Math.max(0, ...existing.map(c => c.id)) + 1,
    name,
    status: 'draft',
    version: '1.0',
    assignment: { kind: 'none' },
    users: 0,
    due: { value: 'No Due Date' },
  };
}

export const COURSE_TOTAL = 58;
export const PLAN_TOTAL = 12;
export const PAGE_SIZE = 10;
export const COURSE_PAGES = 6;
export const PLAN_PAGES = 2;
