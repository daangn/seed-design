import { type ReactNode, useMemo, useState } from "@lynx-js/react";
import { clsx } from "cn";

export type PrimitiveValue = string | number | boolean;
export type VariantValues = Record<string, PrimitiveValue>;
export type SetVariantValue<Values extends VariantValues = VariantValues> = <
  Key extends keyof Values & string,
>(
  key: Key,
  value: Values[Key],
) => void;

export interface VariantAxis<
  Key extends string = string,
  Value extends PrimitiveValue = PrimitiveValue,
> {
  key: Key;
  label?: string;
  options: readonly Value[];
  defaultValue: Value;
}

export interface PreviewState<
  Key extends string = string,
  Value extends PrimitiveValue = PrimitiveValue,
> {
  key: Key;
  label?: string;
  defaultValue: Value;
}

type WidenPrimitive<Value> = Value extends string
  ? string
  : Value extends number
    ? number
    : Value extends boolean
      ? boolean
      : Value;

type VariantAxisValues<Variants extends readonly VariantAxis[]> = {
  [Axis in Variants[number] as Axis["key"]]: Axis extends VariantAxis<string, infer Value>
    ? Value
    : never;
};

type PreviewStateValues<PreviewStates extends readonly PreviewState[]> = {
  [State in PreviewStates[number] as State["key"]]: State extends PreviewState<string, infer Value>
    ? WidenPrimitive<Value>
    : never;
};

export type VariantCatalogValues<
  Variants extends readonly VariantAxis[] = readonly VariantAxis[],
  PreviewStates extends readonly PreviewState[] = readonly PreviewState[],
> = VariantValues & VariantAxisValues<Variants> & PreviewStateValues<PreviewStates>;

export function defineVariantAxes<const Variants extends readonly VariantAxis[]>(
  variants: Variants,
): Variants {
  return variants;
}

export function definePreviewStates<const PreviewStates extends readonly PreviewState[]>(
  previewStates: PreviewStates,
): PreviewStates {
  return previewStates;
}

export interface VariantPlaygroundProps<
  Variants extends readonly VariantAxis[] = readonly VariantAxis[],
  PreviewStates extends readonly PreviewState[] = readonly PreviewState[],
> {
  /**
   * Public하게 조작 가능한 variant 축만 넘긴다. recipe에는 있어도 컴포넌트 prop으로
   * 고정할 수 없는 상태(예: pressed)는 포함하지 않는다.
   */
  variants: Variants;
  /**
   * Preview 오른쪽 아래에 표시할 controlled state 값.
   * variant control에는 없어도 preview에서 setValue로 갱신할 수 있다.
   */
  previewStates?: PreviewStates;
  /**
   * preview 영역. 현재 값 스냅샷과 setter 를 받아 실제 컴포넌트를 렌더한다.
   * setter 는 controlled state (예: `checked`) 를 playground 로 되돌릴 때 사용.
   */
  children: (
    values: VariantCatalogValues<Variants, PreviewStates>,
    setValue: SetVariantValue<VariantCatalogValues<Variants, PreviewStates>>,
  ) => ReactNode;
}

function isBooleanOptions(options: readonly PrimitiveValue[]): options is readonly boolean[] {
  return options.length > 0 && options.every((v) => typeof v === "boolean");
}

const toLabel = (value: PrimitiveValue) => String(value);

export function getVariantDefaultValues(variants: readonly VariantAxis[]): VariantValues {
  const result: VariantValues = {};
  for (const variant of variants) {
    result[variant.key] = variant.defaultValue;
  }
  return result;
}

export function getPreviewStateDefaultValues(
  previewStates: readonly PreviewState[] = [],
): VariantValues {
  const result: VariantValues = {};
  for (const state of previewStates) {
    result[state.key] = state.defaultValue;
  }
  return result;
}

function getDefaultValues(
  variants: readonly VariantAxis[],
  previewStates: readonly PreviewState[] = [],
): VariantValues {
  return {
    ...getVariantDefaultValues(variants),
    ...getPreviewStateDefaultValues(previewStates),
  };
}

function getPreviewStateText(values: VariantValues, previewStates: readonly PreviewState[] = []) {
  if (previewStates.length === 0) return null;

  return previewStates
    .map((state) => {
      const value = values[state.key] ?? state.defaultValue;
      return `${state.label ?? state.key}=${toLabel(value)}`;
    })
    .join(" · ");
}

export function VariantPlayground<
  const Variants extends readonly VariantAxis[],
  const PreviewStates extends readonly PreviewState[] = readonly [],
>(props: VariantPlaygroundProps<Variants, PreviewStates>) {
  const { variants, previewStates, children } = props;

  const defaultValues = useMemo(
    () => getDefaultValues(variants, previewStates),
    [variants, previewStates],
  );

  const [values, setValues] = useState<VariantValues>(() => defaultValues);
  const previewStateText = getPreviewStateText(values, previewStates);

  const setPrimitiveValue = (key: string, value: PrimitiveValue) => {
    setValues((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  };
  const setValue: SetVariantValue<VariantCatalogValues<Variants, PreviewStates>> = (key, value) =>
    setPrimitiveValue(key, value);

  return (
    <view className="flex flex-col flex-1 min-h-0">
      {/* Preview: fills the remaining space and centers the component. */}
      <view className="flex flex-1 items-center justify-center p-x4 overflow-hidden relative">
        {children(values as VariantCatalogValues<Variants, PreviewStates>, setValue)}
        {previewStateText != null && (
          <view className="absolute right-x2 bottom-x2">
            <text className="text-[10px] leading-[12px] text-fg-neutral-muted">
              {previewStateText}
            </text>
          </view>
        )}
      </view>

      {/* Controls: fixed to the bottom with its own scroll area. */}
      <view className="shrink-0 max-h-[45%] border-t border-stroke-neutral-muted bg-bg-layer-fill">
        <scroll-view scroll-y className="max-h-full">
          <view className="flex flex-col gap-x2_5 py-x3 px-x4">
            {variants.map((variant) =>
              isBooleanOptions(variant.options) ? (
                <BooleanRow
                  key={variant.key}
                  name={variant.label ?? variant.key}
                  current={!!values[variant.key]}
                  onChange={(next) => setPrimitiveValue(variant.key, next)}
                />
              ) : (
                <VariantRow
                  key={variant.key}
                  name={variant.label ?? variant.key}
                  options={variant.options}
                  current={values[variant.key]}
                  onChange={(next) => setPrimitiveValue(variant.key, next)}
                />
              ),
            )}
          </view>
        </scroll-view>
      </view>
    </view>
  );
}

function VariantRow({
  name,
  options,
  current,
  onChange,
}: {
  name: string;
  options: readonly PrimitiveValue[];
  current: PrimitiveValue | undefined;
  onChange: (value: PrimitiveValue) => void;
}) {
  return (
    <view className="flex flex-row items-center gap-x2">
      <text className="min-w-[92px] t2-medium text-fg-neutral-muted">{name}</text>
      <view className="flex flex-row flex-wrap gap-x1">
        {options.map((option) => {
          const active = current === option;
          const label = toLabel(option);
          return (
            <view
              key={label}
              bindtap={() => onChange(option)}
              className={clsx(
                "py-x1 px-x2_5 rounded-r1_5 border",
                active
                  ? "bg-bg-neutral-solid border-stroke-neutral-contrast"
                  : "bg-bg-layer-default border-stroke-neutral-muted",
              )}
            >
              <text
                className={clsx(
                  "t2-regular",
                  active ? "text-fg-neutral-inverted" : "text-fg-neutral",
                )}
              >
                {label}
              </text>
            </view>
          );
        })}
      </view>
    </view>
  );
}

function BooleanRow({
  name,
  current,
  onChange,
}: {
  name: string;
  current: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <view className="flex flex-row items-center gap-x2">
      <text className="min-w-[92px] t2-medium text-fg-neutral-muted">{name}</text>
      <view
        bindtap={() => onChange(!current)}
        className={clsx(
          "py-x1 px-x2_5 rounded-r1_5 border",
          current
            ? "bg-bg-neutral-solid border-stroke-neutral-contrast"
            : "bg-bg-layer-default border-stroke-neutral-muted",
        )}
      >
        <text
          className={clsx("t2-regular", current ? "text-fg-neutral-inverted" : "text-fg-neutral")}
        >
          {current ? "true" : "false"}
        </text>
      </view>
    </view>
  );
}
