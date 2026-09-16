// Where the other two profile apps live.
//
// A study, a site and a user are three apps in three repositories, so moving
// between levels is a navigation rather than a state change. In development
// they are three dev servers on the ports .claude/launch.json reserves;
// published, they are three GitHub Pages sites on one host.
const DEV = import.meta.env.DEV;

export const STUDY_APP = DEV ? 'http://localhost:5176/' : '/lms-study-profile/';
export const SITE_APP = DEV ? 'http://localhost:5177/' : '/lms-site-profile/';
export const USER_APP = DEV ? 'http://localhost:5178/' : '/lms-user-profile/';

/** The study profile, at whichever of its sections is being named. */
export const studyUrl = (section = 'general-info') => `${STUDY_APP}?section=${section}`;

/** A site's profile. The number identifies it; the app resolves the rest. */
export const siteUrl = (siteNumber: string, section = 'general-info') =>
  `${SITE_APP}?site=${encodeURIComponent(siteNumber)}&section=${section}`;

/**
 * A person's profile. It carries the site as well as the name, because what a
 * user carries — their duties, and the training those need — is a fact about
 * them AT a site, not about them in general.
 */
export const userUrl = (siteNumber: string, name: string, section = 'general-info') =>
  `${USER_APP}?site=${encodeURIComponent(siteNumber)}&user=${encodeURIComponent(name)}&section=${section}`;

/**
 * The eTMF — doa-log, which holds the signed DOA logs these tasks are read
 * from. Its own app and its own repository, so it is reached by URL like the
 * rest: `?site=` opens that site's folder, `&doc=doa` its signed log itself.
 */
export const ETMF_APP = DEV ? 'http://localhost:5175/' : '/doa-log-report/';

export const etmfSiteUrl = (siteNumber: string) => `${ETMF_APP}?site=${encodeURIComponent(siteNumber)}`;
export const etmfDocUrl = (siteNumber: string) => `${etmfSiteUrl(siteNumber)}&doc=doa`;

/**
 * AI Course Authoring — a fourth app, and the one this study writes courses
 * with. `from` is where it comes back to when the draft is saved or the flow
 * is abandoned, so leaving here and returning is a round trip rather than a
 * dead end. `source=none` opens the flow with nothing preselected: the duty
 * and its documents are not handed over yet, and a document nobody picked
 * would be worse than an empty field.
 */
export const AUTHORING_APP = DEV ? 'http://localhost:5174/' : '/ai-course-authoring-flow/';

export const authoringUrl = () =>
  `${AUTHORING_APP}?flow=ai&source=none&from=${encodeURIComponent(window.location.href)}`;

/** "0982 - Miles, H" → "0982" — the label carries the number in front. */
export const siteNumberOf = (label: string) => label.split(' - ')[0];

/** Following a link between levels replaces the page, as any navigation does. */
export const go = (url: string) => {
  window.location.href = url;
};
