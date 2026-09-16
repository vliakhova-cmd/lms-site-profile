// Design tokens resolved via the Figma MCP `get_variable_defs` on the eTMF
// frame "eTMF | IN PROGRESS | 10.9.1-10.9.2" → Index (node 33696:25047).
// Every value below is a real variable value from the DS libraries
// (DS - Base | IN PROGRESS | 2.0 · DS - Advanced | IN PROGRESS | 2.0) —
// the Figma variable name is given in the comment beside each entry.

export const FONT = "'Open Sans', sans-serif";
/** icons/solid/family · icons/regular/family */
export const ICON_FONT = 'Font Awesome 7 Free';

// ─── Typography ──────────────────────────────────────────────────────────────
// typography/text/* · typography/table/* · typography/additional/*
export const type = {
  /** Body/Regular — 14/20 400 */
  body: { fontFamily: FONT, fontSize: 14, lineHeight: '20px', fontWeight: 400 },
  /** Body/Semibold — 14/20 600 */
  bodySemibold: { fontFamily: FONT, fontSize: 14, lineHeight: '20px', fontWeight: 600 },
  /** Body/Bold — 14/20 700 */
  bodyBold: { fontFamily: FONT, fontSize: 14, lineHeight: '20px', fontWeight: 700 },
  /** Caption/Bold — 12/15 700 */
  captionBold: { fontFamily: FONT, fontSize: 12, lineHeight: '15px', fontWeight: 700 },
  /** Buttons/Medium (Default) — 14/20 600 */
  button: { fontFamily: FONT, fontSize: 14, lineHeight: '20px', fontWeight: 600 },
  /** Buttons/Medium-Link — 14/20 400 */
  link: { fontFamily: FONT, fontSize: 14, lineHeight: '20px', fontWeight: 400 },
  /** Links/Semibold/Small — 12/15 600 */
  linkSmall: { fontFamily: FONT, fontSize: 12, lineHeight: '15px', fontWeight: 600 },
  /** Table/Header — 12/15 600 */
  tableHeader: { fontFamily: FONT, fontSize: 12, lineHeight: '15px', fontWeight: 600 },
  /** Table/Cell/Regular — 14/20 400 */
  tableCell: { fontFamily: FONT, fontSize: 14, lineHeight: '20px', fontWeight: 400 },
  /** Statuses/Semibold/Medium — 12/20 600 */
  status: { fontFamily: FONT, fontSize: 12, lineHeight: '20px', fontWeight: 600 },
  /** Counters/Small — 12/15 600 */
  counter: { fontFamily: FONT, fontSize: 12, lineHeight: '15px', fontWeight: 600 },
  /** Headings/H5/Semibold — 16/20 600 */
  h5: { fontFamily: FONT, fontSize: 16, lineHeight: '20px', fontWeight: 600 },
  /** Headings/H1 — 28/40 400 */
  h1: { fontFamily: FONT, fontSize: 28, lineHeight: '40px', fontWeight: 400 },
  /** Buttons/Small — 12/15 600 */
  buttonSmall: { fontFamily: FONT, fontSize: 12, lineHeight: '15px', fontWeight: 600 },
  /** Statuses/Semibold/Small — 10/15 600 */
  statusSmall: { fontFamily: FONT, fontSize: 10, lineHeight: '15px', fontWeight: 600 },
  /** Caption/Semibold — 12/15 600 */
  captionSemibold: { fontFamily: FONT, fontSize: 12, lineHeight: '15px', fontWeight: 600 },
  /** Caption/Regular — 12/15 400 */
  captionRegular: { fontFamily: FONT, fontSize: 12, lineHeight: '15px', fontWeight: 400 },
  /** Counters/Medium — 14/20 600 */
  counterMedium: { fontFamily: FONT, fontSize: 14, lineHeight: '20px', fontWeight: 600 },
  /** Counters/Large — 16/20 600 */
  counterLarge: { fontFamily: FONT, fontSize: 16, lineHeight: '20px', fontWeight: 600 },
  /** Headings/H3/Semibold — 20/30 600 (a dialog's titlebar title) */
  h3: { fontFamily: FONT, fontSize: 20, lineHeight: '30px', fontWeight: 600 },
  /** Headings/H4/Semibold — 18/30 600 */
  h4: { fontFamily: FONT, fontSize: 18, lineHeight: '30px', fontWeight: 600 },
  /** Headings/H6/Semibold — 14/20 600 (a Card/Overview count) */
  h6: { fontFamily: FONT, fontSize: 14, lineHeight: '20px', fontWeight: 600 },
  /** Headings/H7/Regular — 12/15 400 (the Sub Nav entity "level" line) */
  h7: { fontFamily: FONT, fontSize: 12, lineHeight: '15px', fontWeight: 400 },
} as const;

// ─── Color ───────────────────────────────────────────────────────────────────
export const color = {
  /** Primary Colors/color 1 · button/{solid,flat,link}/primary/resting-text */
  primary: '#1f6aac',
  /** table/cell/value/main-text · tree-list/item/text · status/solid/text */
  text: '#0b1528',
  /** table/header/text · field/value/placeholder-text · pagination/additional-text */
  textMuted: '#576581',
  /** field/value/non-clickable-icon · table/header/sorting/disabled-state */
  iconMuted: '#949daf',
  /** tree-list/item/icon · favorite/resting-inactive-icon · control/checkbox/resting-border */
  iconFaint: '#c2cad8',

  /** header-top/default-border · field/input/default-resting-border */
  border: '#dce1eb',
  /** header-top/crumb/border · header-top/default-border (General Nav 3977:115987) */
  crumbBorder: '#dee1e6',
  /** table/cell/resting-border · table/header/border · splitter-bar/border */
  borderSubtle: '#f2f4fa',
  /** button/outline/secondary/resting-border */
  borderSecondary: '#d0e5f6',

  /** page/bg · field/input/resting-bg */
  pageBg: '#f8faff',
  /** navigation-tree/bg · header-top/bg */
  panelBg: '#f2f4fa',
  /** toolbar/bg */
  toolbarBg: '#e5f1fb',
  /** table/bg */
  white: '#ffffff',

  /** tree-list/item/single-selection-selected-bg */
  treeSelectedBg: '#d0e5f6',
  // Navigation — DS - Advanced | IN PROGRESS | 2.0, node 86:184835
  /** navigation-main/bg */
  navBg: '#1f6aac',
  /** navigation-main/item/hover-bg */
  navHoverBg: '#164b7a',
  /** navigation-main/item/selected-bg */
  navSelectedBg: '#113a5f',
  /** navigation-main/item/icon-container/icon · navigation-main/item/main-text */
  navIcon: '#ffffff',
  /** navigation-main/item/icon-container/level-border — 2nd-level accent bar */
  navLevelBorder: '#5391c6',

  // Navigation, "alter" (light) theme
  /** navigation-main/alter-bg */
  navAlterBg: '#f8faff',
  /** navigation-main/item/alter-hover-bg */
  navAlterHoverBg: '#e5f1fb',
  /** navigation-main/item/alter-selected-bg */
  navAlterSelectedBg: '#d0e5f6',
  /** navigation-main/item/alter-main-text */
  navAlterText: '#0b1528',
  /** navigation-main/item/icon-container/alter-icon */
  navAlterIcon: '#949daf',
  /** navigation-main/item/icon-container/alter-level-border */
  navAlterLevelBorder: '#1f6aac',

  /** controls/view-switcher/selected-bg */
  switcherSelectedBg: '#4c88bd',

  // Page header + view chips — Design Patterns | IN PROGRESS | 2.0, node 2021:8233
  /** header/bg */
  pageHeaderBg: '#f2f4fa',
  /** header/page/text */
  pageHeaderText: '#0b1528',
  /** button/outline/primary/resting-{text,border} */
  outlinePrimary: '#1f6aac',
  /** button/outline/tertiary/selected-bg · selected-border */
  chipSelectedBg: '#5391c6',
  /** button/outline/tertiary/selected-text */
  chipSelectedText: '#ffffff',
  /** button/outline/tertiary/resting-text */
  chipRestingText: '#1f6aac',
  /** button/outline/tertiary/resting-border */
  chipRestingBorder: '#dce1eb',

  /** status/solid/orange */
  statusOrange: '#f2cea4',

  // Button/Flat — DS - Base | IN PROGRESS | 2.0, Toolbars node 11403:85686.
  // In a Toolbar the whole flat button (icon *and* label) takes the tone color.
  /** button/flat/primary/resting-text */
  flatPrimaryText: '#1f6aac',
  /** button/flat/success/resting-text */
  flatSuccessText: '#25861e',
  /** button/flat/error/resting-text */
  flatErrorText: '#d23c2d',
  /** surface/surface-subtlest — flat-button hover surface */
  surfaceSubtlest: '#ffffff',
  /** button/flat/primary/hover-bg */
  flatPrimaryHoverBg: '#d0e5f6',
  /** button/flat/primary/{pressed,selected}-bg */
  flatPrimaryPressedBg: '#5391c6',
  /** button/flat/primary/{pressed,selected}-text */
  flatPrimaryPressedText: '#ffffff',

  // Top header — DS - Advanced | IN PROGRESS | 2.0, Header Top node 86:154743
  /** header-top/bg — the header bar is NOT white */
  headerBg: '#f2f4fa',
  /** header-top/crumb/end-crumb-text */
  crumbEndText: '#0b1528',
  /** button/link/base/resting-text — crumb label AND crumb value */
  linkBaseText: '#576581',
  /** button/flat/base/resting-text — the crumb caret */
  flatBaseText: '#576581',
  /** chip/solid/base/resting-bg · resting-border */
  chipSolidBaseBg: '#dce1eb',
  /** chip/solid/info/resting-bg — the offering badge's fill */
  chipSolidInfoBg: '#c5e7fd',
  /** bg/accent/blue/solid/subtlest/resting — its 1px border, lighter than the fill */
  chipSolidInfoBorder: '#e3f4ff',
  /**
   * The info chip's label. The DS pairs status/flat/blue (#367ca0) with
   * chip/solid/info/resting-bg (#c5e7fd), which measures **3.57:1** — under AA
   * for a 12px semibold label. The fill is kept exactly; only the label is
   * darkened along the same hue, to 5.81:1. Same treatment as the Card/Overview
   * labels on their accent fills.
   */
  chipSolidInfoText: '#255a74',
  /** chip/resting-main-text */
  chipSolidBaseText: '#0b1528',

  // Button/Outline tertiary — DS - Advanced | IN PROGRESS | 2.0, node 86:208952
  /** button/outline/tertiary/resting-bg — transparent, NOT white */
  outlineTertiaryBg: 'transparent',
  /** button/outline/tertiary/resting-border */
  outlineTertiaryBorder: '#dce1eb',
  /** button/outline/tertiary/resting-text */
  outlineTertiaryText: '#1f6aac',

  // Table cell states — DS - Advanced | IN PROGRESS | 2.0, Table node 86:208584
  /** table/cell/hover-bg */
  cellHoverBg: '#e5f1fb',
  /** table/cell/selected-bg */
  cellSelectedBg: '#d0e5f6',
  /** table/cell/qv-selected-bg */
  cellQvSelectedBg: '#e5f1fb',
  /** table/cell/qv-selected-border */
  cellQvSelectedBorder: '#1f6aac',
  /** table/header/sorting/active-state */
  headerSortActive: '#1f6aac',
  /** table/header/sorting/disabled-state */
  headerSortDisabled: '#949daf',
  /** table/cell/value/additional-text */
  cellAdditionalText: '#576581',

  // Document preview — eTMF node 32984:13253
  /** header/doc/main-text */
  docHeaderText: '#0b1528',
  /** id/resting-text · id/resting-icon */
  idText: '#576581',
  idIcon: '#1f6aac',
  /** header/doc/additional-text — the "Generated Name" / "Submitted Name" labels */
  docHeaderAdditionalText: '#576581',
  /** header/doc/icon-discructive [sic] */
  docHeaderIconDestructive: '#d23c2d',
  /** status/flat/purple */
  statusFlatPurple: '#7349aa',
  /** bg/accent/purple/solid/subtlest/selected — light, true violet (not the pink-leaning status purple) */
  accentPurpleSelected: '#dcc8f5',
  /** bg/accent/purple/solid/saturated/resting */
  accentPurpleSaturated: '#7349aa',
  /** Readable text on the light violet fills */
  accentPurpleText: '#4b2d70',
  /** status/solid/green */
  statusSolidGreen: '#c0dcbf',
  /** status/solid/red */
  statusSolidRed: '#f3bfb8',
  /** status/solid/grey */
  statusSolidGrey: '#dce1eb',
  /** status/solid/purple */
  statusSolidPurple: '#dcc8f5',
  /** status/solid/pink */
  statusSolidPink: '#edc7e9',
  /** status/solid/blue */
  statusSolidBlue: '#aadaf7',
  /** status/solid/yellow */
  statusSolidYellow: '#f7e8ba',
  /** status/flat/green */
  statusFlatGreen: '#25861e',
  /** status/flat/blue */
  statusFlatBlue: '#367ca0',
  /** status/flat/grey · status/flat/orange */
  statusFlatGrey: '#576581',
  statusFlatOrange: '#af620b',
  /** button/outline/success/resting-{text,border} */
  outlineSuccess: '#25861e',
  /** button/outline/warning/resting-text · resting-border */
  outlineWarningText: '#af620b',
  outlineWarningBorder: '#d1862e',
  /** button/outline/error/resting-{text,border} */
  outlineError: '#d23c2d',
  /** qv-panel/navigation/bg */
  qvNavBg: '#f8faff',
  /** qv-panel/navigation/item/resting-icon · resting-main-text */
  qvNavRestingIcon: '#1f6aac',
  qvNavRestingText: '#0b1528',
  /** qv-panel/navigation/item/selected-bg · selected-icon · selected-main-text */
  qvNavSelectedBg: '#5391c6',
  qvNavSelectedText: '#ffffff',
  /** tabs/main-{selected,resting,hover}-text · tabs/underline-selected-bg */
  tabsSelectedText: '#0b1528',
  tabsRestingText: '#1f6aac',
  tabsHoverText: '#1f6aac',
  tabsUnderline: '#1f6aac',
  /** tabs/hover-bg — applies to hovered tabs whether or not they are selected */
  tabsHoverBg: '#e5f1fb',
  /** tabs/dragging-bg */
  tabsDraggingBg: '#ffffff',
  /** tabs/counter-text */
  tabsCounterText: '#0b1528',
  /** progress-bar/main-bg · bg/accent/orange/solid/saturated/resting */
  progressTrack: '#dce1eb',
  progressOrange: '#d1862e',
  /** system-message/{neutral-bg,info-icon,description-text} */
  sysMsgBg: '#f2f4fa',
  sysMsgIcon: '#1f6aac',
  sysMsgText: '#576581',

  // Button Group — eTMF node 34312:227297
  /** button-group/border */
  buttonGroupBorder: '#dce1eb',
  /** button/solid/tertiary/selected-{bg,border,text} */
  solidTertiarySelectedBg: '#5391c6',
  solidTertiarySelectedText: '#ffffff',
  /** button/solid/tertiary/resting-{bg,border,text} */
  solidTertiaryRestingBg: '#ffffff',
  solidTertiaryRestingText: '#1f6aac',

  /** counter/primary-solid/critical/bg · indicator/bg · text/distructive */
  critical: '#d23c2d',
  /** avatar/textbase-bg-orange · text/warning-subtle */
  avatarOrange: '#d1862e',

  // Row glyph colors
  /** text/informational */ informational: '#367ca0',
  /** text/confirmation  */ confirmation: '#25861e',
  /** text/discover      */ discover: '#7349aa',
  /** text/brand-saturated */ brand: '#1f6aac',
} as const;

// ─── Geometry ────────────────────────────────────────────────────────────────
/** header-top/* — DS - Advanced | IN PROGRESS | 2.0, Header Top node 86:154743 */
export const header = {
  height: 60,
  borderWidth: 1,
  /** header-top/action/{padding-x,icon-size,height} */
  actionPaddingX: 15,
  actionIconSize: 30,
  actionHeight: 60,
  /** header-top/action/role-gap-xs — the role badge overlaps the avatar */
  roleGapXs: -5,
  crumbWidth: 60,
  crumbLineWidth: 10,
  crumbBorderWidth: 1,
  /** header-top/crumb/width — used as the crumb's height */
  crumbHeight: 60,
  crumbGapXs: 5,
  crumbGapS: 10,
  crumbGapM: 15,
  /**
   * From the Figma component description on Top Header/Crumb (86:154864):
   * "The maximum entity title length is 21 symbols after which it should be truncated"
   */
  entityTitleMaxChars: 21,
  /** header-top/crumb/inner-padding-{left,right}-x */
  crumbInnerPaddingX: 10,
  logoHeight: 40,
} as const;

/** navigation-main/* — DS - Advanced | IN PROGRESS | 2.0, node 86:184835 */
export const nav = {
  collapsedWidth: 60,
  expandedWidth: 240,
  /** navigation-main/item/icon-container/width */
  itemWidth: 60,
  /** navigation-main/item/min-1st-level-height */
  itemMinHeight: 30,
  /** navigation-main/item/max-1st-level-height */
  itemMaxHeight: 50,
  /** navigation-main/item/min-2nd-level-height / max-2nd-level-height */
  item2ndMinHeight: 30,
  item2ndMaxHeight: 40,
  bottomItemHeight: 45,
  gap: 15,
  paddingY: 15,
  /** navigation-main/logo-container/{height,padding-x,gap} */
  logoHeight: 55,
  logoPaddingX: 15,
  logoGap: 5,
  /**
   * navigation-main/item/icon-container/icon-size-s is the CONTAINER (20); the
   * glyph inside it is Icons/solid/s (15). Sizing the glyph to 20 is the
   * mistake this token name invites.
   */
  iconBox: 20,
  glyph: 15,
  /** navigation-main/item/icon-container/level-border-width */
  levelBorderWidth: 2,
  /** sizes/radius/xs */
  radius: 5,
} as const;

/**
 * navigation-sub/* — DS - Advanced | IN PROGRESS | 2.0, Sub Nav "Navigation /
 * Type=Expand" node 86:198815. Resolved with get_variable_defs on that node.
 */
export const subNav = {
  /** navigation-sub/{width,min-width,max-width} — min-width is the collapsed rail */
  width: 250,
  collapsedWidth: 60,
  maxWidth: 250,
  /** navigation-sub/gap */
  gap: 0,
  /** navigation-sub/inner-min-width */
  innerMinWidth: 150,
  /** splitter-bar/border-width */
  splitterBorderWidth: 1,

  /** navigation-sub/header/* */
  headerPaddingX: 15,
  /** navigation-sub/header/padding-y-top-s */
  headerPaddingTop: 15,
  /** navigation-sub/header/button-off-padding-y-top — no Back Button on this screen */
  headerPaddingTopButtonOff: 30,
  headerGapXs: 5,
  headerGapM: 15,
  headerBorderWidth: 1,
  /** navigation-sub/header/border */
  headerBorder: '#f2f4fa',
  /** navigation-sub/header/title-text */
  headerTitleText: '#0b1528',
  /** navigation-sub/header/additional-text */
  headerAdditionalText: '#576581',

  /** navigation-sub/item/* */
  itemMinHeight: 40,
  itemMaxHeight: 60,
  /** navigation-sub/item/paddings-y */
  itemPaddingX: 15,
  /** navigation-sub/item/gap-x-s — icon → label */
  itemGapS: 10,
  /** navigation-sub/item/gap-x-xs — label block → trailing counter */
  itemGapXs: 5,
  /**
   * navigation-sub/item/icon-size is the icon CONTAINER (20). The glyph inside
   * it is Icons/solid/s — 15px. Sizing the glyph itself to 20 is the mistake
   * this component invites.
   */
  itemIconBox: 20,
  itemGlyph: 15,
  /** navigation-sub/item/{resting,hover,selected}-icon — the same grey in every state */
  itemIcon: '#949daf',
  /** navigation-sub/item/{resting,hover,selected}-text — the same dark in every state */
  itemText: '#0b1528',
  /** navigation-sub/item/resting-additional-text */
  itemAdditionalText: '#576581',
  /** navigation-sub/item/selected-bg */
  itemSelectedBg: '#d0e5f6',
  /** navigation-sub/item/hover-bg */
  itemHoverBg: '#e5f1fb',
  /** Effect "Focus-inner" — elevation/focus/inner/*, a white 3px ring inside a brand 2px one */
  focusShadow: 'inset 0 0 0 3px #ffffff, inset 0 0 0 2px #1f6aac',
} as const;

/** avatar/* — Graphics/Avatar as used by the Sub Nav header (86:198815) */
export const avatar = {
  /** avatar/min-{width,height} is 40; the Sub Nav header draws it at 60 */
  size: 60,
  minSize: 40,
  /** avatar/square-radius */
  squareRadius: 5,
  /** avatar/round-radius — a person, rather than a study or a site */
  roundRadius: 100,
  /** avatar/default-border-width · default-border */
  borderWidth: 1,
  border: '#f2f4fa',
  /**
   * avatar/iconbased-bg · avatar/icon · avatar/icon-size-m. As with the nav
   * item, icon-size-m (30) is the container; the glyph in it is Icons/regular/m
   * — 20px.
   */
  iconBasedBg: '#fafcff',
  icon: '#1f6aac',
  iconBoxM: 30,
  iconGlyphM: 20,
} as const;

/** navigation-tree/* · tree-list/* */
export const tree = {
  width: 300,
  minWidth: 300,
  maxWidth: 500,
  /** tree-list/item/height */
  rowHeight: 35,
  /**
   * tree-list/item/level-{0,,2}-padding-left-x — 0 / 15 / 30. The indent is the
   * ROW's own left padding; the caret slot then sits inside it, so a level-0 row
   * starts flush with the tree body's padding.
   */
  level0PaddingLeft: 0,
  levelStep: 15,
  /** The Tree/Row instances sit 15 in from the panel's left edge, flush right. */
  bodyPaddingLeft: 15,
  /** tree-list/item/padding-{left,right}-x — on the Container, not the row */
  itemPaddingLeft: 5,
  itemPaddingRight: 15,
  /** tree-list/item/{inner-gap,outer-gap,radius} */
  innerGap: 5,
  outerGap: 0,
  radius: 5,
  /**
   * tree-list/item/icon-size is the container (20); the glyph in it is
   * Icons/solid/s (15). Same for the caret's Button/Flat icon box.
   */
  iconBox: 20,
  glyph: 15,
  /** Button/Flat — padding 1/2 around a 20px icon box */
  caretWidth: 24,
  caretHeight: 22,
  bodyPaddingTop: 15,
  topPaddingX: 15,
  topGap: 15,
  viewByHeight: 30,
} as const;

/** header/* — the page header row (Design Patterns | IN PROGRESS | 2.0, node 2021:8233) */
export const pageHeader = {
  paddingX: 15,
  paddingY: 10,
  /** header/page/gap-x-m · sizes/gap/m */
  gapM: 15,
  /** sizes/gap/s */
  gapS: 10,
  borderWidth: 0.5,
} as const;

/** chip/* — the optional "offering" badge inside a crumb */
export const chip = {
  roundRadius: 100,
  borderWidth: 1,
  /** chip/gap */
  gap: 5,
  smallPaddingX: 5,
  smallPaddingY: 2.5,
  mediumMinWidth: 25,
  labelMaxWidth: 170,
} as const;

/** button/solid/* + button/outline/* + button/flat/* geometry */
export const button = {
  radius: 5,
  borderWidth: 1,
  /** button/flat/{padding-x,padding-y,gap,radius,border-width} */
  flatPaddingX: 2,
  flatPaddingY: 1,
  flatGap: 5,
  flatRadius: 5,
  flatBorderWidth: 1,
  /** button/solid/icon-size-s — the icon container; the glyph itself is icons/solid/s (15) */
  iconBoxS: 20,
  mediumPaddingX: 15,
  mediumPaddingY: 5,
  /** button/solid/solid-outline-medium-minwidth */
  mediumMinWidth: 75,
  /** button/medium-max-label-width */
  mediumMaxLabelWidth: 200,
  smallPaddingX: 10,
  smallPaddingY: 5,
  /**
   * Elevation/buttons/solid/resting-shadow —
   * button/solid/resting-shadow-{x,y,blur,spread,color}
   */
  solidShadow: '0px 2px 15px 0px rgba(11, 21, 40, 0.1)',
  /** button/solid/solid-outline-small-min-width */
  smallMinWidth: 45,
  iconBtnPaddingX: 5,
} as const;

/** toolbar/* — DS - Base | IN PROGRESS | 2.0, node 11403:85686 */
export const toolbar = {
  height: 40,
  minWidth: 295,
  paddingX: 15,
  gap: 15,
  radius: 5,
} as const;

/** table/* — DS - Advanced | IN PROGRESS | 2.0, Table node 86:208584 */
export const table = {
  radius: 10,
  /** table/header/{height,padding-left-x,padding-right-x} */
  headerHeight: 40,
  headerPaddingLeft: 15,
  headerPaddingRight: 5,
  headerSortIconSize: 15,

  // Cell density. The grid uses "medium"; small/large are here for other screens.
  /** table/cell/small-{min-height,padding-y} */
  cellSmallMinHeight: 35,
  cellSmallPaddingY: 0,
  /** table/cell/medium-{min-height,padding-y} */
  cellMinHeight: 45,
  cellPaddingY: 5,
  /** table/cell/large-{min-height,padding-y} */
  cellLargeMinHeight: 55,
  cellLargePaddingY: 10,

  cellPaddingLeft: 15,
  cellPaddingRight: 5,
  /** table/cell/disabled-opacity (percent) */
  cellDisabledOpacity: 40,
  gap: 5,

  // Fixed column widths
  colCheckbox: 35,
  colEntity: 45,
  colMoreButton: 45,
  colFavorite: 35,
  /** table/column-4-icon-width — the row-glyph column */
  col4Icon: 95,
  colMinWidth: 100,
  colMaxWidth: 400,
} as const;

/** pagination/* */
export const pagination = {
  pageInputWidth: 35,
  gapXs: 5,
  gapM: 15,
  paddingX: 15,
  paddingTop: 5,
  paddingBottom: 15,
} as const;

/**
 * filter/* — DS - Advanced | IN PROGRESS | 2.0, Filter node 84:32782.
 * A filter is a remove button + a semibold muted LABEL + a regular dark VALUE
 * + a caret, inside a 30px pill padded by 5 — not a 5/15 button with one
 * uniform text colour.
 */
export const filter = {
  height: 30,
  paddingX: 5,
  gap: 5,
  radius: 5,
  borderWidth: 1,
  border: '#dce1eb',
  /** filter/resting-bg is transparent */
  hoverBg: '#e5f1fb',
  /** filter/{selected,pressed}-bg */
  selectedBg: '#d0e5f6',
  /** filter/label-text — Body/Semibold */
  labelText: '#576581',
  /** filter/value-text — Body/Regular */
  valueText: '#0b1528',
  labelMaxWidth: 200,
  valueMaxWidth: 200,
  /** filter/icon · filter/icon-size (the box; the glyph is Icons/solid/s 15) */
  icon: '#1f6aac',
  iconBox: 20,
  glyph: 15,
} as const;

/** menu/* · menu/filter-menu/* — the panel a filter opens */
export const menu = {
  radius: 5,
  bg: '#ffffff',
  paddingXY: 10,
  gapYS: 10,
  filterMinWidth: 300,
  filterMaxWidth: 350,
  selectionMaxHeight: 320,
  /** Effect "Menu" — menu/shadow-1-* over shadow-2-* */
  shadow: '0px 7px 25px 0px rgba(11,21,40,0.1), 0px 0px 0px 1px rgba(11,21,40,0.03)',
  /** menu/base/list/row/* */
  rowMinHeight: 35,
  rowRadius: 5,
  rowPaddingY: 5,
  rowGap: 5,
  rowHoverBg: '#e5f1fb',
  rowText: '#0b1528',
  /** menu/base/footer/* */
  footerBg: '#f8faff',
  footerBorder: '#f2f4fa',
  footerPaddingXY: 10,
  footerGap: 15,
} as const;

/**
 * chip/outline/* — DS - Base | IN PROGRESS | 2.0, Chip node 11712:23840.
 * A chip is a SQUARE-radius (5) outline: transparent fill, a tone-coloured
 * 1px border and glyph, and Body/Semibold text. Hover fills it with the tone,
 * selected goes solid with white contents.
 */
export const chipOutline = {
  /** chip/square-radius · chip/round-radius — the component has both shapes */
  squareRadius: 5,
  roundRadius: 100,
  borderWidth: 1,
  gap: 5,
  paddingX: 5,
  paddingY: 2.5,
  /** chip/icon-size-s is the container; the glyph is Icons/solid/s (15) */
  iconBox: 20,
  glyph: 15,
  labelMaxWidth: 200,
  /** chip/medium-min-width — a one-character chip still holds this width */
  minWidth: 25,
  disabledOpacity: 40,
  /** chip/{resting,hover}-main-text · chip/selected-main-text */
  text: '#0b1528',
  selectedText: '#ffffff',
  theme: {
    base: { icon: '#1f6aac', border: '#dce1eb', hoverBg: '#c2cad8', selectedBg: '#949daf' },
    info: { icon: '#367ca0', border: '#c5e7fd', hoverBg: '#aadaf7', selectedBg: '#4bace8' },
    success: { icon: '#25861e', border: '#c0dcbf', hoverBg: '#d3e7d2', selectedBg: '#519e4b' },
    warning: { icon: '#d1862e', border: '#f2cea4', hoverBg: '#f2cea4', selectedBg: '#da9e58' },
    error: { icon: '#d23c2d', border: '#f3bfb8', hoverBg: '#f3bfb8', selectedBg: '#db6357' },
  },
} as const;

/**
 * Card/Overview — DS - Advanced | IN PROGRESS | 2.0, node 14601:151877, as
 * doa-log's cross-module check builds it.
 *
 * The parts that are easy to get wrong: the LABEL sits on top and the count
 * under it (not the other way round), the count is Headings/H6/Semibold 14/20
 * — a DS count, not a display number — and Selected is a FILL with a
 * same-colour 2px halo, never a brand ring (that is the separate focus
 * variant). Highlighted=On adds a 2px left rule in the accent's saturated tone.
 */
export const card = {
  radius: 5,
  padding: 10,
  /** card/overview/between-card-gap */
  gap: 10,
  /** card/border-width — the accent rule on the left edge */
  borderWidth: 2,
  /** card/gap-y-1 — label to value row */
  valueGap: 5,
  /** card/overview/icon-size */
  iconSize: 20,
  bg: '#ffffff',
  hoverBg: '#e5f1fb',
  selectedBg: '#d0e5f6',
  /** card/overview/{label,main-text} */
  label: '#576581',
  text: '#0b1528',
  /** Card/Resting · card/hover-shadow — the card lifts on hover */
  shadow: '0 0 0 1px #0b152808, 0 2px 15px #0b15281a',
  hoverShadow: '0 0 0 1px #0b152808, 0 17px 45px #0b15281a',
  /** bg/accent/<hue>/solid/{subtlest, subtlest-hover, subtlest-selected, saturated} */
  accent: {
    neutral: { bg: '#ffffff', hover: '#e5f1fb', selected: '#d0e5f6', bar: 'transparent' },
    green: { bg: '#e9f3e9', hover: '#d3e7d2', selected: '#c0dcbf', bar: '#25861e' },
    orange: { bg: '#f9f0e7', hover: '#f5e1ce', selected: '#f2cea4', bar: '#d1862e' },
    purple: { bg: '#f4eefa', hover: '#e9def4', selected: '#dcc8f5', bar: '#7349aa' },
  },
} as const;

/**
 * dialog/* — DS - Advanced | IN PROGRESS | 2.0, node 35:11233, as doa-log's
 * change-log dialog builds it.
 */
export const dialog = {
  bg: '#f8faff',
  radius: 10,
  /** sizes/dialog/width-m, capped at 90vw */
  widthM: 800,
  /** dialog/titlebar/gap-m */
  titlebarGap: 15,
  /** dialog/titlebar/paddings-{y,x} — and no rule under it: titlebar/border is transparent */
  titlebarPaddingY: 15,
  titlebarPaddingX: 30,
  /** dialog/titlebar/x-size — the close BOX; the glyph inside is Icons/solid/s */
  titlebarXSize: 20,
  /** dialog/content/{margin-x,margin-y,padding-y,radius,bg} — a white panel inset from the dialog */
  contentInset: 15,
  contentPaddingY: 15,
  contentRadius: 5,
  contentBg: '#ffffff',
  /** dialog/footer/{paddings-y,paddings-x,gap-x-m,bg} — no rule above it either */
  footerPaddingY: 15,
  footerPaddingX: 30,
  footerGap: 15,
  footerBg: '#f8faff',
  /** dialog/extralarge-large-{min-width,max-width,max-height} */
  largeMinWidth: 800,
  maxWidth: 1400,
  maxHeight: 900,
  /** dialog/min-height */
  minHeight: 200,
  overlayBg: '#0b152899',
  shadow: '0 17px 45px rgba(11,21,40,0.1), 0 0 0 1px rgba(11,21,40,0.03)',
} as const;

/** status/* */
export const status = {
  radius: 5,
  paddingX: 5,
  gap: 5,
  labelMaxWidth: 200,
} as const;

/** control/checkbox/* */
/** control/checkbox/* — DS Base 11252:112938 */
export const checkbox = {
  size: 15,
  radius: 2,
  borderWidth: 1,
  /** control/checkbox/icon-size — the tick glyph inside the 15px box */
  iconSize: 15,
  restingBg: '#ffffff',
  restingBorder: '#c2cad8',
  hoverBg: '#ffffff',
  hoverBorder: '#1f6aac',
  selectedBg: '#1f6aac',
  selectedBorder: '#1f6aac',
  selectedHoverBg: '#164b7a',
  selectedHoverBorder: '#164b7a',
  icon: '#ffffff',
  /** control/checkbox/selected-disabled-opacity */
  disabledOpacity: 40,
} as const;

/** page/* */
export const page = { paddingX: 15, paddingY: 15 } as const;

/** Document preview — eTMF node 32984:13253 */
/**
 * header/doc/* — DS - Advanced | IN PROGRESS | 2.0, Header/Doc node 86:146439.
 * Row gap is header/padding-y (10); gapXs/gapXM are the within-row gaps.
 */
export const docHeader = { gapXs: 5, gapXM: 15, iconSize: 20, rowGap: 10 } as const;

/**
 * id/* — the record-id pill. The DS component resolves these to 1/1/2; the eTMF
 * product frame resolves the same variables to 5/2.5/5 under its own mode. The
 * DS is the source of truth for the component, so these follow it.
 */
export const idPill = { paddingX: 1, paddingY: 1, radius: 100, gap: 2, iconSize: 15 } as const;

/** qv-panel/* */
export const qvPanel = {
  navWidth: 75,
  navItemMinHeight: 75,
  navItemPaddingXY: 5,
  navItemGap: 0,
  navItemIconSize: 30,
  width: 600,
  minWidth: 400,
  maxWidth: 900,
} as const;

/** tabs/* */
export const tabs = {
  height: 30,
  gap: 5,
  paddingX: 2,
  radius: 5,
  /** The underline is its own absolutely-positioned bar, 5px below the Tab Part */
  underlineWidth: 2,
  underlineRadius: 100,
  underlineOffset: -5,
  disabledOpacity: 0.4,
  rowGapXM: 15,
  rowGapYXs: 5,
  maxLabelWidth: 300,
} as const;

/** progress-bar/* (small) */
export const progressBar = { height: 10, radius: 100, gap: 5 } as const;

/** system-message/* */
export const sysMsg = {
  paddingXY: 15,
  radius: 5,
  gapXs: 5,
  gapS: 10,
  iconSize: 15,
  minWidth: 180,
  maxWidth: 790,
} as const;

/** button-group/* — the segmented toggle */
export const buttonGroup = { borderWidth: 1, radius: 5 } as const;

/** indicator/* — the small red dot badge */
export const indicator = {
  size: 10,
  maxSize: 15,
  radius: 100,
  borderWidth: 2,
  /** Offsets when pinned to a Tab Part */
  offsetRight: -6,
  offsetTop: -4,
} as const;

/**
 * splitter-bar/* — DS - Advanced | IN PROGRESS | 2.0, Splitter Bar as used by
 * the Sub Nav / Tree (resting values from node 86:198928, hover from 86:198938).
 */
export const splitter = {
  borderWidth: 1,
  /**
   * The DS's own splitter-bar/border is #f2f4fa — the same value as
   * navigation-{tree,sub}/bg, so a 1px line of it against either panel cannot
   * be seen at all. header-top/default-border (#dce1eb) is visible but reads
   * too heavy for a panel edge, so this sits between the two: a hairline that
   * separates the sub nav and the tree without drawing a hard rule.
   */
  border: '#e7eaf3',
  /** splitter-bar/action/* — the OPEN/CLOSE pill */
  actionRestingWidth: 20,
  actionHoverWidth: 30,
  actionHeight: 75,
  actionRadius: 5,
  actionGap: 5,
  actionRestingBg: '#1f6aac',
  actionHoverBg: '#164b7a',
  actionIcon: '#ffffff',
  actionText: '#ffffff',
  /** splitter-bar/action/icon-size — a 15px box holding an Icons/solid/s glyph */
  actionIconSize: 15,
  /** splitter-bar/bottom/* — the rail under the pill */
  bottomRestingBg: '#edf5fb',
  bottomHoverBg: '#e5f1fb',
  bottomIcon: '#1f6aac',
  bottomText: '#1f6aac',
  /** splitter-bar/bottom/icon-size (15) around an Icons/solid/xs glyph (12) */
  bottomIconSize: 15,
  bottomGlyph: 12,
  bottomGap: 5,
  bottomPaddingTop: 15,
  nuggetWidth: 1,
  nuggetHeight: 50,
  nuggetRadius: 100,
  nuggetBg: '#1f6aac',
} as const;

/** favorite/icon-size-m */
export const favorite = { iconSizeM: 30, radius: 5 } as const;

/** favorite/resting-active-icon — the gold of a starred entity (General Nav 3977:115987) */
export const favoriteActiveIcon = '#f0d37e';

/** icons/solid/* — s renders 15px glyph inside a 20px box */
export const icon = { xs: 12, s: 15, m: 20, boxS: 20 } as const;

/**
 * Waffle menu — Origami | PROD | 10.9, node 26748:27643. The app switcher's
 * panel: a 300-wide sidebar of the client's products, and the details panel
 * that only Links opens.
 */
export const waffle = {
  /** sizes/radius/m · sizes/gap/m · the Dialog effect the panel carries */
  radius: 15,
  padding: 15,
  gap: 15,
  shadow: '0 17px 45px rgba(11,21,40,0.1), 0 0 0 1px rgba(11,21,40,0.03)',
  sidebarWidth: 300,
  detailsWidth: 480,
  /** The client header is one 50px row — avatar/min-width is 40, drawn at 50 */
  headerHeight: 50,
  titleGap: 5,
  /** app chip main — 300×70 rows, 5 apart, with a 50px tile at radius-s */
  rowHeight: 70,
  rowStackGap: 5,
  rowGap: 10,
  rowPaddingX: 10,
  tileSize: 50,
  linkTileSize: 40,
  /** sizes/radius/s */
  tileRadius: 10,
  /** bg/neutral/solid/subtle/resting — the chosen row, and Button/Solid base */
  rowSelectedBg: '#f2f4fa',
  settingsBg: '#f2f4fa',
  /** bg/accent/blue/solid/subtlest/resting · avatar/icon */
  blueTile: '#e3f4ff',
  blueIcon: '#1f6aac',
  /** bg/accent/pink/solid/subtlest/resting · text/accent-pink */
  pinkTile: '#f8eef6',
  pinkIcon: '#b451a2',
  /** bg/accent/aqua/solid/subtlest/resting · text/accent-aqua */
  aquaTile: '#ebf5f4',
  aquaIcon: '#2a7c77',
} as const;
