import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { color, type, table as t, button as btn, page, icon } from './tokens';

// The dashlet and the read-only field a profile's General Info is built from,
// in doa-log's panel chrome: a white surface on table/radius with a
// borderSubtle rule. Shared by the site's General Info and the user's, which
// is why they live here rather than inside either one.

/**
 * A dashlet — a collapsible white card with a caret + title header. The title
 * is a link tone because the header is the control that folds it.
 */
export function Dashlet({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        backgroundColor: color.white,
        borderRadius: t.radius,
        border: `1px solid ${color.borderSubtle}`,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: t.gap,
          width: '100%',
          padding: `${page.paddingY}px ${page.paddingX}px`,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: btn.iconBoxS,
            height: btn.iconBoxS,
            color: color.primary,
            flexShrink: 0,
            transform: open ? 'none' : 'rotate(-90deg)',
            transition: 'transform 100ms',
          }}
        >
          <FontAwesomeIcon icon={faCaretDown} style={{ width: icon.s, height: icon.s }} />
        </span>
        <span style={{ ...type.h4, color: color.primary }}>{title}</span>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${color.borderSubtle}`, padding: `${page.paddingY}px ${page.paddingX}px` }}>{children}</div>
      )}
    </div>
  );
}

/** A read-only field — the DS input: page bg, a single bottom rule, top-rounded. */
export function Field({ label, value, width }: { label: string; value: string; width?: number | string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0, width: width ?? '100%' }}>
      <span style={{ ...type.captionRegular, color: color.textMuted }}>{label}</span>
      <span
        title={value}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 30,
          padding: '0 8px',
          backgroundColor: color.pageBg,
          borderBottom: `1px solid ${color.border}`,
          borderRadius: '5px 5px 0 0',
          ...type.body,
          color: color.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  );
}
