const PATCH_UPDATE = "rLynxChange";
const ADJACENT_GAP_MS = 16;
const HEAD_LENGTH = 1200;

export const COMMIT_LOG_GLOBAL = "__commitLog";

export interface CommitRecord {
  at: number;
  done: number;
  bytes: number;
  empty: boolean | null;
  emptySource: "flag" | "payload" | null;
  hydrate: boolean;
  head: string;
}

export interface CommitLogSummary {
  count: number;
  empty: number;
  unknown: number;
  spanMs: number;
  gapsMs: number[];
  adjacent: number;
  queued: number;
  roundTripMs: number[];
  bytes: number[];
}

type LepusCallback = () => void;

interface LepusCaller {
  callLepusMethod: (name: string, data: unknown, callback?: LepusCallback) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isLepusCaller = (value: unknown): value is LepusCaller =>
  isRecord(value) && typeof value["callLepusMethod"] === "function";

const isFunction = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === "function";

const hasNativeApp = (value: unknown): value is { getNativeApp: () => unknown } =>
  isRecord(value) && typeof value["getNativeApp"] === "function";

function classifyPatch(text: string): Pick<CommitRecord, "empty" | "emptySource"> {
  try {
    const payload: unknown = JSON.parse(text);
    if (isRecord(payload)) {
      const options = payload.flushOptions;
      const flag = isRecord(options) ? options.emptyPatch : payload.emptyPatch;
      if (typeof flag === "boolean") return { empty: flag, emptySource: "flag" };

      const patches = payload.patchList;
      if (Array.isArray(patches) && patches.every(isRecord)) {
        const hasChanges =
          patches.some(
            (patch) => Array.isArray(patch.snapshotPatch) && patch.snapshotPatch.length > 0,
          ) ||
          Boolean(payload.delayedRunOnMainThreadData) ||
          Boolean(options);
        return { empty: !hasChanges, emptySource: "payload" };
      }
    }
  } catch {
    // A different runtime may serialize the envelope differently.
  }
  return { empty: null, emptySource: null };
}

function utf8Bytes(text: string): number {
  let bytes = 0;
  for (const character of text) {
    const point = character.codePointAt(0) ?? 0;
    bytes += point < 0x80 ? 1 : point < 0x800 ? 2 : point < 0x10000 ? 3 : 4;
  }
  return bytes;
}

function toRecord(data: unknown, at: number): CommitRecord {
  const payload = isRecord(data) ? data["data"] : undefined;
  const options = isRecord(data) ? data["patchOptions"] : undefined;
  const text = typeof payload === "string" ? payload : "";
  let classification: ReturnType<typeof classifyPatch> | undefined;
  return {
    at,
    done: -1,
    get bytes() {
      return utf8Bytes(text);
    },
    get empty() {
      return (classification ??= classifyPatch(text)).empty;
    },
    get emptySource() {
      return (classification ??= classifyPatch(text)).emptySource;
    },
    hydrate: isRecord(options) && options["isHydration"] === true,
    head: text.slice(0, HEAD_LENGTH),
  };
}

export function recordCommits<App extends LepusCaller>(
  app: App,
  records: CommitRecord[],
  now: () => number,
): App {
  const callLepusMethod: LepusCaller["callLepusMethod"] = (name, data, callback) => {
    if (name !== PATCH_UPDATE) {
      app.callLepusMethod(name, data, callback);
      return;
    }
    const record = toRecord(data, now());
    records.push(record);
    app.callLepusMethod(name, data, () => {
      record.done = now();
      callback?.();
    });
  };
  return new Proxy(app, {
    get(target, key) {
      if (key === "callLepusMethod") return callLepusMethod;
      const value: unknown = Reflect.get(target, key);
      return isFunction(value) ? value.bind(target) : value;
    },
  });
}

const round = (value: number): number => Math.round(value * 10) / 10;

export function summarizeCommitLog(records: readonly CommitRecord[]): CommitLogSummary {
  const gapsMs: number[] = [];
  let adjacent = 0;
  let queued = 0;
  let empty = 0;
  let unknown = 0;
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record === undefined) continue;
    if (record.empty) empty += 1;
    if (record.empty === null) unknown += 1;
    const previous = records[index - 1];
    if (previous === undefined) continue;
    const gap = record.at - previous.at;
    gapsMs.push(round(gap));
    if (gap < ADJACENT_GAP_MS) adjacent += 1;
    if (previous.done < 0 || record.at < previous.done) queued += 1;
  }
  const first = records[0];
  const last = records[records.length - 1];
  return {
    count: records.length,
    empty,
    unknown,
    spanMs: first && last ? round(last.at - first.at) : 0,
    gapsMs,
    adjacent,
    queued,
    roundTripMs: records.map((record) => (record.done < 0 ? -1 : round(record.done - record.at))),
    bytes: records.map((record) => record.bytes),
  };
}

export interface CommitLog {
  records: CommitRecord[];
}

export function installCommitLog(): CommitLog | undefined {
  "background only";
  try {
    if (!hasNativeApp(lynx)) return;
    const app = lynx.getNativeApp();
    if (!isLepusCaller(app)) return;
    const records: CommitRecord[] = [];
    const recorded = recordCommits(app, records, () => Date.now());
    if (!Reflect.set(lynx, "getNativeApp", () => recorded)) return;
    Reflect.set(globalThis, COMMIT_LOG_GLOBAL, {
      records,
      summary: () => summarizeCommitLog(records),
    });
    return { records };
  } catch {
    return;
  }
}
