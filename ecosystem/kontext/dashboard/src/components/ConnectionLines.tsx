import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GraphEdge, GraphNode } from "@/types";

interface ConnectionLinesProps {
  /** The source element on the left tree */
  sourceEl: HTMLElement | null;
  /** Get target element for a given edge index */
  getTargetEl: (idx: number) => HTMLElement | null;
  /** The container element (position: relative) for coordinate calculation */
  containerEl: HTMLElement | null;
  /** Forward edges to draw */
  forwardEdges: GraphEdge[];
  /** Graph nodes for exists check */
  nodes: GraphNode[];
  /** Key to trigger re-measure (e.g. selectedPath) */
  measureKey: string | null;
}

interface LineData {
  idx: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  reason?: string;
  pathLength: number;
}

const STATUS_COLORS = {
  exists: "oklch(0.65 0.18 155)",
  missing: "oklch(0.55 0.2 25)",
  optional: "oklch(0.75 0.15 85)",
} as const;

function getEdgeColor(edge: GraphEdge | undefined, nodes: GraphNode[]): string {
  if (!edge) return STATUS_COLORS.missing;
  if (edge.optional) return STATUS_COLORS.optional;
  const node = nodes.find((n) => n.id === edge.target);
  if (node?.exists) return STATUS_COLORS.exists;
  return STATUS_COLORS.missing;
}

export function ConnectionLines({
  sourceEl,
  getTargetEl,
  containerEl,
  forwardEdges,
  nodes,
  measureKey,
}: ConnectionLinesProps) {
  const [lines, setLines] = useState<LineData[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const rafRef = useRef<number>(0);

  const measure = () => {
    if (!sourceEl || !containerEl || forwardEdges.length === 0) {
      setLines([]);
      return;
    }

    const containerRect = containerEl.getBoundingClientRect();
    const sourceRect = sourceEl.getBoundingClientRect();

    // Source point: right edge of selected file, vertically centered
    const x1 = sourceRect.right - containerRect.left;
    const y1 = sourceRect.top - containerRect.top + sourceRect.height / 2;

    const newLines: LineData[] = [];

    for (let i = 0; i < forwardEdges.length; i++) {
      const targetEl = getTargetEl(i);
      if (!targetEl) continue;

      const targetRect = targetEl.getBoundingClientRect();
      const x2 = targetRect.left - containerRect.left;
      const y2 = targetRect.top - containerRect.top + targetRect.height / 2;

      // Approximate path length for animation
      const dx = x2 - x1;
      const dy = y2 - y1;
      const pathLength = Math.sqrt(dx * dx + dy * dy) * 1.3; // bezier is longer than straight

      newLines.push({
        idx: i,
        x1,
        y1,
        x2,
        y2,
        color: getEdgeColor(forwardEdges[i], nodes),
        reason: forwardEdges[i].reason,
        pathLength,
      });
    }

    setLines(newLines);
  };

  // Measure on layout changes
  useLayoutEffect(() => {
    measure();
  }, [measureKey, forwardEdges.length]);

  // Re-measure on scroll/resize
  useEffect(() => {
    if (!containerEl) return;

    const scrollEls = [
      containerEl,
      containerEl.querySelector("[data-radix-scroll-area-viewport]"),
      // Also watch the left pane's scroll area
      containerEl.parentElement?.querySelector("[data-radix-scroll-area-viewport]"),
    ].filter(Boolean) as Element[];

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(onScroll);
    observer.observe(containerEl);

    for (const el of scrollEls) {
      el.addEventListener("scroll", onScroll, { passive: true });
    }

    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      for (const el of scrollEls) {
        el.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("resize", onScroll);
    };
  }, [containerEl, measureKey]);

  if (lines.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 z-10 pointer-events-none overflow-visible"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Dither pattern for line texture */}
      <defs>
        {/* Pixel arrowhead markers per color */}
        {Object.entries(STATUS_COLORS).map(([key, color]) => (
          <marker
            key={key}
            id={`arrow-${key}`}
            viewBox="0 0 6 6"
            refX="5"
            refY="3"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            {/* Pixelated arrowhead: 3 stacked squares */}
            <rect x="4" y="2" width="2" height="2" fill={color} />
            <rect x="2" y="1" width="2" height="1" fill={color} />
            <rect x="2" y="4" width="2" height="1" fill={color} />
            <rect x="0" y="0" width="2" height="1" fill={color} opacity="0.5" />
            <rect x="0" y="5" width="2" height="1" fill={color} opacity="0.5" />
          </marker>
        ))}
      </defs>

      {lines.map((line) => {
        const isHovered = hoveredIdx === line.idx;
        const opacity = isHovered ? 0.9 : 0.4;

        // Bezier control points: horizontal offset ~50% of distance
        const dx = line.x2 - line.x1;
        const cpOffset = Math.max(Math.abs(dx) * 0.4, 40);
        const path = `M ${line.x1},${line.y1} C ${line.x1 + cpOffset},${line.y1} ${line.x2 - cpOffset},${line.y2} ${line.x2},${line.y2}`;

        // Midpoint for reason label
        const mx = (line.x1 + line.x2) / 2;
        const my = (line.y1 + line.y2) / 2;

        // Determine marker key from pre-computed color
        const markerKey =
          line.color === STATUS_COLORS.optional
            ? "optional"
            : line.color === STATUS_COLORS.exists
              ? "exists"
              : "missing";

        return (
          <g key={line.idx}>
            {/* Invisible wider hit area for hover */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth="12"
              className="pointer-events-auto cursor-default"
              onMouseEnter={() => setHoveredIdx(line.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />

            {/* Dithered line */}
            <path
              d={path}
              fill="none"
              stroke={line.color}
              strokeWidth="1.5"
              strokeDasharray="2 3"
              strokeLinecap="square"
              opacity={opacity}
              markerEnd={`url(#arrow-${markerKey})`}
              style={{
                strokeDashoffset: line.pathLength,
                animation: `drawLine 0.4s ease-out ${line.idx * 60}ms forwards`,
              }}
            />

            {/* Source pixel marker (4x4 square) */}
            <rect
              x={line.x1 - 2}
              y={line.y1 - 2}
              width="4"
              height="4"
              fill={line.color}
              opacity={opacity}
              style={{
                animation: `fadeIn 0.2s ease-out ${line.idx * 60}ms both`,
              }}
            />

            {/* Reason label at midpoint */}
            {line.reason && (
              <g
                style={{
                  animation: `fadeIn 0.3s ease-out ${line.idx * 60 + 200}ms both`,
                }}
              >
                {/* Background pill */}
                <rect
                  x={mx - measureTextWidth(line.reason) / 2 - 4}
                  y={my - 7}
                  width={measureTextWidth(line.reason) + 8}
                  height="14"
                  rx="2"
                  fill="oklch(0.09 0.005 260)"
                  opacity={isHovered ? 0.95 : 0.8}
                />
                <text
                  x={mx}
                  y={my + 3}
                  textAnchor="middle"
                  fill={isHovered ? "oklch(0.75 0.01 260)" : "oklch(0.45 0.005 260)"}
                  fontSize="9"
                  fontFamily="'Geist Mono', monospace"
                  className="select-none"
                >
                  {truncateReason(line.reason, 30)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// Simple text width estimation for SVG (9px Geist Mono ≈ 5.4px per char)
function measureTextWidth(text: string): number {
  return text.length * 5.4;
}

function truncateReason(reason: string, max: number): string {
  if (reason.length <= max) return reason;
  return reason.slice(0, max - 1) + "…";
}
