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

/** "0982 - Miles, H" → "0982" — the label carries the number in front. */
export const siteNumberOf = (label: string) => label.split(' - ')[0];

/** Following a link between levels replaces the page, as any navigation does. */
export const go = (url: string) => {
  window.location.href = url;
};
