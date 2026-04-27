import { type ReactNode, useMemo } from '@lynx-js/react';

type PrimitiveValue = string | number | boolean;
type VariantMap = Record<string, readonly PrimitiveValue[]>;
type Combination = Record<string, PrimitiveValue>;

export interface VariantTableProps {
  variantMaps: readonly VariantMap[];
  children: (combination: Combination) => ReactNode;
}

function generateCombinations(mergedMap: VariantMap): Combination[] {
  const keys = Object.keys(mergedMap);
  let combos: Combination[] = [{}];
  for (const key of keys) {
    const values = mergedMap[key];
    if (values == null) continue;
    const next: Combination[] = [];
    for (const combo of combos) {
      for (const v of values) next.push({ ...combo, [key]: v });
    }
    combos = next;
  }
  return combos;
}

export function VariantTable(props: VariantTableProps) {
  const { variantMaps, children } = props;

  const mergedMap = useMemo<VariantMap>(() => {
    const result: Record<string, readonly PrimitiveValue[]> = {};
    for (const map of variantMaps) {
      for (const [k, v] of Object.entries(map)) result[k] = v;
    }
    return result;
  }, [variantMaps]);

  const keys = useMemo(() => Object.keys(mergedMap), [mergedMap]);
  const combinations = useMemo(
    () => generateCombinations(mergedMap),
    [mergedMap],
  );

  return (
    <list
      list-type="single"
      span-count={1}
      scroll-orientation="vertical"
      style={{ flex: 1, width: '100%' }}
    >
      <list-item item-key="header" key="header">
        <view
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '12px',
            paddingRight: '12px',
            backgroundColor: '#f5f5f5',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#ddd',
          }}
        >
          <text style={{ fontSize: '11px', fontWeight: 'bold', color: '#333' }}>
            {keys.length} variants × {combinations.length} combinations
          </text>
        </view>
      </list-item>
      {combinations.map((combo, i) => (
        <list-item key={`row-${i}`} item-key={`row-${i}`}>
          <Row keys={keys} combo={combo} renderComponent={children} />
        </list-item>
      ))}
    </list>
  );
}

function Row({
  keys,
  combo,
  renderComponent,
}: {
  keys: string[];
  combo: Combination;
  renderComponent: (combo: Combination) => ReactNode;
}) {
  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '12px',
        paddingRight: '12px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#eee',
      }}
    >
      <view
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          paddingRight: '12px',
        }}
      >
        {keys.map((k) => (
          <text
            key={k}
            style={{
              fontSize: '10px',
              lineHeight: '14px',
              color: '#666',
            }}
          >
            {`${k}: ${String(combo[k])}`}
          </text>
        ))}
      </view>
      <view
        style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {renderComponent(combo)}
      </view>
    </view>
  );
}
