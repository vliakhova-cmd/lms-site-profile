import type { Due, LibraryStatus } from './libraryData';

// A site's Training Plans — the courses and learning plans MAPPED to this
// site, which is a different question from the study's Training Library (what
// exists) and from Site Personnel (who has done it).
//
// Names come from the study's catalogue, because a site can only be mapped
// courses the study actually holds. Two things the library does not have and
// this does: a release status, and the "not applicable" state a site uses to
// say a mapped course does not apply to it.

/** Published courses are released to the site, or not yet, or exempt. */
export type ReleaseStatus = 'released' | 'not-released' | 'na';

/** Who the mapping targets: every role, a count of them, or one named role. */
export type RolesTarget = { kind: 'all' } | { kind: 'count'; count: number } | { kind: 'named'; name: string };

export interface SiteTrainingRow {
  id: number;
  name: string;
  status: LibraryStatus;
  /** Only a published course has one — a draft has nothing to release. */
  release?: ReleaseStatus;
  version: string;
  roles: RolesTarget;
  groups?: number;
  users: number;
  due: Due;
  /** Courses inside a learning plan — not set on a course row. */
  courses?: number;
  /**
   * Marked Not Applicable at this site. The row stays in the list so the
   * decision is visible and reversible, drawn at the disabled opacity.
   */
  notApplicable?: boolean;
}

export const SITE_COURSES: SiteTrainingRow[] = [
  {
    id: 1, name: 'Informed Consent Process — ICH GCP E6(R3)', status: 'published', release: 'not-released',
    version: '5.0', roles: { kind: 'all' }, groups: 2, users: 38, due: { value: '28 Apr 2026', rule: 'Max Date' },
  },
  {
    id: 2, name: 'ICF v4.0 — Study-Specific Consent Walkthrough', status: 'published', release: 'not-released',
    version: '2.0', roles: { kind: 'all' }, users: 22, due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 3, name: 'Protocol Training — Eligibility Criteria & Assessment', status: 'draft',
    version: '1.0', roles: { kind: 'count', count: 3 }, groups: 3, users: 45, due: { value: 'No Due Date' },
  },
  {
    id: 4, name: 'IWRS — Randomisation and Emergency Unblinding', status: 'draft',
    version: '2.0', roles: { kind: 'named', name: 'Principal Investigator' }, users: 19, due: { value: '5 Days', rule: 'Max Days' },
  },
  {
    id: 5, name: 'Sample Handling & Processing', status: 'draft',
    version: '1.0', roles: { kind: 'count', count: 5 }, users: 31, due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 6, name: 'Emergency Unblinding Procedure', status: 'draft', notApplicable: true,
    version: '1.0', roles: { kind: 'all' }, groups: 2, users: 49, due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 7, name: 'Investigational Product Handling & Accountability', status: 'published', release: 'na',
    version: '2.0', roles: { kind: 'count', count: 3 }, users: 27, due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 8, name: 'Safety Reporting — AE, SAE and Causality', status: 'published', release: 'released',
    version: '2.0', roles: { kind: 'count', count: 4 }, groups: 2, users: 9, due: { value: '10 Days', rule: 'Max Days' },
  },
  {
    id: 9, name: 'Biological Shipping — IATA Category B', status: 'published', release: 'released',
    version: '2.0', roles: { kind: 'count', count: 3 }, users: 16, due: { value: '3 May 2026', rule: 'Max Date' },
  },
  {
    id: 10, name: 'Investigator Oversight & Delegation', status: 'published', release: 'released',
    version: '1.0', roles: { kind: 'named', name: 'Principal Investigator' }, users: 4, due: { value: '21 Jun 2026', rule: 'Max Date' },
  },
];

export const SITE_PLANS: SiteTrainingRow[] = [
  {
    id: 101, name: 'Investigator Onboarding — Bivivid', status: 'published', release: 'released',
    version: '3.0', roles: { kind: 'count', count: 2 }, groups: 2, users: 18, courses: 6, due: { value: '30 Days', rule: 'Max Days' },
  },
  {
    id: 102, name: 'Coordinator Core Curriculum', status: 'published', release: 'not-released',
    version: '2.0', roles: { kind: 'all' }, users: 24, courses: 8, due: { value: '12 May 2026', rule: 'Max Date' },
  },
  {
    id: 103, name: 'Pharmacy & IP Handling', status: 'draft',
    version: '1.0', roles: { kind: 'count', count: 2 }, users: 7, courses: 4, due: { value: '28 Apr 2026', rule: 'Max Date' },
  },
];

export const SITE_TRAINING_PAGE_SIZE = 10;
