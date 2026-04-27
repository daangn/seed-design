import { type ReactNode, useMemo, useState } from '@lynx-js/react';

type PrimitiveValue = string | number | boolean;
type VariantMap = Record<string, readonly PrimitiveValue[]>;

export interface VariantPlaygroundProps {
  /**
   * 여러 recipe 의 variantMap 을 병합해 받는다 (wrapper + mark 등). 같은 key 중복 시
   * 뒤 항목이 이긴다. recipe 생성물에서 `{recipe}VariantMap` 을 import 해서 그대로 전달.
   * boolean 옵션(`[true, false]`) 을 가진 variant 는 자동으로 toggle pill 로 렌더된다.
   */
  variantMaps: readonly VariantMap[];
  /** 초기 값 매핑 (prop 이름 → 값). 지정되지 않은 variant 는 variantMap 의 첫 값이 적용된다. */
  initialValues?: Record<string, PrimitiveValue>;
  /**
   * preview 영역. 현재 값 스냅샷과 setter 를 받아 실제 컴포넌트를 렌더한다.
   * setter 는 controlled state (예: `checked`) 를 playground 로 되돌릴 때 사용.
   */
  children: (
    values: Record<string, PrimitiveValue>,
    setValue: (key: string, value: PrimitiveValue) => void,
  ) => ReactNode;
}

function isBooleanOptions(
  options: readonly PrimitiveValue[],
): options is readonly boolean[] {
  return options.length > 0 && options.every((v) => typeof v === 'boolean');
}

const toLabel = (value: PrimitiveValue) => String(value);

export function VariantPlayground(props: VariantPlaygroundProps) {
  const { variantMaps, initialValues = {}, children } = props;

  const mergedMap = useMemo<VariantMap>(() => {
    const result: Record<string, readonly PrimitiveValue[]> = {};
    for (const map of variantMaps) {
      for (const [key, options] of Object.entries(map)) {
        result[key] = options;
      }
    }
    return result;
  }, [variantMaps]);

  const [values, setValues] = useState<Record<string, PrimitiveValue>>(() => {
    const init: Record<string, PrimitiveValue> = { ...initialValues };
    for (const [key, options] of Object.entries(mergedMap)) {
      if (key in init || options.length === 0) continue;
      // boolean variant 는 false 를 기본으로 (checked/disabled/indeterminate 등 — 명시적 활성화)
      init[key] = isBooleanOptions(options)
        ? false
        : (options[0] as PrimitiveValue);
    }
    return init;
  });

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
      {/* Preview — 남은 공간 + 중앙 정렬 */}
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
        {children(values, setValue)}
      </view>

      {/* Controls — 하단 고정 */}
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
            {Object.entries(mergedMap).map(([key, options]) =>
              isBooleanOptions(options) ? (
                <BooleanRow
                  key={key}
                  name={key}
                  current={!!values[key]}
                  onChange={(next) => setValue(key, next)}
                />
              ) : (
                <VariantRow
                  key={key}
                  name={key}
                  options={options}
                  current={values[key]}
                  onChange={(next) => setValue(key, next)}
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
