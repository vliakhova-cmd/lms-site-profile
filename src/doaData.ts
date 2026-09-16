// The LMS half of the DOA story.
//
// The eTMF prototype (doa-log) already reads a signed Delegation of Authority
// log and asks, per person: name on document → resolved contact → delegated
// duty → required training → status. It deliberately surfaces one case it
// cannot fix from the document side — a duty with NO course linked, which is a
// hole in the training catalogue rather than in anybody's record.
//
// This section is the other end of that link: where the duty → course mapping
// is MAINTAINED for the study, not just verified. Duties, roles and the two
// named gaps are kept consistent with doa-log's cross-module check so the two
// prototypes tell one story.

/**
 * Where "Open in eTMF" goes, and what the DOA Log chip opens: the doa-log
 * prototype, which renders this very document and its cross-module check. It
 * is its own app now, so the URLs are built in src/links.ts with every other
 * cross-app link rather than written a second time here.
 */
export { ETMF_APP as ETMF_URL, etmfSiteUrl as etmfUrlForSite, etmfDocUrl as etmfDocUrlForSite } from './links';


/**
 * Where "Draft course" goes: the ai-course-authoring-flow prototype, which
 * turns source documents into a course. It is its own app and its own
 * repository, so the URL is built where every other cross-app URL is —
 * src/links.ts — rather than being written a second time here.
 *
 * The duty and its source documents are NOT handed over yet; the flow would
 * need to accept a brief. `source=none` at least stops it opening on a
 * document nobody picked.
 */
export { authoringUrl as aiAuthoringUrl } from './links';

/**
 * The study's blank DOA form — the template every site's log is signed on. It
 * is what fixes the standard duty list, so it is the first input to the
 * generated tasks: the template says WHICH duties exist, each site's signed log
 * says who carries them there, and the matrix below says what qualifies them.
 *
 * Unlike a site's log this one is study-level, so it sits in the study's own
 * folders rather than under any site.
 */
export const TEMPLATE_DOCUMENT = {
  name: 'DOA Log Template',
  version: 'v1.2',
  folderPath: ['Bivivid', '01_Study Info', '01.3_Study Management'],
  owner: 'Jenny Wilson',
};

/**
 * The third input: the study's training requirements matrix, which says which
 * role must hold which course. It is an LMS artifact, unlike the DOA log.
 */
export const TRAINING_MATRIX = {
  name: 'Training Requirements Matrix',
  version: 'v2.3',
};

/**
 * A Delegation of Authority log is signed by the investigator AT ONE SITE, so
 * a study has one per site rather than a single study-level document. Each
 * site's log is a different document, in that site's own eTMF folder, and
 * delegates its own duties to its own people — which is why everything below
 * is keyed by site rather than held once for the study.
 */
export interface DoaSite {
  /** Spelled exactly as the Sites listing spells it. */
  label: string;
  number: string;
  pi: string;
}

/** The eTMF record one site's section is built on. */
export interface DoaDocument {
  name: string;
  kind: 'pdf';
  site: string;
  /**
   * Where it sits in the eTMF tree, from the site down. A DOA log is a
   * site-level PI-oversight artifact, so it files under that site's
   * 02_PI Oversight → 02.2_Delegation — the folder doa-log opens on.
   */
  folderPath: string[];
  folder: string;
  status: string;
  version: string;
  owner: string;
  signedOn: string;
  /** When the LMS last pulled the document and re-ran the cross-module check */
  syncedAt: string;
  /** What that check returned, per person */
  people: number;
  complete: number;
  incomplete: number;
  ambiguous: number;
}

export type Coverage = 'covered' | 'partial' | 'gap';

export interface DutySuggestion {
  /** The course the system proposes creating for an unmapped duty. */
  course: string;
  /** The study document it would be generated from. */
  source: string;
  confidence: 'High' | 'Medium';
}

/** A course that qualifies someone for a duty, and the document it came from. */
export interface QualifyingCourse {
  name: string;
  source?: string;
}

export interface Duty {
  no: number;
  name: string;
  /** Delegated roles that carry this duty on the DOA log. */
  roles: string[];
  /**
   * The courses that qualify someone to perform it. A duty can need more than
   * one — doa-log's check assumes at most one per duty, so that side needs to
   * follow if this holds.
   */
  courses: QualifyingCourse[];
  /** People enrolled in a qualifying course for this duty. */
  assigned: number;
  /** How many of them have completed it. */
  trained: number;
  /**
   * People the LOG delegates this duty to whom nobody has enrolled in its
   * course. They are not in `assigned` — that is the whole problem: a duty can
   * read fully trained while somebody carries it with no training at all.
   */
  notEnrolled?: number;
  suggestion?: DutySuggestion;
}

const DUTIES_0982: Duty[] = [
  {
    no: 1,
    name: 'Obtaining informed consent',
    roles: ['PI', 'Sub-I', 'Coordinator'],
    courses: [
      { name: 'Informed Consent Process — ICH GCP E6(R3)', source: 'Protocol §10.1' },
      { name: 'ICF v4.0 — Study-Specific Consent Walkthrough', source: 'ICF v4.0' },
    ],
    assigned: 7,
    trained: 7,
  },
  {
    no: 2,
    name: 'Eligibility assessment',
    roles: ['PI', 'Sub-I'],
    courses: [{ name: 'Protocol Training — Eligibility Criteria & Assessment', source: 'Protocol §6 (Inclusion/Exclusion)' }],
    assigned: 6,
    trained: 4,
    notEnrolled: 1,
  },
  {
    no: 3,
    name: 'Source data entry',
    roles: ['Coordinator', 'Data Entry'],
    courses: [],
    // The gap doa-log reports. Nobody is untrained for it — there is simply
    // nothing to be trained on yet.
    assigned: 9,
    trained: 0,
    suggestion: {
      course: 'Source Documentation & ALCOA+ for This Protocol',
      source: 'Protocol §12.2 · Monitoring Plan · eCRF Completion Guidelines',
      confidence: 'High',
    },
  },
  {
    no: 4,
    name: 'IP accountability & dispensing',
    roles: ['Pharmacist', 'Coordinator'],
    courses: [{ name: 'Investigational Product Handling & Accountability', source: 'Pharmacy Manual v2.1' }],
    assigned: 4,
    trained: 3,
    notEnrolled: 1,
  },
  {
    no: 5,
    name: 'Randomisation & unblinding',
    roles: ['PI', 'Pharmacist'],
    courses: [
      { name: 'IWRS — Randomisation and Emergency Unblinding', source: 'IWRS User Guide' },
      { name: 'Emergency Unblinding Procedure', source: 'Protocol §7.3' },
    ],
    assigned: 5,
    trained: 5,
  },
  {
    no: 6,
    name: 'Biological sample handling',
    roles: ['Coordinator', 'Lab Technician'],
    courses: [
      { name: 'Sample Handling & Processing', source: 'Laboratory Manual v3.0' },
      { name: 'Biological Shipping — IATA Category B', source: 'Laboratory Manual v3.0 §8' },
    ],
    assigned: 6,
    trained: 4,
  },
  {
    no: 7,
    name: 'AE / SAE assessment and reporting',
    roles: ['PI', 'Sub-I'],
    courses: [{ name: 'Safety Reporting — AE, SAE and Causality', source: 'Protocol §9 · Safety Management Plan' }],
    assigned: 6,
    trained: 6,
    notEnrolled: 1,
  },
  {
    no: 8,
    name: 'Study drug administration',
    roles: ['Sub-I', 'Study Nurse'],
    courses: [],
    assigned: 3,
    trained: 0,
    suggestion: {
      course: 'Dose Preparation & Administration Procedure',
      source: 'Protocol §7.1 · Pharmacy Manual v2.1',
      confidence: 'Medium',
    },
  },
  {
    no: 9,
    name: 'Delegation oversight & DOA maintenance',
    roles: ['PI'],
    courses: [{ name: 'Investigator Oversight & Delegation', source: 'ICH GCP E6(R3) §4.2' }],
    assigned: 2,
    trained: 1,
  },
];

/** What the study's catalogue offers when re-linking a duty. */
export const CATALOGUE: QualifyingCourse[] = [
  { name: 'Informed Consent Process — ICH GCP E6(R3)', source: 'Protocol §10.1' },
  { name: 'ICF v4.0 — Study-Specific Consent Walkthrough', source: 'ICF v4.0' },
  { name: 'Protocol Training — Eligibility Criteria & Assessment', source: 'Protocol §6 (Inclusion/Exclusion)' },
  { name: 'Investigational Product Handling & Accountability', source: 'Pharmacy Manual v2.1' },
  { name: 'IWRS — Randomisation and Emergency Unblinding', source: 'IWRS User Guide' },
  { name: 'Emergency Unblinding Procedure', source: 'Protocol §7.3' },
  { name: 'Sample Handling & Processing', source: 'Laboratory Manual v3.0' },
  { name: 'Biological Shipping — IATA Category B', source: 'Laboratory Manual v3.0 §8' },
  { name: 'Safety Reporting — AE, SAE and Causality', source: 'Protocol §9 · Safety Management Plan' },
  { name: 'Investigator Oversight & Delegation', source: 'ICH GCP E6(R3) §4.2' },
  { name: 'GCP Refresher 2026', source: 'ICH GCP E6(R3)' },
  { name: 'Protocol Amendment 3 — What Changed', source: 'Protocol Amendment 3' },
  { name: 'IP Handling at Site 2208 — Local Pharmacy Addendum', source: 'Site 2208 Pharmacy Addendum' },
];

/**
 * The other sites' logs. Each is its own signed document, delegating its own
 * duties to its own people, so the counts differ and so does what is still
 * unmapped — 1643 has a smaller team and one gap, 2208 is a late-activating
 * site whose log is still in QC1 and whose training has barely started.
 */
const DUTIES_1643: Duty[] = [
  {
    no: 1,
    name: 'Obtaining informed consent',
    roles: ['PI', 'Coordinator'],
    courses: [
      { name: 'Informed Consent Process — ICH GCP E6(R3)', source: 'Protocol §10.1' },
      { name: 'ICF v4.0 — Study-Specific Consent Walkthrough', source: 'ICF v4.0' },
    ],
    assigned: 4,
    trained: 4,
  },
  {
    no: 2,
    name: 'Eligibility assessment',
    roles: ['PI', 'Sub-I'],
    courses: [{ name: 'Protocol Training — Eligibility Criteria & Assessment', source: 'Protocol §6 (Inclusion/Exclusion)' }],
    assigned: 3,
    trained: 2,
    notEnrolled: 2,
  },
  {
    no: 3,
    name: 'Source data entry',
    roles: ['Coordinator'],
    courses: [],
    assigned: 5,
    trained: 0,
    suggestion: {
      course: 'Source Documentation & ALCOA+ for This Protocol',
      source: 'Protocol §12.2 · Monitoring Plan · eCRF Completion Guidelines',
      confidence: 'High',
    },
  },
  {
    no: 4,
    name: 'Biological sample handling',
    roles: ['Coordinator', 'Lab Technician'],
    courses: [
      { name: 'Sample Handling & Processing', source: 'Laboratory Manual v3.0' },
      { name: 'Biological Shipping — IATA Category B', source: 'Laboratory Manual v3.0 §8' },
    ],
    assigned: 4,
    trained: 3,
  },
  {
    no: 5,
    name: 'AE / SAE assessment and reporting',
    roles: ['PI', 'Sub-I'],
    courses: [{ name: 'Safety Reporting — AE, SAE and Causality', source: 'Protocol §9 · Safety Management Plan' }],
    assigned: 3,
    trained: 3,
  },
  {
    no: 6,
    name: 'Delegation oversight & DOA maintenance',
    roles: ['PI'],
    courses: [{ name: 'Investigator Oversight & Delegation', source: 'ICH GCP E6(R3) §4.2' }],
    assigned: 1,
    trained: 1,
  },
];

const DUTIES_2208: Duty[] = [
  {
    no: 1,
    name: 'Obtaining informed consent',
    roles: ['PI', 'Coordinator'],
    courses: [{ name: 'Informed Consent Process — ICH GCP E6(R3)', source: 'Protocol §10.1' }],
    assigned: 3,
    trained: 1,
    notEnrolled: 1,
  },
  {
    no: 2,
    name: 'Eligibility assessment',
    roles: ['PI'],
    courses: [{ name: 'Protocol Training — Eligibility Criteria & Assessment', source: 'Protocol §6 (Inclusion/Exclusion)' }],
    assigned: 2,
    trained: 0,
  },
  {
    no: 3,
    name: 'Source data entry',
    roles: ['Coordinator', 'Data Entry'],
    courses: [],
    assigned: 4,
    trained: 0,
    suggestion: {
      course: 'Source Documentation & ALCOA+ for This Protocol',
      source: 'Protocol §12.2 · Monitoring Plan · eCRF Completion Guidelines',
      confidence: 'High',
    },
  },
  {
    no: 4,
    name: 'IP accountability & dispensing',
    roles: ['Pharmacist'],
    // Built from this site's own pharmacy addendum, so it qualifies the duty
    // HERE and nowhere else — the case an "All Sites" rule would get wrong.
    courses: [{ name: 'IP Handling at Site 2208 — Local Pharmacy Addendum', source: 'Site 2208 Pharmacy Addendum' }],
    assigned: 2,
    trained: 0,
  },
  {
    no: 5,
    name: 'Delegation oversight & DOA maintenance',
    roles: ['PI'],
    courses: [{ name: 'Investigator Oversight & Delegation', source: 'ICH GCP E6(R3) §4.2' }],
    assigned: 1,
    trained: 0,
  },
];

/** One site's DOA: the site, its signed log, and the duties that log delegates. */
export interface SiteDoa {
  site: DoaSite;
  document: DoaDocument;
  duties: Duty[];
}

function logFor(site: DoaSite, doc: Omit<DoaDocument, 'kind' | 'site' | 'folderPath' | 'folder' | 'name'>): DoaDocument {
  return {
    // The document names its site, so a row or a chip says whose log it is
    // without anyone having to read the folder path.
    name: `DOA Log — ${site.label}`,
    kind: 'pdf',
    site: site.label,
    folderPath: [site.label, '02_PI Oversight', '02.2_Delegation'],
    folder: '02.2_Delegation',
    ...doc,
  };
}

const SITE_0982: DoaSite = { label: '0982 - Miles, H', number: '0982', pi: 'Miles, H' };
const SITE_1643: DoaSite = { label: '1643 - Hwang, S', number: '1643', pi: 'Hwang, S' };
const SITE_2208: DoaSite = { label: '2208 - Rivera, C', number: '2208', pi: 'Rivera, C' };

export const SITE_DOA: SiteDoa[] = [
  {
    site: SITE_0982,
    document: logFor(SITE_0982, {
      status: 'QC2 in progress',
      version: 'v4.0',
      owner: 'Jenny Wilson',
      signedOn: '17 Oct 2026',
      syncedAt: '12 Mar 2026, 09:42 CET',
      people: 9,
      complete: 6,
      incomplete: 2,
      ambiguous: 1,
    }),
    duties: DUTIES_0982,
  },
  {
    site: SITE_1643,
    document: logFor(SITE_1643, {
      status: 'QC approved',
      version: 'v2.0',
      owner: 'Devon Lane',
      signedOn: '04 Aug 2026',
      syncedAt: '12 Mar 2026, 09:44 CET',
      people: 6,
      complete: 5,
      incomplete: 1,
      ambiguous: 0,
    }),
    duties: DUTIES_1643,
  },
  {
    site: SITE_2208,
    document: logFor(SITE_2208, {
      status: 'QC1 in progress',
      version: 'v1.0',
      owner: 'Annette Black',
      signedOn: '22 Jan 2027',
      syncedAt: '12 Mar 2026, 09:47 CET',
      people: 4,
      complete: 1,
      incomplete: 3,
      ambiguous: 0,
    }),
    duties: DUTIES_2208,
  },
];

/**
 * The site's DOA, by its Sites-listing label. A site with no log of its own
 * falls back to the first — every study has at least one signed log, and a
 * prototype should not render an empty screen for a site that has not got
 * round to signing one.
 */
export function doaForSite(siteLabel?: string): SiteDoa {
  return SITE_DOA.find(d => d.site.label === siteLabel) ?? SITE_DOA[0];
}

/** Every site whose log this study holds — what the Site filter offers. */
export const DOA_SITE_LABELS = SITE_DOA.map(d => d.site.label);

/** The site the study-level section opens on, until one is picked. */
export const SOURCE_SITE = SITE_0982;

/**
 * The study's view of its duties: the template's standard list, read across
 * every site. Duties are matched by name, their qualifying courses unioned (a
 * course qualifies a duty wherever it was delegated), and the people counts
 * summed — so "4 of 6" here means six people across the study, not at one site.
 *
 * A duty counts as unmapped only when NO site has a course for it; the
 * suggestion travels with it so the study can still act on the gap.
 */
export const STUDY_DUTIES: Duty[] = (() => {
  const byName = new Map<string, Duty>();
  let no = 0;
  for (const { duties } of SITE_DOA) {
    for (const duty of duties) {
      const seen = byName.get(duty.name);
      if (!seen) {
        byName.set(duty.name, { ...duty, no: ++no, courses: [...duty.courses] });
        continue;
      }
      for (const course of duty.courses) {
        if (!seen.courses.some(c => c.name === course.name)) seen.courses.push(course);
      }
      seen.assigned += duty.assigned;
      seen.trained += duty.trained;
      if (duty.notEnrolled) seen.notEnrolled = (seen.notEnrolled ?? 0) + duty.notEnrolled;
      seen.roles = [...new Set([...seen.roles, ...duty.roles])];
      seen.suggestion = seen.suggestion ?? duty.suggestion;
    }
  }
  return [...byName.values()];
})();

/**
 * People this site's log delegates who have no enrolment in the qualifying
 * course — the site's share of the training gap, for the study to see which
 * site to chase. A site with no log loaded returns 0, not a guess.
 */
export function notEnrolledAtSite(siteLabel: string): number {
  const site = SITE_DOA.find(d => d.site.label === siteLabel);
  return site ? site.duties.reduce((n, duty) => n + (duty.notEnrolled ?? 0), 0) : 0;
}

export function coverageOf(duty: Duty): Coverage {
  if (duty.courses.length === 0) return 'gap';
  return duty.trained >= duty.assigned ? 'covered' : 'partial';
}
