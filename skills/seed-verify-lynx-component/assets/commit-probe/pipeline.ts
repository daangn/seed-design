export const COMMIT_PROBE_FLAG_PREFIX = "commit_probe_";

export const COMMIT_PHASES = [
  "diff",
  "pack",
  "wait",
  "parse",
  "patch",
  "resolve",
  "layout",
  "flush",
  "frame",
  "total",
] as const;

export type CommitPhase = (typeof COMMIT_PHASES)[number];

export type CommitSample = Record<CommitPhase, number>;

export interface PhaseStats {
  median: number;
  p95: number;
  max: number;
}

export interface CommitProbeSummary {
  count: number;
  phases: Record<CommitPhase, PhaseStats>;
}

export const commitProbeFlag = (step: number): string => `${COMMIT_PROBE_FLAG_PREFIX}${step}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readTime = (source: Record<string, unknown>, key: string): number => {
  const value = source[key];
  return typeof value === "number" && value > 0 ? value : Number.NaN;
};

export function toCommitSample(entry: unknown): CommitSample | null {
  if (!isRecord(entry)) return null;
  const { identifier, frameworkRenderingTiming: framework } = entry;
  if (
    typeof identifier !== "string" ||
    !identifier.startsWith(COMMIT_PROBE_FLAG_PREFIX) ||
    !isRecord(framework)
  )
    return null;
  const diffStart = readTime(framework, "diffVdomStart");
  const diffEnd = readTime(framework, "diffVdomEnd");
  const packStart = readTime(framework, "packChangesStart");
  const packEnd = readTime(framework, "packChangesEnd");
  const parseStart = readTime(framework, "parseChangesStart");
  const parseEnd = readTime(framework, "parseChangesEnd");
  const patchStart = readTime(framework, "patchChangesStart");
  const patchEnd = readTime(framework, "patchChangesEnd");
  const resolveStart = readTime(entry, "resolveStart");
  const resolveEnd = readTime(entry, "resolveEnd");
  const layoutStart = readTime(entry, "layoutStart");
  const layoutEnd = readTime(entry, "layoutEnd");
  const flushStart = readTime(entry, "paintingUiOperationExecuteStart");
  const flushEnd = readTime(entry, "layoutUiOperationExecuteEnd");
  const paintEnd = readTime(entry, "paintEnd");
  const sample: CommitSample = {
    diff: diffEnd - diffStart,
    pack: packEnd - packStart,
    wait: parseStart - packEnd,
    parse: parseEnd - parseStart,
    patch: patchEnd - patchStart,
    resolve: resolveEnd - resolveStart,
    layout: layoutEnd - layoutStart,
    flush: flushEnd - flushStart,
    frame: paintEnd - flushEnd,
    total: paintEnd - diffStart,
  };
  for (const phase of COMMIT_PHASES) if (Number.isNaN(sample[phase])) return null;
  return sample;
}

const round = (value: number): number => Math.round(value * 1000) / 1000;

function statsOf(values: readonly number[]): PhaseStats {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (ratio: number): number =>
    sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))] ?? 0;
  return {
    median: round(at(0.5)),
    p95: round(at(0.95)),
    max: round(at(1)),
  };
}

export function summarizeCommitSamples(samples: readonly CommitSample[]): CommitProbeSummary {
  const phaseStats = (phase: CommitPhase): PhaseStats =>
    statsOf(samples.map((sample) => sample[phase]));
  return {
    count: samples.length,
    phases: {
      diff: phaseStats("diff"),
      pack: phaseStats("pack"),
      wait: phaseStats("wait"),
      parse: phaseStats("parse"),
      patch: phaseStats("patch"),
      resolve: phaseStats("resolve"),
      layout: phaseStats("layout"),
      flush: phaseStats("flush"),
      frame: phaseStats("frame"),
      total: phaseStats("total"),
    },
  };
}
