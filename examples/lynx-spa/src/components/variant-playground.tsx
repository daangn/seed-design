import { type ReactNode, useMemo, useState } from '@lynx-js/react';

export type PrimitiveValue = string | number | boolean;
export type VariantValues = Record<string, PrimitiveValue>;
export type SetVariantValue = (key: string, value: PrimitiveValue) => void;

export interface VariantRenderMeta {
  interactive: boolean;
}

export interface VariantAxis {
  key: string;
  label?: string;
  options: readonly PrimitiveValue[];
  defaultValue: PrimitiveValue;
}

export interface VariantPlaygroundProps {
  /**
   * Public하게 조작 가능한 variant 축만 넘긴다. recipe에는 있어도 컴포넌트 prop으로
   * 고정할 수 없는 상태(예: pressed)는 포함하지 않는다.
   */
  variants: readonly VariantAxis[];
  /**
   * preview 영역. 현재 값 스냅샷과 setter 를 받아 실제 컴포넌트를 렌더한다.
   * setter 는 controlled state (예: `checked`) 를 playground 로 되돌릴 때 사용.
   */
  children: (
    values: VariantValues,
    setValue: SetVariantValue,
    meta: VariantRenderMeta,
  ) => ReactNode;
}

function isBooleanOptions(
  options: readonly PrimitiveValue[],
): options is readonly boolean[] {
  return options.length > 0 && options.every((v) => typeof v === 'boolean');
}

const toLabel = (value: PrimitiveValue) => String(value);

export function getVariantDefaultValues(
  variants: readonly VariantAxis[],
): VariantValues {
  const result: VariantValues = {};
  for (const variant of variants) {
    result[variant.key] = variant.defaultValue;
  }
  return result;
}

export function VariantPlayground(props: VariantPlaygroundProps) {
  const { variants, children } = props;

  const defaultValues = useMemo(
    () => getVariantDefaultValues(variants),
    [variants],
  );

  const [values, setValues] = useState<VariantValues>(() => defaultValues);

  const setValue = (key: string, value: PrimitiveValue) => {
    setValues((prev) =>
      prev[key] === value ? prev : { ...prev, [key]: value },
    );
  };

  return (
    <view
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {/* Preview: fills the remaining space and centers the component. */}
      <view
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          overflow: 'hidden',
        }}
      >
        {children(values, setValue, { interactive: true })}
      </view>

      {/* Controls: fixed to the bottom with its own scroll area. */}
      <view
        style={{
          flexShrink: 0,
          maxHeight: '45%',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: '#e5e5e5',
          backgroundColor: '#f7f7f7',
        }}
      >
        <scroll-view scroll-y style={{ maxHeight: '100%' }}>
          <view
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '12px 16px',
            }}
          >
            {variants.map((variant) =>
              isBooleanOptions(variant.options) ? (
                <BooleanRow
                  key={variant.key}
                  name={variant.label ?? variant.key}
                  current={!!values[variant.key]}
                  onChange={(next) => setValue(variant.key, next)}
                />
              ) : (
                <VariantRow
                  key={variant.key}
                  name={variant.label ?? variant.key}
                  options={variant.options}
                  current={values[variant.key]}
                  onChange={(next) => setValue(variant.key, next)}
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
    <view
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <text
        style={{
          minWidth: '92px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#555',
        }}
      >
        {name}
      </text>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        {options.map((option) => {
          const active = current === option;
          const label = toLabel(option);
          return (
            <view
              key={label}
              bindtap={() => onChange(option)}
              style={{
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRadius: '6px',
                backgroundColor: active ? '#222' : '#fff',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: active ? '#222' : '#d0d0d0',
              }}
            >
              <text
                style={{
                  fontSize: '12px',
                  color: active ? '#fff' : '#333',
                }}
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
    <view
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <text
        style={{
          minWidth: '92px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#555',
        }}
      >
        {name}
      </text>
      <view
        bindtap={() => onChange(!current)}
        style={{
          paddingTop: '4px',
          paddingBottom: '4px',
          paddingLeft: '10px',
          paddingRight: '10px',
          borderRadius: '6px',
          backgroundColor: current ? '#222' : '#fff',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: current ? '#222' : '#d0d0d0',
        }}
      >
        <text
          style={{
            fontSize: '12px',
            color: current ? '#fff' : '#333',
          }}
        >
          {current ? 'true' : 'false'}
        </text>
      </view>
    </view>
  );
}
