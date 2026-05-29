import { useEffect, useMemo, useState } from "@lynx-js/react";

type PipelineMetric = {
  name: string;
  duration: number;
};

type PipelineEntry = {
  name?: string;
  identifier?: string;
  pipelineStart?: number;
  pipelineEnd?: number;
  mtsRenderStart?: number;
  mtsRenderEnd?: number;
  resolveStart?: number;
  resolveEnd?: number;
  layoutStart?: number;
  layoutEnd?: number;
  paintEnd?: number;
  actualFmp?: PipelineMetric;
  lynxActualFmp?: PipelineMetric;
  totalActualFmp?: PipelineMetric;
};

type PerformanceObserver = {
  observe: (name: string[]) => void;
  disconnect: () => void;
};

type LynxPerformance = {
  addTimingListener?: (listener: TimingListener) => void;
  createObserver?: (callback: (entry: PipelineEntry) => void) => PerformanceObserver;
  profileMark?: (traceName: string, option?: { args?: Record<string, string> }) => void;
  removeTimingListener?: (listener: TimingListener) => void;
};

type Measurement = {
  id?: string;
  source?: "observer" | "timing";
  total?: number;
  render?: number;
  resolve?: number;
  layout?: number;
  paint?: number;
  actualFmp?: number;
  totalActualFmp?: number;
};

type TimingInfo = {
  metrics?: {
    actual_fmp?: number;
    total_actual_fmp?: number;
  };
  update_timings?: Record<
    string,
    {
      create_vdom_start?: number;
      create_vdom_end?: number;
      dispatch_start?: number;
      dispatch_end?: number;
      layout_start?: number;
      layout_end?: number;
      ui_operation_flush_start?: number;
      ui_operation_flush_end?: number;
      draw_end?: number;
    }
  >;
};

type TimingListener = {
  onSetup: (info: TimingInfo) => void;
  onUpdate: (info: TimingInfo) => void;
};

type ObserverStatus = "observer" | "observer+timing" | "timing" | "unsupported" | "error";

type Subscription = {
  disconnect?: () => void;
  status: ObserverStatus;
};

const MAX_SAMPLES = 20;

declare const lynx: { performance?: LynxPerformance } | undefined;

function getLynxPerformance() {
  "background only";

  if (typeof lynx !== "undefined") {
    return lynx?.performance;
  }

  return (globalThis as { lynx?: { performance?: LynxPerformance } }).lynx?.performance;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function toDuration(end: unknown, start: unknown) {
  if (!isNumber(end) || !isNumber(start)) return 0;
  return Math.max(0, end - start);
}

function readMeasurement(entry: PipelineEntry): Measurement | null {
  if (!isNumber(entry.pipelineStart) || !isNumber(entry.pipelineEnd)) {
    return null;
  }

  return {
    total: toDuration(entry.pipelineEnd, entry.pipelineStart),
    render: toDuration(entry.mtsRenderEnd, entry.mtsRenderStart),
    resolve: toDuration(entry.resolveEnd, entry.resolveStart),
    layout: toDuration(entry.layoutEnd, entry.layoutStart),
    paint: toDuration(entry.paintEnd, entry.pipelineStart),
    actualFmp: entry.actualFmp?.duration,
    totalActualFmp: entry.totalActualFmp?.duration,
  };
}

function readTimingMeasurement(identifier: string, info: TimingInfo): Measurement | null {
  const updateTimings = info.update_timings ?? {};
  const timingKeys = Object.keys(updateTimings).filter((key) => key.startsWith(identifier));
  const timingKey = timingKeys[timingKeys.length - 1];

  if (!timingKey) return null;

  const timing = updateTimings[timingKey];

  return {
    id: timingKey,
    source: "timing",
    total: toDuration(timing.draw_end, timing.create_vdom_start),
    render: toDuration(timing.create_vdom_end, timing.create_vdom_start),
    resolve: toDuration(timing.dispatch_end, timing.dispatch_start),
    layout: toDuration(timing.layout_end, timing.layout_start),
    paint: toDuration(timing.draw_end, timing.create_vdom_start),
    actualFmp: info.metrics?.actual_fmp,
    totalActualFmp: info.metrics?.total_actual_fmp,
  };
}

function appendMeasurement(samples: Measurement[], measurement: Measurement) {
  if (!measurement.id) {
    return [...samples, measurement].slice(-MAX_SAMPLES);
  }

  const existingIndex = samples.findIndex((sample) => sample.id === measurement.id);

  if (existingIndex === -1) {
    return [...samples, measurement].slice(-MAX_SAMPLES);
  }

  const existing = samples[existingIndex];

  if (existing.source === "observer" && measurement.source === "timing") {
    return samples;
  }

  const next = [...samples];
  next[existingIndex] = measurement;

  return next.slice(-MAX_SAMPLES);
}

function average(samples: Measurement[]) {
  if (samples.length === 0) return null;

  return {
    total: averageValue(samples, "total"),
    render: averageValue(samples, "render"),
    resolve: averageValue(samples, "resolve"),
    layout: averageValue(samples, "layout"),
    paint: averageValue(samples, "paint"),
    actualFmp: averageValue(samples, "actualFmp"),
    totalActualFmp: averageValue(samples, "totalActualFmp"),
  };
}

function averageValue(samples: Measurement[], key: keyof Measurement) {
  const values = samples.map((sample) => sample[key]).filter(isNumber);

  if (values.length === 0) return undefined;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMs(value?: number) {
  if (!isNumber(value)) return "-";
  return `${value.toFixed(1)}ms`;
}

export function useLynxPerformanceObserver(identifier: string) {
  const [samples, setSamples] = useState<Measurement[]>([]);

  const subscription = useMemo<Subscription>(() => {
    "background only";

    const performance = getLynxPerformance();
    const disconnects: Array<() => void> = [];
    let hasObserver = false;
    let hasTiming = false;
    let hasError = false;

    if (performance?.createObserver) {
      try {
        const observer = performance.createObserver((entry) => {
          const entryIdentifier = entry.identifier ?? entry.name ?? "";
          if (!entryIdentifier.startsWith(identifier)) {
            return;
          }

          const measurement = readMeasurement(entry);
          if (!measurement) return;

          setSamples((current) =>
            appendMeasurement(current, {
              ...measurement,
              id: entryIdentifier,
              source: "observer",
            }),
          );
        });

        observer.observe(["pipeline"]);
        disconnects.push(() => observer.disconnect());
        hasObserver = true;
      } catch {
        hasError = true;
      }
    }

    if (performance?.addTimingListener) {
      try {
        const handleTiming = (info: TimingInfo) => {
          const measurement = readTimingMeasurement(identifier, info);
          if (!measurement) return;

          setSamples((current) => appendMeasurement(current, measurement));
        };

        const listener: TimingListener = {
          onSetup: handleTiming,
          onUpdate: handleTiming,
        };

        performance.addTimingListener(listener);
        disconnects.push(() => performance.removeTimingListener?.(listener));
        hasTiming = true;
      } catch {
        hasError = true;
      }
    }

    if (!hasObserver && !hasTiming) {
      return { status: hasError ? "error" : "unsupported" };
    }

    if (hasObserver && hasTiming) {
      return {
        disconnect: () => {
          disconnects.forEach((disconnect) => {
            disconnect();
          });
        },
        status: "observer+timing",
      };
    }

    return {
      disconnect: () => {
        disconnects.forEach((disconnect) => {
          disconnect();
        });
      },
      status: hasObserver ? "observer" : "timing",
    };
  }, [identifier]);

  useEffect(() => () => subscription.disconnect?.(), [subscription]);

  const summary = useMemo(
    () => ({
      last: samples.length > 0 ? samples[samples.length - 1] : null,
      average: average(samples),
      count: samples.length,
      status: subscription.status,
    }),
    [samples, subscription.status],
  );

  return summary;
}

function MetricValue({ label, value }: { label: string; value?: number }) {
  return (
    <view className="flex-1 min-w-[72px] p-x2 rounded-r2 bg-bg-neutral-weak">
      <text className="t1-regular text-fg-neutral-subtle">{label}</text>
      <text className="t2-bold text-fg-neutral mt-x0_5">{formatMs(value)}</text>
    </view>
  );
}

function MetricRow({ title, measurement }: { title: string; measurement: Measurement | null }) {
  return (
    <view className="flex flex-col gap-x1">
      <text className="t2-bold text-fg-neutral">{title}</text>
      <view className="flex flex-row flex-wrap gap-x1">
        <MetricValue label="total" value={measurement?.total} />
        <MetricValue label="render" value={measurement?.render} />
        <MetricValue label="resolve" value={measurement?.resolve} />
        <MetricValue label="layout" value={measurement?.layout} />
        <MetricValue label="paint" value={measurement?.paint} />
        <MetricValue label="actualFmp" value={measurement?.actualFmp} />
        <MetricValue label="totalFmp" value={measurement?.totalActualFmp} />
      </view>
    </view>
  );
}

export function PerformancePanel({
  identifier,
  revision,
  onRerender,
}: {
  identifier: string;
  revision: number;
  onRerender: () => void;
}) {
  const {
    last,
    average: averageMeasurement,
    count,
    status,
  } = useLynxPerformanceObserver(identifier);

  function handleRerender() {
    getLynxPerformance()?.profileMark?.("layout-stress-rerender", {
      args: { identifier, revision: String(revision + 1) },
    });
    onRerender();
  }

  return (
    <view className="flex flex-col gap-x3 p-x3 rounded-r3 border border-stroke-neutral-muted bg-bg-layer-default">
      <view className="flex flex-row items-center justify-between gap-x2">
        <view className="flex flex-col gap-x0_5">
          <text className="t3-bold text-fg-neutral">Performance</text>
          <text className="t1-regular text-fg-neutral-subtle">
            {`${status} | samples ${count} | run ${revision}`}
          </text>
        </view>
        <view bindtap={handleRerender} className="py-x2 px-x3 rounded-full bg-bg-brand-solid">
          <text className="t2-bold text-palette-static-white">Rerender</text>
        </view>
      </view>

      <MetricRow title="Last pipeline" measurement={last} />
      <MetricRow title="Average" measurement={averageMeasurement} />
    </view>
  );
}
