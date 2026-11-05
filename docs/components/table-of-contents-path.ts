const TRACK_STROKE_WIDTH = 1.5;

export interface TocTrackPosition {
  top: number;
  bottom: number;
  x: number;
}

export interface TocTrackGeometry {
  path: string;
  width: number;
  height: number;
}

export function getTocTrackOffset(depth: number): number {
  if (depth <= 2) return 8;
  if (depth === 3) return 16;
  return 24;
}

export function buildTocTrackGeometry(positions: TocTrackPosition[]): TocTrackGeometry | null {
  const first = positions[0];
  if (!first) return null;
  const last = positions[positions.length - 1];

  const transitions: Array<{
    fromX: number;
    toX: number;
    start: number;
    end: number;
  }> = [];
  let previousTransitionEnd = first.top;

  for (let index = 0; index < positions.length - 1; index += 1) {
    const current = positions[index];
    const next = positions[index + 1];
    const span = Math.abs(next.x - current.x);

    if (span === 0) continue;

    const transitionCenter = (current.bottom + next.top) / 2;
    const start = transitionCenter - span / 2;
    const end = transitionCenter + span / 2;

    if (start < first.top || end > last.bottom || start < previousTransitionEnd) {
      return null;
    }

    transitions.push({
      fromX: current.x,
      toX: next.x,
      start,
      end,
    });
    previousTransitionEnd = end;
  }

  const commands = [`M ${first.x} ${first.top}`];
  for (const transition of transitions) {
    commands.push(
      `L ${transition.fromX} ${transition.start}`,
      `L ${transition.toX} ${transition.end}`,
    );
  }
  commands.push(`L ${last.x} ${last.bottom}`);

  return {
    path: commands.join(" "),
    width: Math.max(...positions.map(({ x }) => x)) + TRACK_STROKE_WIDTH,
    height: last.bottom,
  };
}

export function getActiveTrackClip(
  positions: TocTrackPosition[],
  startIndex: number,
  endIndex: number,
): { top: number; bottom: number } | null {
  if (
    !Number.isInteger(startIndex) ||
    !Number.isInteger(endIndex) ||
    startIndex < 0 ||
    endIndex < startIndex ||
    endIndex >= positions.length
  ) {
    return null;
  }

  return {
    top: Math.max(0, positions[startIndex].top - TRACK_STROKE_WIDTH / 2),
    bottom: positions[endIndex].bottom + TRACK_STROKE_WIDTH / 2,
  };
}
