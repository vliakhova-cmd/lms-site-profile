import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import TopHeaderBar from './appShell/TopHeaderBar';
import LeftIconNav from './appShell/LeftIconNav';
import CollapsiblePanel from './appShell/CollapsiblePanel';
import StudySidebar, { SITE_ITEMS, SITE_SECTION_LABELS, type SiteSectionId } from './StudySidebar';
import TrainingToolbar, { doaActions, personnelActions, siteTrainingActions } from './TrainingToolbar';
import FilterRow, { DOA_SITE_FILTERS, PERSONNEL_FILTERS, SITE_TRAINING_FILTERS } from './FilterRow';
import ViewTabs from './ViewTabs';
import SiteGeneralInfo from './SiteGeneralInfo';
import PersonnelTable from './PersonnelTable';
import SiteTrainingTable, { SITE_TRAINING_VIEWS, type SiteTrainingView } from './SiteTrainingTable';
import DoaSection, { DoaHeaderLinks } from './DoaSection';
import TrainingGapsDialog from './TrainingGapsDialog';
import { SITES, type SiteRow } from './sitesData';
import { PERSONNEL_COUNT, peopleNotEnrolled } from './personnelData';
import { studyUrl, userUrl, siteNumberOf, go } from './links';
import { color, type, page, subNav, pageHeader, sysMsg, icon, button as btn } from './tokens';

// The SITE profile — one site's own screen, its own app and its own repo.
//
// It is reached with ?site=<number>, from the study's Sites listing, and it
// links back the same way: the crumbs and the panel's Study row go to the
// study app, a person's name goes to the user app. Each level owns its data
// and its URL; nothing here is a sub-route of another screen.

/** ?site= — which site this is. Falls back to the first the study holds. */
function requestedSite(): SiteRow {
  const asked = new URLSearchParams(window.location.search).get('site');
  if (!asked) return SITES[0];
  return SITES.find(s => s.name === asked || siteNumberOf(s.name) === asked) ?? SITES[0];
}

/** ?section= — which of the site's sections to open on. */
function requestedSection(): SiteSectionId {
  const asked = new URLSearchParams(window.location.search).get('section') ?? '';
  return asked in SITE_SECTION_LABELS ? (asked as SiteSectionId) : 'general-info';
}

export function SiteProfilePage() {
  const [site] = useState<SiteRow>(requestedSite);
  const [section, setSection] = useState<SiteSectionId>(requestedSection);
  const [personnelSelected, setPersonnelSelected] = useState(0);
  const [trainingSelected, setTrainingSelected] = useState(0);
  const [trainingView, setTrainingView] = useState<SiteTrainingView>('Courses');
  const [showingGaps, setShowingGaps] = useState(false);
  // Gaps closed by enrolling someone from the dialog, so the banner stops
  // counting what has just been fixed.
  const [closedGaps, setClosedGaps] = useState<Set<string>>(new Set());

  const number = siteNumberOf(site.name);
  const gapPeople = peopleNotEnrolled(site.name, closedGaps);

  const isInfo = section === 'general-info';
  const isPersonnel = section === 'site-personnel';
  const isTraining = section === 'training-plans';
  const isDoa = section === 'doa';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: color.pageBg,
        fontFamily: type.body.fontFamily,
      }}
    >
      <TopHeaderBar
        // The levels above this one live in another app, so their crumbs are
        // links out rather than state changes.
        crumbs={[
          { label: 'Company Dashboard', value: 'Manage Studies & Sites', onClick: () => go(studyUrl('sites')) },
          { label: 'Studies', value: 'Bivivid', onClick: () => go(studyUrl('general-info')) },
          { label: 'Sites', value: site.name, onClick: () => setSection('general-info') },
          { value: SITE_SECTION_LABELS[section], isEnd: true },
        ]}
        avatarInitials="SL"
        role="S. Admin"
        notifCount={2}
      />

      <div style={{ display: 'flex', flex: '1 0 0', minHeight: 0 }}>
        <LeftIconNav />

        <CollapsiblePanel defaultWidth={subNav.width}>
          <StudySidebar
            name={site.name}
            level="SITE"
            statusLabel={site.status}
            // The study the site belongs to, as the way back up.
            info={[
              { label: 'Study', value: 'Bivivid', link: true, onClick: () => go(studyUrl('sites')) },
              { label: 'Coordinator', value: site.coordinator ?? `${site.coordinatorCount ?? 0} coordinators` },
            ]}
            items={SITE_ITEMS}
            selected={section}
            onSelect={id => setSection(id as SiteSectionId)}
          />
        </CollapsiblePanel>

        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 0 0', minWidth: 0, minHeight: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: pageHeader.gapM,
              padding: `${pageHeader.paddingY}px ${pageHeader.paddingX}px`,
              backgroundColor: color.pageHeaderBg,
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            <h1 style={{ margin: 0, ...type.h1, color: color.pageHeaderText, flexShrink: 0 }}>{SITE_SECTION_LABELS[section]}</h1>
            {isTraining && (
              <ViewTabs
                tabs={SITE_TRAINING_VIEWS}
                value={trainingView}
                onChange={v => {
                  setTrainingView(v as SiteTrainingView);
                  setTrainingSelected(0);
                }}
              />
            )}
            {/* The tasks are generated, so the header carries their sources */}
            {isDoa && <DoaHeaderLinks site={site.name} />}
          </div>

          <div
            style={{
              flex: '1 0 0',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              padding: `${page.paddingY}px ${page.paddingX}px`,
              gap: 15,
              minHeight: 0,
            }}
          >
            {isInfo && <SiteGeneralInfo site={site} />}

            {isPersonnel && (
              <>
                <TrainingToolbar {...personnelActions(personnelSelected > 0)} searchPlaceholder="Search users" />
                <FilterRow filters={PERSONNEL_FILTERS} />

                {/* The assignment gap, said once at the top: people carrying a
                    delegated duty nobody has enrolled them for. */}
                {gapPeople > 0 && (
                  <div
                    role="status"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: sysMsg.gapS,
                      padding: sysMsg.paddingXY,
                      borderRadius: sysMsg.radius,
                      backgroundColor: '#fdf0ef',
                      border: `1px solid ${color.statusSolidRed}`,
                      flexShrink: 0,
                    }}
                  >
                    <FontAwesomeIcon icon={faCircleExclamation} style={{ width: icon.m, height: icon.m, color: color.critical, flexShrink: 0 }} />
                    <span style={{ ...type.body, color: color.sysMsgText, flex: '1 0 0', minWidth: 0 }}>
                      <b style={{ color: color.text }}>
                        {gapPeople} {gapPeople === 1 ? 'person is' : 'people are'} not enrolled
                      </b>{' '}
                      in a course required for a task they are delegated on this site&apos;s DOA log. Assigning the training is what closes it.
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowingGaps(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: `${btn.mediumPaddingY}px ${btn.mediumPaddingX}px`,
                        border: `1px solid ${color.border}`,
                        borderRadius: btn.radius,
                        backgroundColor: color.white,
                        color: color.primary,
                        cursor: 'pointer',
                        flexShrink: 0,
                        ...type.button,
                      }}
                    >
                      View gaps
                    </button>
                  </div>
                )}

                <span style={{ ...type.bodyBold, color: color.text }}>
                  {PERSONNEL_COUNT} Users
                  {personnelSelected > 0 && <span style={{ ...type.body, color: color.textMuted }}> {personnelSelected} Selected</span>}
                </span>

                <PersonnelTable
                  onSelectionChange={setPersonnelSelected}
                  onOpenUser={person =>
                    // A person's profile is its own app: the site hands over
                    // who they are and where, and that app works out the rest.
                    go(userUrl(number, person.name))
                  }
                />
              </>
            )}

            {isTraining && (
              <>
                <TrainingToolbar {...siteTrainingActions(trainingSelected > 0, trainingView)} searchPlaceholder="Search training" />
                <FilterRow filters={SITE_TRAINING_FILTERS} />
                <SiteTrainingTable key={trainingView} view={trainingView} site={site} onSelectionChange={setTrainingSelected} />
              </>
            )}

            {isDoa && (
              <>
                <TrainingToolbar
                  {...doaActions(false, true, () => go(studyUrl('doa')))}
                  searchPlaceholder="Search duties"
                />
                {/* At site level the log is fixed — there is nothing to pick */}
                <FilterRow filters={DOA_SITE_FILTERS} />
                <DoaSection site={site.name} />
              </>
            )}
          </div>
        </div>
      </div>

      {showingGaps && (
        <TrainingGapsDialog
          site={site.name}
          closed={closedGaps}
          onEnroll={keys => setClosedGaps(prev => new Set([...prev, ...keys]))}
          onOpenUser={row => go(userUrl(siteNumberOf(row.site), row.name, 'tasks'))}
          onClose={() => setShowingGaps(false)}
        />
      )}
    </div>
  );
}

export default SiteProfilePage;
