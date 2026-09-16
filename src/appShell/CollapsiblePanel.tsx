import React, { useEffect, useRef, useState } from 'react';
import { SplitterBar } from './SplitterBar';
import { useMediaQuery } from '../useMediaQuery';

// Generalised from doa-log/ai-course-authoring-flow's ResizableTree, which was
// hardwired to one tree. Both side panels on this screen collapse the same way,
// so the panel is the wrapper and its content is a child.
//
// Behaviour per DS - Advanced | IN PROGRESS | 2.0, "Sub Nav Behaviour" → Close/
// Open Behaviour (node 86:198890):
//   open, resting   → Zero State: no splitter bar is drawn at all
//   open, panel hovered → the close indicator appears
//   open, bar hovered   → the bar escalates to its hover width
//   click               → collapses
//   collapsed           → "no Zero State, it should always be shown": the open
//                         bar stays visible so the panel can be brought back

/** The Splitter Bar's resting width in the Figma component (it grows to 30 on hover). */
const SPLITTER_WIDTH = 20;

export interface CollapsiblePanelProps {
  children: React.ReactNode;
  /** The panel's resting width, from its own navigation width token. */
  defaultWidth: number;
  /** Drag-to-resize bounds. Omit to pin the panel at defaultWidth. */
  minWidth?: number;
  maxWidth?: number;
  /** Passes the Splitter Bar's `tree` variant through — sitemap glyph + TREE label. */
  tree?: boolean;
}

export function CollapsiblePanel({ children, defaultWidth, minWidth, maxWidth, tree = false }: CollapsiblePanelProps) {
  // No real hover on touch devices — keep the splitter's Resting look always
  // shown there instead of gating it behind a hover that will never fire,
  // so the panel stays reachable at every viewport width.
  const canHover = useMediaQuery('(hover: hover)');
  const [open, setOpen] = useState(true);
  const [width, setWidth] = useState(defaultWidth);
  const [dragging, setDragging] = useState(false);
  const [panelHovered, setPanelHovered] = useState(false);
  const dragStart = useRef<{ x: number; width: number } | null>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  // The bar sits just outside the panel, so crossing from one to the other
  // leaves the panel for an instant. Hiding on a short delay keeps the bar
  // alive across that gap — otherwise it unmounts from under the pointer and
  // can never be hovered.
  const showZone = () => {
    window.clearTimeout(hideTimer.current);
    setPanelHovered(true);
  };
  const hideZone = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setPanelHovered(false), 150);
  };
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const resizable = minWidth != null && maxWidth != null && minWidth < maxWidth;

  useEffect(() => {
    if (!dragging || !resizable) return;
    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const next = Math.min(maxWidth!, Math.max(minWidth!, dragStart.current.width + (e.clientX - dragStart.current.x)));
      setWidth(next);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
    };
  }, [dragging, resizable, minWidth, maxWidth]);

  if (!open) {
    // Collapsed, the bar is always shown, so it holds its own lane in the
    // layout — otherwise the content beside it slides underneath the pill.
    // Only its hover growth (20 → 30) overlays, as the hovered state intends.
    return (
      // display:flex matters — the bar sizes itself with alignSelf:'stretch',
      // so in a plain block wrapper it collapses to zero height and its rail
      // (TREE label + grips) spills out of a zero-height box.
      <div style={{ display: 'flex', width: SPLITTER_WIDTH, flexShrink: 0, position: 'relative', alignSelf: 'stretch' }}>
        <SplitterBar type="Open" tree={tree} onToggle={() => setOpen(true)} alwaysVisible={!canHover} />
      </div>
    );
  }

  // The panel always sits in normal flow and pushes the rest of the layout.
  // Only the SplitterBar's own hover-expand (pill/rail) overlays the content to
  // its right, matching the "Splitter Bar Hovered" state.
  return (
    <div style={{ position: 'relative', display: 'flex', flexShrink: 0, alignSelf: 'stretch' }}>
      <div
        onMouseEnter={showZone}
        onMouseLeave={hideZone}
        // No border here — the SplitterBar beside it draws the
        // splitter-bar/border divider, in every state including Zero.
        style={{ width, flexShrink: 0, overflow: 'hidden' }}
      >
        {children}
      </div>
      <SplitterBar
        type="Close"
        tree={tree}
        onToggle={() => setOpen(false)}
        alwaysVisible={!canHover}
        treeAreaHovered={panelHovered}
        onHoverChange={h => (h ? showZone() : hideZone())}
        onDragStart={
          resizable
            ? e => {
                dragStart.current = { x: e.clientX, width };
                setDragging(true);
              }
            : undefined
        }
      />
    </div>
  );
}

export default CollapsiblePanel;
