import { useEffect, useState } from '@lynx-js/react';
import { ProgressCircle } from '@seed-design/lynx-react';

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
      <ProgressCircle.Root tone="brand" size="40" minValue={0} maxValue={1} value={value}>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Root>
      <text style={{ fontSize: '14px' }}>{`${Math.round(value * 100)}%`}</text>
    </view>
  );
}

export function ProgressCirclePage() {
  const [progress, setProgress] = useState(0.3);

  return (
    <view style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>
        ProgressCircle
      </text>

      <text style={{ fontSize: '16px', fontWeight: 'bold' }}>
        Indeterminate
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <ProgressCircle.Root tone="neutral" size="40">
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
        <ProgressCircle.Root tone="brand" size="40">
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
        <view
          style={{
            backgroundColor: '#222',
            borderRadius: '8px',
            padding: '8px',
          }}
        >
          <ProgressCircle.Root tone="staticWhite" size="40">
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Root>
        </view>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Sizes
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <ProgressCircle.Root tone="brand" size="24">
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
        <ProgressCircle.Root tone="brand" size="40">
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Determinate
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <ProgressCircle.Root
          tone="neutral"
          size="40"
          minValue={0}
          maxValue={1}
          value={0.25}
        >
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
        <ProgressCircle.Root
          tone="brand"
          size="40"
          minValue={0}
          maxValue={1}
          value={0.5}
        >
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
        <ProgressCircle.Root
          tone="brand"
          size="40"
          minValue={0}
          maxValue={1}
          value={0.75}
        >
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
        <ProgressCircle.Root
          tone="brand"
          size="40"
          minValue={0}
          maxValue={1}
          value={1}
        >
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Interactive
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <ProgressCircle.Root
          tone="brand"
          size="40"
          minValue={0}
          maxValue={1}
          value={progress}
        >
          <ProgressCircle.Track />
          <ProgressCircle.Range />
        </ProgressCircle.Root>
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

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Transition Test (auto +10% every 1s)
      </text>
      <AutoProgressTest />
    </view>
  );
}
