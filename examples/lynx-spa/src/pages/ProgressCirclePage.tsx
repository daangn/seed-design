import { useEffect, useState } from '@lynx-js/react';
import { progressCircleVariantMap } from '@seed-design/lynx-css/recipes/progress-circle';

import {
  CatalogExamples,
  CatalogSectionTitle,
} from '../components/catalog-examples.jsx';
import {
  VariantCatalog,
  type PreviewState,
  type VariantAxis,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import {
  ProgressCircle,
  type ProgressCircleProps,
} from '../seed-design/ui/progress-circle';

type ProgressCircleTone = NonNullable<ProgressCircleProps['tone']>;
type ProgressCircleSize = NonNullable<ProgressCircleProps['size']>;
type ProgressState = 'indeterminate' | '25%' | '50%' | '75%' | '100%';

const progressValueMap: Record<
  Exclude<ProgressState, 'indeterminate'>,
  number
> = {
  '25%': 0.25,
  '50%': 0.5,
  '75%': 0.75,
  '100%': 1,
};

const variants: readonly VariantAxis[] = [
  {
    key: 'tone',
    options: progressCircleVariantMap.tone,
    defaultValue: 'neutral',
  },
  {
    key: 'size',
    options: progressCircleVariantMap.size,
    defaultValue: '40',
  },
  {
    key: 'progressState',
    label: 'progress',
    options: ['indeterminate', '25%', '50%', '75%', '100%'],
    defaultValue: 'indeterminate',
  },
];

const previewStates: readonly PreviewState[] = [
  { key: 'progressState', label: 'value', defaultValue: 'indeterminate' },
];

function renderProgressCircle(values: VariantValues) {
  const tone = values.tone as ProgressCircleTone;
  const size = values.size as ProgressCircleSize;
  const progressState = values.progressState as ProgressState;
  const progressValue =
    progressState === 'indeterminate'
      ? undefined
      : progressValueMap[progressState];

  const circle =
    progressValue == null ? (
      <ProgressCircle tone={tone} size={size} />
    ) : (
      <ProgressCircle
        tone={tone}
        size={size}
        minValue={0}
        maxValue={1}
        value={progressValue}
      />
    );

  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        alignItems: 'center',
      }}
    >
      {tone === 'staticWhite' ? (
        <view
          style={{
            backgroundColor: '#222',
            borderRadius: '8px',
            padding: '8px',
          }}
        >
          {circle}
        </view>
      ) : (
        circle
      )}
      <text style={{ fontSize: '13px' }}>{progressState}</text>
    </view>
  );
}

function AutoProgressTest() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((v) => (v >= 1 ? 0 : Math.min(1, v + 0.1)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <ProgressCircle
        tone="brand"
        size="40"
        minValue={0}
        maxValue={1}
        value={value}
      />
      <text style={{ fontSize: '14px' }}>{`${Math.round(value * 100)}%`}</text>
    </view>
  );
}

function ProgressCircleExamples() {
  const [progress, setProgress] = useState(0.3);

  return (
    <CatalogExamples title="ProgressCircle" gap="12px">
      <CatalogSectionTitle>Indeterminate</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <ProgressCircle tone="neutral" size="40" />
        <ProgressCircle tone="brand" size="40" />
        <view
          style={{
            backgroundColor: '#222',
            borderRadius: '8px',
            padding: '8px',
          }}
        >
          <ProgressCircle tone="staticWhite" size="40" />
        </view>
      </view>

      <CatalogSectionTitle>Sizes</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <ProgressCircle tone="brand" size="24" />
        <ProgressCircle tone="brand" size="40" />
      </view>

      <CatalogSectionTitle>Determinate</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <ProgressCircle
          tone="neutral"
          size="40"
          minValue={0}
          maxValue={1}
          value={0.25}
        />
        <ProgressCircle
          tone="brand"
          size="40"
          minValue={0}
          maxValue={1}
          value={0.5}
        />
        <ProgressCircle
          tone="brand"
          size="40"
          minValue={0}
          maxValue={1}
          value={0.75}
        />
        <ProgressCircle
          tone="brand"
          size="40"
          minValue={0}
          maxValue={1}
          value={1}
        />
      </view>

      <CatalogSectionTitle>Interactive</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <ProgressCircle
          tone="brand"
          size="40"
          minValue={0}
          maxValue={1}
          value={progress}
        />
        <text
          style={{ fontSize: '14px' }}
        >{`${Math.round(progress * 100)}%`}</text>
      </view>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        <view
          bindtap={() => setProgress((p) => Math.max(0, p - 0.1))}
          style={{
            padding: '8px 16px',
            backgroundColor: '#eee',
            borderRadius: '6px',
          }}
        >
          <text style={{ fontSize: '14px' }}>- 10%</text>
        </view>
        <view
          bindtap={() => setProgress((p) => Math.min(1, p + 0.1))}
          style={{
            padding: '8px 16px',
            backgroundColor: '#eee',
            borderRadius: '6px',
          }}
        >
          <text style={{ fontSize: '14px' }}>+ 10%</text>
        </view>
      </view>

      <CatalogSectionTitle>
        Transition Test (auto +10% every 1s)
      </CatalogSectionTitle>
      <AutoProgressTest />
    </CatalogExamples>
  );
}

export function ProgressCirclePage() {
  return (
    <VariantCatalog
      variants={variants}
      previewStates={previewStates}
      examples={<ProgressCircleExamples />}
    >
      {(values) => renderProgressCircle(values)}
    </VariantCatalog>
  );
}
