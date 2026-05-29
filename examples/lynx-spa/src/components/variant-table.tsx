import { type ReactNode, useMemo } from "@lynx-js/react";

import {
  getVariantDefaultValues,
  type PrimitiveValue,
  type VariantAxis,
  type VariantCatalogValues,
  type VariantValues,
} from "./variant-playground.jsx";

export interface VariantTableProps<
  Variants extends readonly VariantAxis[] = readonly VariantAxis[],
> {
  variants: Variants;
  children: (values: VariantCatalogValues<Variants>) => ReactNode;
}

type TableEntry =
  | { type: "header"; key: string; axis: VariantAxis }
  | {
      type: "row";
      key: string;
      axis: VariantAxis;
      option: PrimitiveValue;
      values: VariantValues;
    };

export function VariantTable<const Variants extends readonly VariantAxis[]>(
  props: VariantTableProps<Variants>,
) {
  const { variants, children } = props;

  const entries = useMemo<TableEntry[]>(() => {
    const defaults = getVariantDefaultValues(variants);
    const result: TableEntry[] = [];
    for (const axis of variants) {
      result.push({ type: "header", key: `header-${axis.key}`, axis });
      for (const option of axis.options) {
        result.push({
          type: "row",
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
    <list list-type="single" span-count={1} scroll-orientation="vertical" className="flex-1 w-full">
      {entries.map((entry) => (
        <list-item key={entry.key} item-key={entry.key}>
          {entry.type === "header" ? (
            <SectionHeader axis={entry.axis} />
          ) : (
            <Row
              axis={entry.axis}
              option={entry.option}
              values={entry.values}
              renderComponent={children as (values: VariantValues) => ReactNode}
            />
          )}
        </list-item>
      ))}
    </list>
  );
}

function SectionHeader({ axis }: { axis: VariantAxis }) {
  return (
    <view className="pt-x3_5 pb-x2 px-x3 bg-bg-neutral-weak border-b border-stroke-neutral-muted">
      <text className="t2-bold text-fg-neutral">{axis.label ?? axis.key}</text>
      <text className="text-[10px] leading-[14px] text-fg-neutral-muted">
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
    <view className="flex flex-row items-center py-x3 px-x3 border-b border-stroke-neutral-subtle">
      <view className="w-[36%] flex flex-col pr-x3">
        <text className="t1-bold text-fg-neutral">{String(option)}</text>
        <text className="text-[10px] leading-[14px] text-fg-neutral-muted">
          {axis.label ?? axis.key}
        </text>
      </view>
      <view className="w-[64%] flex flex-row items-center justify-start">
        {renderComponent(values)}
      </view>
    </view>
  );
}
