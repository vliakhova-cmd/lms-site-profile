import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { color, type, button as btn, filter as f, menu as m, checkbox as cb, icon } from './tokens';

// Filter — DS - Advanced | IN PROGRESS | 2.0, node 84:32782.
//
// The pill is four parts, and the two text parts are NOT styled alike:
//   [remove ✕] [Label — Body/Semibold, filter/label-text #576581]
//              [Value — Body/Regular, filter/value-text #0b1528] [caret]
// inside a 30px pill with filter/padding-x 5 and filter/gap 5. Resting is
// transparent with a #dce1eb rule; hover is #e5f1fb and an open/selected
// filter is #d0e5f6.
//
// Opening one gives the filter menu: a condition row, a search, the value
// count, a checkbox list capped at menu/filter-menu/selection-items-max-height,
// and a Cancel/Apply footer on menu/base/footer/bg.

/** control/checkbox — 15×15, radius 2, 1px #c2cad8 */
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: cb.size,
        height: cb.size,
        borderRadius: cb.radius,
        border: `${cb.borderWidth}px solid ${checked ? cb.selectedBorder : cb.restingBorder}`,
        backgroundColor: checked ? cb.selectedBg : cb.restingBg,
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M1 5.2L3.6 7.8L9 2.2" stroke={cb.icon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/** A 20px filter/icon-size box around an Icons/solid/s (15) glyph */
function FilterGlyph({ glyph }: { glyph: typeof faAngleDown }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: f.iconBox, height: f.iconBox, flexShrink: 0 }}>
      <FontAwesomeIcon icon={glyph} style={{ width: f.glyph, height: f.glyph, color: f.icon }} />
    </span>
  );
}

function MenuButton({ label, primary = false, onClick }: { label: string; primary?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: btn.mediumMinWidth,
        padding: `${btn.mediumPaddingY}px ${btn.mediumPaddingX}px`,
        border: `${btn.borderWidth}px solid ${primary ? color.primary : color.border}`,
        borderRadius: btn.radius,
        backgroundColor: primary ? color.primary : color.white,
        color: primary ? color.white : color.primary,
        cursor: 'pointer',
        ...type.button,
      }}
    >
      {label}
    </button>
  );
}

function FilterMenu({
  options,
  value,
  onApply,
  onCancel,
}: {
  options: string[];
  value: string;
  onApply: (v: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(value);
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  const shown = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        marginTop: 4,
        zIndex: 20,
        minWidth: m.filterMinWidth,
        maxWidth: m.filterMaxWidth,
        backgroundColor: m.bg,
        borderRadius: m.radius,
        boxShadow: m.shadow,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: m.gapYS, padding: m.paddingXY }}>
        {/* Condition */}
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            alignItems: 'center',
            gap: btn.flatGap,
            padding: `${btn.flatPaddingY}px ${btn.flatPaddingX}px`,
            border: `${btn.flatBorderWidth}px solid transparent`,
            borderRadius: btn.flatRadius,
            background: 'transparent',
            color: color.flatPrimaryText,
            cursor: 'pointer',
            ...type.buttonSmall,
          }}
        >
          Is
          <FontAwesomeIcon icon={faAngleDown} style={{ width: 11, height: 11 }} />
        </button>

        {/* Search — field/input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            height: 30,
            padding: '0 5px',
            backgroundColor: color.pageBg,
            borderBottom: `1px solid ${color.border}`,
            borderRadius: '5px 5px 0 0',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: f.iconBox, height: f.iconBox, flexShrink: 0 }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: icon.s, height: icon.s, color: color.iconMuted }} />
          </span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            autoFocus
            style={{ flex: '1 0 0', minWidth: 0, border: 'none', outline: 'none', background: 'transparent', ...type.body, color: color.text }}
          />
        </div>

        {/* Values counter — table/counter */}
        <span style={{ ...type.bodyBold, color: color.text }}>{shown.length} Values</span>

        {/* Selection list */}
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: m.selectionMaxHeight, overflowY: 'auto' }}>
          {shown.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setDraft(opt)}
              onMouseEnter={() => setHovered(opt)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: m.rowGap,
                minHeight: m.rowMinHeight,
                padding: `${m.rowPaddingY}px`,
                border: 'none',
                borderRadius: m.rowRadius,
                backgroundColor: hovered === opt ? m.rowHoverBg : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                ...type.body,
                color: m.rowText,
              }}
            >
              <Checkbox checked={draft === opt} />
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: m.footerGap,
          padding: m.footerPaddingXY,
          backgroundColor: m.footerBg,
          borderTop: `1px solid ${m.footerBorder}`,
          borderRadius: `0 0 ${m.radius}px ${m.radius}px`,
        }}
      >
        <MenuButton label="Cancel" onClick={onCancel} />
        <MenuButton label="Apply" primary onClick={() => onApply(draft)} />
      </div>
    </div>
  );
}

function Filter({ label, options }: { label: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [value, setValue] = useState(options[0]);

  // filter/{resting,hover,selected}-bg — an open filter holds the selected fill.
  const bg = open ? f.selectedBg : hover ? f.hoverBg : 'transparent';

  return (
    <div style={{ position: 'relative' }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: f.gap,
          height: f.height,
          padding: `0 ${f.paddingX}px`,
          border: `${f.borderWidth}px solid ${f.border}`,
          borderRadius: f.radius,
          backgroundColor: bg,
          transition: 'background-color 100ms',
        }}
      >
        {/* Remove Filter */}
        <button
          type="button"
          aria-label={`Remove ${label} filter`}
          title="Remove Filter"
          onClick={() => setValue(options[0])}
          style={{ display: 'inline-flex', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <FilterGlyph glyph={faCircleXmark} />
        </button>

        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: f.gap,
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ ...type.bodySemibold, color: f.labelText, maxWidth: f.labelMaxWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          <span style={{ ...type.body, color: f.valueText, maxWidth: f.valueMaxWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
          <FilterGlyph glyph={faAngleDown} />
        </button>
      </div>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 19 }} onClick={() => setOpen(false)} />
          <FilterMenu
            options={options}
            value={value}
            onApply={v => {
              setValue(v);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </>
      )}
    </div>
  );
}

function PerPageControl() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('10');
  const options = ['10', '25', '50'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: f.gap }}>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: f.gap,
            height: f.height,
            padding: `0 ${f.paddingX}px 0 ${btn.mediumPaddingX}px`,
            border: `${f.borderWidth}px solid ${f.border}`,
            borderRadius: f.radius,
            backgroundColor: 'transparent',
            color: f.valueText,
            cursor: 'pointer',
            ...type.body,
          }}
        >
          {value}
          <FilterGlyph glyph={faAngleDown} />
        </button>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 19 }} onClick={() => setOpen(false)} />
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                zIndex: 20,
                minWidth: 60,
                backgroundColor: m.bg,
                borderRadius: m.radius,
                boxShadow: m.shadow,
                padding: 5,
              }}
            >
              {options.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setValue(opt);
                    setOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    minHeight: m.rowMinHeight,
                    padding: `${m.rowPaddingY}px 10px`,
                    border: 'none',
                    borderRadius: m.rowRadius,
                    textAlign: 'left',
                    backgroundColor: opt === value ? m.rowHoverBg : 'transparent',
                    color: m.rowText,
                    cursor: 'pointer',
                    ...type.body,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <span style={{ ...type.body, color: color.textMuted }}>Per Page</span>
    </div>
  );
}

export interface FilterSpec {
  label: string;
  options: string[];
}

export const TRAINING_PLANS_FILTERS: FilterSpec[] = [
  { label: 'Status', options: ['All', 'Pending Enrollment', 'Not Started', 'In Progress', 'Completed', 'N/A'] },
  { label: 'Site', options: ['All', 'Arizona Cardiology', 'Cincinnati Children’s', 'Heart Center', 'Montefiore', 'Ascension Texas'] },
  { label: 'Role', options: ['All', 'PI', 'Coordinator', 'Sub-Investigator'] },
  { label: 'Due', options: ['All', 'Overdue', 'This Month', 'This Quarter'] },
];

export const SITES_FILTERS: FilterSpec[] = [
  { label: 'Status', options: ['All', 'Pending', 'Active', 'Closed'] },
  {
    label: 'Site Coordinator',
    options: ['All', 'Jacob Jones', 'Annette Black', 'Ricardo Nolan', 'Naomi Watts', 'David Guetta', 'Cecilia Banks', 'Byron Scott', 'Madelyn Cline'],
  },
];

export const LIBRARY_FILTERS: FilterSpec[] = [
  { label: 'Status', options: ['All', 'Published', 'Draft'] },
  { label: 'Version', options: ['All', '1.0', '2.0', '3.0'] },
  { label: 'Group', options: ['All', 'Managers Group', 'Investigators', 'Site Staff'] },
  { label: 'Sites', options: ['All', '0982 - Miles, H', '1643 - Hwang, S', '2208 - Rivera, C', '2567 - Milevich, K'] },
  { label: 'Role', options: ['All', 'PI', 'Sub-I', 'Coordinator', 'Pharmacist', 'Study Nurse', 'Lab Technician'] },
  { label: 'Due', options: ['All', 'Overdue', 'This Month', 'This Quarter', 'No Due Date'] },
];

/** A user's own listings are filtered by where the training came from. */
export const USER_FILTERS: FilterSpec[] = [
  { label: 'Study', options: ['All', 'Bivivid'] },
  { label: 'Site', options: ['All', '0982 - Miles, H', '1643 - Hwang, S', '2208 - Rivera, C'] },
  { label: 'Training Group', options: ['All', 'Bivivid Training', 'Onboarding Group'] },
  { label: 'Status', options: ['All', 'Completed', 'In Progress', 'Not Started', 'Not Enrolled'] },
];

export const PERSONNEL_FILTERS: FilterSpec[] = [
  { label: 'User Status', options: ['All', 'Active', 'Pending', 'Inactive'] },
  {
    label: 'Site Role',
    options: ['All', 'Principal Investigator', 'Sub-Investigator', 'Study Coordinator', 'Research Nurse', 'Pharmacist', 'Data Entry'],
  },
  { label: 'User Role', options: ['All', 'Learner', 'Site Coordinator', 'Study Admin'] },
];

export const SITE_TRAINING_FILTERS: FilterSpec[] = [
  { label: 'Release Status', options: ['All', 'Released', 'Not Released', 'N/A'] },
  { label: 'Due', options: ['All', 'Overdue', 'This Month', 'This Quarter', 'No Due Date'] },
  { label: 'Role', options: ['All', 'Principal Investigator', 'Sub-Investigator', 'Study Coordinator', 'Research Nurse', 'Pharmacist', 'Data Entry'] },
];

const DOA_ROLE_FILTER: FilterSpec = {
  label: 'Role',
  options: ['All', 'PI', 'Sub-I', 'Coordinator', 'Pharmacist', 'Study Nurse', 'Lab Technician', 'Data Entry'],
};

/**
 * No Site filter either way. At site level the site is already chosen — the
 * whole section is one site's log. At study level the list is the template's
 * standard duties read across every site, so there is no single site to pick.
 */
export const DOA_FILTERS: FilterSpec[] = [DOA_ROLE_FILTER];
export const DOA_SITE_FILTERS: FilterSpec[] = [DOA_ROLE_FILTER];

/**
 * `perPage` is off where the listing is not paged — a dialog's grid shows
 * everything it has, so a page size would be a control over nothing.
 */
export function FilterRow({ filters, perPage = true }: { filters: FilterSpec[]; perPage?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <Filter key={f.label} label={f.label} options={f.options} />
        ))}
      </div>
      {perPage && <PerPageControl />}
    </div>
  );
}

export default FilterRow;
