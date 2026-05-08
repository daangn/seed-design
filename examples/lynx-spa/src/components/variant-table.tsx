import { type ReactNode, useMemo } from '@lynx-js/react';

import type {
  PrimitiveValue,
  VariantAxis,
  VariantValues,
} from './variant-playground.jsx';

export interface VariantTableProps {
  variants: readonly VariantAxis[];
  children: (values: VariantValues) => ReactNode;
}

type TableEntry =
  | { type: 'header'; key: string; axis: VariantAxis }
  | {
      type: 'row';
      key: string;
      axis: VariantAxis;
      option: PrimitiveValue;
      values: VariantValues;
    };

function toDefaultValues(variants: readonly VariantAxis[]): VariantValues {
  const result: VariantValues = {};
  for (const variant of variants) result[variant.key] = variant.defaultValue;
  return result;
}

export function VariantTable(props: VariantTableProps) {
  const { variants, children } = props;

  const entries = useMemo<TableEntry[]>(() => {
    const defaults = toDefaultValues(variants);
    const result: TableEntry[] = [];
    for (const axis of variants) {
      result.push({ type: 'header', key: `header-${axis.key}`, axis });
      for (const option of axis.options) {
        result.push({
          type: 'row',
          key: `row-${axis.key}-${String(option)}`,
          axis,
          option,
          values: { ...defaults, [axis.key]: option },
        });
      }
    }
    return result;
  }, [variants]);

  return (
    <list
      list-type="single"
      span-count={1}
      scroll-orientation="vertical"
      style={{ flex: 1, width: '100%' }}
    >
      {entries.map((entry) => (
        <list-item key={entry.key} item-key={entry.key}>
          {entry.type === 'header' ? (
            <SectionHeader axis={entry.axis} />
          ) : (
            <Row
              axis={entry.axis}
              option={entry.option}
              values={entry.values}
              renderComponent={children}
            />
          )}
        </list-item>
      ))}
    </list>
  );
}

function SectionHeader({ axis }: { axis: VariantAxis }) {
  return (
    <view
      style={{
        paddingTop: '14px',
        paddingBottom: '8px',
        paddingLeft: '12px',
        paddingRight: '12px',
        backgroundColor: '#f5f5f5',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#ddd',
      }}
    >
      <text style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
        {axis.label ?? axis.key}
      </text>
      <text style={{ fontSize: '10px', lineHeight: '14px', color: '#777' }}>
        {`default: ${String(axis.defaultValue)}`}
      </text>
    </view>
  );
}

function Row({
  axis,
  option,
  values,
  renderComponent,
}: {
  axis: VariantAxis;
  option: PrimitiveValue;
  values: VariantValues;
  renderComponent: (values: VariantValues) => ReactNode;
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
          width: '36%',
          display: 'flex',
          flexDirection: 'column',
          paddingRight: '12px',
        }}
      >
        <text
          style={{
            fontSize: '11px',
            lineHeight: '16px',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {String(option)}
        </text>
        <text
          style={{
            fontSize: '10px',
            lineHeight: '14px',
            color: '#777',
          }}
        >
          {axis.label ?? axis.key}
        </text>
      </view>
      <view
        style={{
          width: '64%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {renderComponent(values)}
      </view>
    </view>
  );
}
