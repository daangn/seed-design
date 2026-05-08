import { type ReactNode, useState } from '@lynx-js/react';

import {
  VariantPlayground,
  type SetVariantValue,
  type VariantAxis,
  type VariantPlaygroundProps,
  type VariantValues,
} from './variant-playground.jsx';
import { VariantTable } from './variant-table.jsx';

export type {
  PrimitiveValue,
  SetVariantValue,
  VariantAxis,
  VariantValues,
} from './variant-playground.jsx';

type Mode = 'playground' | 'table' | 'examples';

export interface VariantCatalogProps extends VariantPlaygroundProps {
  examples?: ReactNode;
}

/**
 * 컴포넌트 카탈로그 페이지의 뷰를 탭으로 전환한다.
 *
 * - Playground: 변수 하나하나를 선택하며 단일 미리보기 (디테일 검사)
 * - Table: variant 축 하나씩 펼쳐 빠르게 비교 (나머지는 default 고정)
 * - Examples: 사용 시나리오 중심 수동 예시
 *
 * 두 모드 모두 같은 `children` render function 을 공유한다.
 */
export function VariantCatalog(props: VariantCatalogProps) {
  const { children, variants, examples } = props;
  const [mode, setMode] = useState<Mode>('playground');
  const tabs: Mode[] =
    examples == null
      ? ['playground', 'table']
      : ['playground', 'table', 'examples'];

  return (
    <view
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <view
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          flexShrink: 0,
          backgroundColor: '#fafafa',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: '#e5e5e5',
        }}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab}
            active={mode === tab}
            width={`${100 / tabs.length}%`}
            onTap={() => setMode(tab)}
            label={toTabLabel(tab)}
          />
        ))}
      </view>
      {mode === 'playground' ? (
        <VariantPlayground variants={variants}>{children}</VariantPlayground>
      ) : mode === 'table' ? (
        <VariantTable variants={variants}>
          {(values) => renderForTable(children, values)}
        </VariantTable>
      ) : (
        <view style={{ flex: 1, minHeight: 0 }}>{examples}</view>
      )}
    </view>
  );
}

const noopSetValue: SetVariantValue = () => {};
function renderForTable(
  children: VariantPlaygroundProps['children'],
  values: VariantValues,
): ReactNode {
  return children(values, noopSetValue);
}

function toTabLabel(mode: Mode) {
  if (mode === 'playground') return 'Playground';
  if (mode === 'table') return 'Table';
  return 'Examples';
}

function TabButton({
  active,
  width,
  onTap,
  label,
}: {
  active: boolean;
  width: string;
  onTap: () => void;
  label: string;
}) {
  return (
    <view
      bindtap={onTap}
      style={{
        width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '14px',
        paddingBottom: '14px',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: active ? '#222' : 'transparent',
      }}
    >
      <text
        style={{
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: active ? 'bold' : 'normal',
          color: active ? '#222222' : '#888888',
        }}
      >
        {label}
      </text>
    </view>
  );
}
