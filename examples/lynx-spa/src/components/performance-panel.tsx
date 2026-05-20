import { useEffect, useMemo, useState } from '@lynx-js/react';
import { vars } from '@seed-design/lynx-css/vars';

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
  createObserver?: (
    callback: (entry: PipelineEntry) => void,
  ) => PerformanceObserver;
  profileMark?: (
    traceName: string,
    option?: { args?: Record<string, string> },
  ) => void;
  removeTimingListener?: (listener: TimingListener) => void;
};

type Measurement = {
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

type ObserverStatus = 'observer' | 'timing' | 'unsupported' | 'error';

type Subscription = {
  disconnect?: () => void;
  status: ObserverStatus;
};

const MAX_SAMPLES = 20;

declare const lynx: { performance?: LynxPerformance } | undefined;

function getLynxPerformance() {
  'background only';

  if (typeof lynx !== 'undefined') {
    return lynx?.performance;
  }

  return (globalThis as { lynx?: { performance?: LynxPerformance } }).lynx
    ?.performance;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
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

function readTimingMeasurement(
  identifier: string,
  info: TimingInfo,
): Measurement | null {
  const updateTimings = info.update_timings ?? {};
  const timingKey = Object.keys(updateTimings).find((key) =>
    key.startsWith(identifier),
  );

  if (!timingKey) return null;

  const timing = updateTimings[timingKey];

  return {
    render: toDuration(timing.create_vdom_end, timing.create_vdom_start),
    resolve: toDuration(timing.dispatch_end, timing.dispatch_start),
    layout: toDuration(timing.layout_end, timing.layout_start),
    paint: toDuration(timing.draw_end, timing.create_vdom_start),
    actualFmp: info.metrics?.actual_fmp,
    totalActualFmp: info.metrics?.total_actual_fmp,
  };
}

function average(samples: Measurement[]) {
  if (samples.length === 0) return null;

  return {
    total: averageValue(samples, 'total'),
    render: averageValue(samples, 'render'),
    resolve: averageValue(samples, 'resolve'),
    layout: averageValue(samples, 'layout'),
    paint: averageValue(samples, 'paint'),
    actualFmp: averageValue(samples, 'actualFmp'),
    totalActualFmp: averageValue(samples, 'totalActualFmp'),
  };
}

function averageValue(samples: Measurement[], key: keyof Measurement) {
  const values = samples.map((sample) => sample[key]).filter(isNumber);

  if (values.length === 0) return undefined;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMs(value?: number) {
  if (!isNumber(value)) return '-';
  return `${value.toFixed(1)}ms`;
}

export function useLynxPerformanceObserver(identifier: string) {
  const [samples, setSamples] = useState<Measurement[]>([]);

  const subscription = useMemo<Subscription>(() => {
    'background only';

    const performance = getLynxPerformance();

    if (!performance?.createObserver) {
      if (!performance?.addTimingListener) {
        return { status: 'unsupported' };
      }

      try {
        const listener: TimingListener = {
          onSetup: (info) => {
            const measurement = readTimingMeasurement(identifier, info);
            if (!measurement) return;
            setSamples((current) =>
              [...current, measurement].slice(-MAX_SAMPLES),
            );
          },
          onUpdate: (info) => {
            const measurement = readTimingMeasurement(identifier, info);
            if (!measurement) return;
            setSamples((current) =>
              [...current, measurement].slice(-MAX_SAMPLES),
            );
          },
        };

        performance.addTimingListener(listener);

        return {
          disconnect: () => performance.removeTimingListener?.(listener),
          status: 'timing',
        };
      } catch {
        return { status: 'error' };
      }
    }

    try {
      const observer = performance.createObserver((entry) => {
        const entryIdentifier = entry.identifier ?? entry.name ?? '';
        if (!entryIdentifier.startsWith(identifier)) {
          return;
        }

        const measurement = readMeasurement(entry);
        if (!measurement) return;

        setSamples((current) => [...current, measurement].slice(-MAX_SAMPLES));
      });

      observer.observe(['pipeline']);

      return {
        disconnect: () => observer.disconnect(),
        status: 'observer',
      };
    } catch {
      return { status: 'error' };
    }
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
    <view
      style={{
        flex: 1,
        minWidth: '72px',
        padding: vars.$dimension.x2,
        borderRadius: vars.$radius.r2,
        background: vars.$color.bg.neutralWeak,
      }}
    >
      <text
        style={{
          color: vars.$color.fg.neutralSubtle,
          fontSize: vars.$fontSize.t1,
          lineHeight: vars.$lineHeight.t1,
          fontWeight: '400',
        }}
      >
        {label}
      </text>
      <text
        style={{
          color: vars.$color.fg.neutral,
          fontSize: vars.$fontSize.t2,
          lineHeight: vars.$lineHeight.t2,
          fontWeight: '700',
          marginTop: vars.$dimension.x0_5,
        }}
      >
        {formatMs(value)}
      </text>
    </view>
  );
}

function MetricRow({
  title,
  measurement,
}: {
  title: string;
  measurement: Measurement | null;
}) {
  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: vars.$dimension.x1,
      }}
    >
      <text
        style={{
          color: vars.$color.fg.neutral,
          fontSize: vars.$fontSize.t2,
          lineHeight: vars.$lineHeight.t2,
          fontWeight: '700',
        }}
      >
        {title}
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: vars.$dimension.x1,
        }}
      >
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
    getLynxPerformance()?.profileMark?.('layout-stress-rerender', {
      args: { identifier, revision: String(revision + 1) },
    });
    onRerender();
  }

  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: vars.$dimension.x3,
        padding: vars.$dimension.x3,
        borderRadius: vars.$radius.r3,
        borderWidth: '1px',
        borderColor: vars.$color.stroke.neutralMuted,
        background: vars.$color.bg.layerDefault,
      }}
    >
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: vars.$dimension.x2,
        }}
      >
        <view style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <text
            style={{
              color: vars.$color.fg.neutral,
              fontSize: vars.$fontSize.t3,
              lineHeight: vars.$lineHeight.t3,
              fontWeight: '700',
            }}
          >
            Performance
          </text>
          <text
            style={{
              color: vars.$color.fg.neutralSubtle,
              fontSize: vars.$fontSize.t1,
              lineHeight: vars.$lineHeight.t1,
              fontWeight: '400',
            }}
          >
            {`${status} | samples ${count} | run ${revision}`}
          </text>
        </view>
        <view
          bindtap={handleRerender}
          style={{
            padding: `${vars.$dimension.x2} ${vars.$dimension.x3}`,
            borderRadius: vars.$radius.full,
            background: vars.$color.bg.brandSolid,
          }}
        >
          <text
            style={{
              color: vars.$color.palette.staticWhite,
              fontSize: vars.$fontSize.t2,
              lineHeight: vars.$lineHeight.t2,
              fontWeight: '700',
            }}
          >
            Rerender
          </text>
        </view>
      </view>

      <MetricRow title="Last pipeline" measurement={last} />
      <MetricRow title="Average" measurement={averageMeasurement} />
    </view>
  );
}
