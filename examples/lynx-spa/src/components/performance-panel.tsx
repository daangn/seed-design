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
  createObserver?: (
    callback: (entry: PipelineEntry) => void,
  ) => PerformanceObserver;
  profileMark?: (
    traceName: string,
    option?: { args?: Record<string, string> },
  ) => void;
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

type ObserverStatus = 'listening' | 'unsupported' | 'error';

const MAX_SAMPLES = 20;

function getLynxPerformance() {
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
  const [status, setStatus] = useState<ObserverStatus>('unsupported');
  const [samples, setSamples] = useState<Measurement[]>([]);

  useEffect(() => {
    const performance = getLynxPerformance();

    if (!performance?.createObserver) {
      setStatus('unsupported');
      return;
    }

    setStatus('listening');

    try {
      const observer = performance.createObserver((entry) => {
        if (entry.identifier !== identifier && entry.name !== identifier)
          return;

        const measurement = readMeasurement(entry);
        if (!measurement) return;

        setSamples((current) => [...current, measurement].slice(-MAX_SAMPLES));
      });

      observer.observe(['pipeline']);

      return () => observer.disconnect();
    } catch {
      setStatus('error');
    }
  }, [identifier]);

  const summary = useMemo(
    () => ({
      last: samples.length > 0 ? samples[samples.length - 1] : null,
      average: average(samples),
      count: samples.length,
      status,
    }),
    [samples, status],
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
              color: vars.$color.fg.brandContrast,
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
