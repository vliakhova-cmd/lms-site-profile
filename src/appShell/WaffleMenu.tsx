import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNodes, faUsersBetweenLines, faNewspaper, faLink, faChevronRight, faScrewdriverWrench, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { color, type, waffle as w, status as st, icon } from '../tokens';

// The waffle menu — Origami | PROD | 10.9, node 26748:27643.
//
// The app switcher in the header opens it: the client it belongs to across the
// top, then the products under that client. LMS is deliberately absent — these
// prototypes ARE the LMS, and an app switcher that offers you the app you are
// already in is a dead row.
//
// Links is the one entry that expands rather than navigates; it opens the
// second panel the design draws, listing the systems a study is wired to.

interface AppEntry {
  label: string;
  glyph: IconDefinition;
  /** bg/accent/<tone>/solid/subtlest + its text colour — the tile's tone. */
  tile: string;
  tone: string;
  /** Where it goes. An entry with none is a product this prototype has not built. */
  href?: string;
  expands?: boolean;
}

export interface GeneralLink {
  name: string;
  url: string;
  glyph: IconDefinition;
  tile: string;
  tone: string;
}

/** The client's other products. LMS is left out on purpose — see above. */
function apps(etmfUrl?: string): AppEntry[] {
  return [
    { label: 'Trial Interactive', glyph: faCircleNodes, tile: w.blueTile, tone: w.blueIcon, href: etmfUrl },
    { label: 'CTMS', glyph: faUsersBetweenLines, tile: w.pinkTile, tone: w.pinkIcon },
    { label: 'Reports', glyph: faNewspaper, tile: w.aquaTile, tone: w.aquaIcon },
    { label: 'Links', glyph: faLink, tile: w.blueTile, tone: w.blueIcon, expands: true },
  ];
}

const GENERAL_LINKS: GeneralLink[] = [
  { name: 'EDC', url: 'https://trialinteractive.example/edc', glyph: faCircleNodes, tile: '#fdeceb', tone: '#d23c2d' },
  { name: 'IRT', url: 'https://trialinteractive.example/irt', glyph: faCircleNodes, tile: '#f2f4fa', tone: '#576581' },
  { name: 'Labs', url: 'https://trialinteractive.example/labs', glyph: faCircleNodes, tile: '#e3f4ff', tone: '#1f6aac' },
];

/** avatar/min-width tile — 50 square at radius-s, its glyph in the tone. */
function Tile({ glyph, tile, tone, size = w.tileSize }: { glyph: IconDefinition; tile: string; tone: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: w.tileRadius,
        backgroundColor: tile,
        flexShrink: 0,
      }}
    >
      <FontAwesomeIcon icon={glyph} style={{ width: icon.m, height: icon.m, color: tone }} />
    </span>
  );
}

function AppRow({ app, active, onSelect }: { app: AppEntry; active: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  const reachable = !!app.href || app.expands;

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={reachable ? app.label : `${app.label} — not part of this prototype`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: w.rowGap,
        width: '100%',
        height: w.rowHeight,
        padding: `0 ${w.rowPaddingX}px`,
        border: 'none',
        borderRadius: w.tileRadius,
        // bg/neutral/solid/subtle — the selected row, which is how Links reads
        // while its panel is open.
        backgroundColor: active || hover ? w.rowSelectedBg : 'transparent',
        cursor: reachable ? 'pointer' : 'default',
        textAlign: 'left',
        transition: 'background-color 100ms',
      }}
    >
      <Tile glyph={app.glyph} tile={app.tile} tone={app.tone} />
      <span style={{ ...type.h6, color: color.text, flex: '1 0 0', minWidth: 0 }}>{app.label}</span>
      {app.expands && <FontAwesomeIcon icon={faChevronRight} style={{ width: icon.s, height: icon.s, color: color.primary }} />}
    </button>
  );
}

export function WaffleMenu({ etmfUrl, onClose }: { etmfUrl?: string; onClose: () => void }) {
  const [links, setLinks] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Escape closes it, as every other overlay here does.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={onClose} />
      <div
        ref={ref}
        style={{
          // Fixed, not absolute: the crumb row it hangs from clips its own
          // overflow, which would cut the panel off at the header's edge.
          position: 'fixed',
          top: w.headerHeight + 10,
          left: 10,
          zIndex: 41,
          display: 'flex',
          padding: w.padding,
          gap: w.gap,
          backgroundColor: color.white,
          borderRadius: w.radius,
          boxShadow: w.shadow,
        }}
      >
        {/* Sidebar — the client, then its products */}
        <div style={{ display: 'flex', flexDirection: 'column', width: w.sidebarWidth, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: w.rowGap, height: w.headerHeight }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: w.tileSize, height: w.tileSize, flexShrink: 0 }}>
              <img src={`${import.meta.env.BASE_URL}ti-logo.svg`} alt="" style={{ width: 31, height: 40, transform: 'scaleY(-1)', display: 'block' }} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: w.titleGap, flex: '1 0 0', minWidth: 0 }}>
              <span style={{ ...type.button, color: color.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Trial Interactive Client
              </span>
              <span
                style={{
                  alignSelf: 'flex-start',
                  padding: `0 ${st.paddingX}px`,
                  borderRadius: st.radius,
                  backgroundColor: color.statusSolidGreen,
                  color: color.text,
                  ...type.statusSmall,
                  textTransform: 'uppercase',
                }}
              >
                Demo
              </span>
            </span>
            {/* Button/Solid base — the client's own settings */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: w.tileSize,
                height: w.tileSize,
                borderRadius: w.tileRadius,
                backgroundColor: w.settingsBg,
                color: color.primary,
                flexShrink: 0,
              }}
            >
              <FontAwesomeIcon icon={faScrewdriverWrench} style={{ width: icon.m, height: icon.m }} />
            </span>
          </div>

          <span style={{ height: 1, backgroundColor: color.border, margin: `${w.gap}px 0` }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: w.rowStackGap }}>
            {apps(etmfUrl).map(app => (
              <AppRow
                key={app.label}
                app={app}
                active={!!app.expands && links}
                onSelect={() => {
                  if (app.expands) setLinks(o => !o);
                  else if (app.href) window.location.href = app.href;
                }}
              />
            ))}
          </div>
        </div>

        {/* Details — only Links has any, and only while it is chosen */}
        {links && (
          <div
            style={{
              width: w.detailsWidth,
              display: 'flex',
              flexDirection: 'column',
              gap: w.gap,
              padding: w.padding,
              backgroundColor: color.pageBg,
              borderRadius: w.tileRadius,
            }}
          >
            <span style={{ ...type.captionSemibold, color: color.textMuted, textTransform: 'uppercase' }}>General Links</span>
            {GENERAL_LINKS.map(link => (
              <span
                key={link.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: w.rowGap,
                  height: w.rowHeight,
                  padding: `0 ${w.rowPaddingX}px`,
                  backgroundColor: color.white,
                  border: `1px solid ${color.borderSubtle}`,
                  borderRadius: w.tileRadius,
                }}
              >
                <Tile glyph={link.glyph} tile={link.tile} tone={link.tone} size={w.linkTileSize} />
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ ...type.link, color: color.primary }}>{link.name}</span>
                  <span style={{ ...type.captionRegular, color: color.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {link.url}
                  </span>
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default WaffleMenu;
