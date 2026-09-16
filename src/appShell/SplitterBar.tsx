import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { splitter as sb, type } from '../tokens';

// Splitter Bar — DS - Advanced | IN PROGRESS | 2.0 (resting state node
// 86:198928, hover state node 86:198938). Behaviour is unchanged from the
// ai-course-authoring-flow version; only the colours and glyph sizes are
// retargeted from the older Design Library | PROD | 1.0 values it carried:
//   pill   resting #1f6aac → hover #164b7a   (was #5391c6 → #1f6aac)
//   rail   resting #edf5fb → hover #e5f1fb   (was a flat #d2e5f6)
//   the rail glyph is Icons/solid/xs (12) in a 15px box (was a bare 13px)
//
// States, per "Sub Nav Behaviour" (86:198890):
//   Zero  — expanded and unhovered: nothing is drawn
//   Rest  — the panel is hovered, or the panel is collapsed (which has no Zero
//           state: the bar must always be reachable)
//   Hover — the strip itself is hovered; it widens to 30 and overlays content

export interface SplitterBarProps {
  /** 'Open' = panel is currently closed, clicking opens it. 'Close' = panel is open, clicking closes it. */
  type: 'Open' | 'Close';
  onToggle: () => void;
  /**
   * The component's `tree` variant: shows the sitemap glyph and TREE label on
   * the rail. Off by default — only a bar attached to a navigation tree carries
   * it, which is why the sub nav's bar must not.
   */
  tree?: boolean;
  onDragStart?: (e: React.MouseEvent) => void;
  /** Skip the hover-gated reveal and always show the Resting look — for touch/no-hover devices */
  alwaysVisible?: boolean;
  /**
   * 'Close' (expanded panel) only: true while the pointer is anywhere over the
   * panel's own content, not just this strip. That alone reveals the Resting
   * look; hovering this strip itself escalates straight to Hover.
   */
  treeAreaHovered?: boolean;
  /**
   * Fires as the pointer enters/leaves the strip. The strip sits OUTSIDE the
   * panel, so without this the panel's own mouseleave would hide the bar
   * before the pointer finished crossing onto it.
   */
  onHoverChange?: (hovered: boolean) => void;
}

export function SplitterBar({
  type: kind,
  onToggle,
  tree = false,
  onDragStart,
  alwaysVisible = false,
  treeAreaHovered = false,
  onHoverChange,
}: SplitterBarProps) {
  const [hoverZone, setHoverZone] = useState(false);

  const wideZoneHover = kind === 'Close' && treeAreaHovered;
  const visible = kind === 'Open' || alwaysVisible || hoverZone || wideZoneHover;
  const isHover = !alwaysVisible && hoverZone;
  const width = isHover ? sb.actionHoverWidth : sb.actionRestingWidth;
  const glyph = kind === 'Close' ? faCaretLeft : faCaretRight;
  const label = kind === 'Close' ? 'CLOSE' : 'OPEN';

  return (
    <div
      style={{
        // The bar is never wider than its own 1px splitter-bar/border: that
        // border IS the divider, and the component draws it in every state —
        // Zero included, where it is the only thing shown. Everything else
        // (pill, rail) is absolutely positioned on top, so revealing the bar
        // never reflows the content beside it.
        width: sb.borderWidth,
        borderLeft: `${sb.borderWidth}px solid ${sb.border}`,
        flexShrink: 0,
        position: 'relative',
        alignSelf: 'stretch',
      }}
    >
      {visible && (
        <div
          onMouseEnter={() => {
            setHoverZone(true);
            onHoverChange?.(true);
          }}
          onMouseLeave={() => {
            setHoverZone(false);
            onHoverChange?.(false);
          }}
          onMouseDown={onDragStart}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            cursor: onDragStart ? 'col-resize' : 'pointer',
            transition: 'width 100ms',
          }}
        >
          {/* action — the OPEN/CLOSE pill */}
          <button
            type="button"
            onClick={onToggle}
            onMouseDown={e => e.stopPropagation()}
            aria-label={kind === 'Close' ? 'Collapse panel' : 'Expand panel'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: sb.actionGap,
              height: sb.actionHeight,
              width,
              backgroundColor: isHover ? sb.actionHoverBg : sb.actionRestingBg,
              borderTopRightRadius: sb.actionRadius,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 100ms, width 100ms',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: sb.actionIconSize,
                height: sb.actionIconSize,
              }}
            >
              <FontAwesomeIcon icon={glyph} style={{ width: sb.actionIconSize, height: sb.actionIconSize, color: sb.actionIcon }} />
            </span>
            <span
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                ...type.captionRegular,
                color: sb.actionText,
              }}
            >
              {label}
            </span>
          </button>

          {/* bottom — the rail */}
          <div
            style={{
              flex: '1 0 0',
              width,
              backgroundColor: isHover ? sb.bottomHoverBg : sb.bottomRestingBg,
              position: 'relative',
              transition: 'width 100ms, background-color 100ms',
            }}
          >
            {/* View — only on a bar attached to a tree */}
            {tree && (
              <div
                style={{
                  position: 'absolute',
                  top: sb.bottomPaddingTop,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: sb.bottomGap,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: sb.bottomIconSize,
                    height: sb.bottomIconSize,
                  }}
                >
                  <FontAwesomeIcon icon={faSitemap} style={{ width: sb.bottomGlyph, height: sb.bottomGlyph, color: sb.bottomIcon }} />
                </span>
                <span
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    ...type.captionBold,
                    color: sb.bottomText,
                  }}
                >
                  TREE
                </span>
              </div>
            )}
            {/* Nugget — two 1×50 grips, centred */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                gap: sb.bottomGap,
              }}
            >
              <div style={{ width: sb.nuggetWidth, height: sb.nuggetHeight, borderRadius: sb.nuggetRadius, backgroundColor: sb.nuggetBg }} />
              <div style={{ width: sb.nuggetWidth, height: sb.nuggetHeight, borderRadius: sb.nuggetRadius, backgroundColor: sb.nuggetBg }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SplitterBar;
