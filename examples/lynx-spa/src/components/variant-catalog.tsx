import { type ReactNode, useState } from '@lynx-js/react';

import {
  VariantPlayground,
  type VariantPlaygroundProps,
} from './variant-playground.jsx';
import { VariantTable } from './variant-table.jsx';

type PrimitiveValue = string | number | boolean;
type Mode = 'playground' | 'table';

export interface VariantCatalogProps extends VariantPlaygroundProps {}

/**
 * 컴포넌트 카탈로그 페이지의 두 가지 뷰를 탭으로 전환한다.
 *
 * - Playground: 변수 하나하나를 선택하며 단일 미리보기 (디테일 검사)
 * - Table: 모든 조합을 매트릭스로 나열 (전체 형태 비교)
 *
 * 두 모드 모두 같은 `children` render function 을 공유한다.
 */
export function VariantCatalog(props: VariantCatalogProps) {
  const { children, ...rest } = props;
  const [mode, setMode] = useState<Mode>('playground');

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
        <TabButton
          active={mode === 'playground'}
          onTap={() => setMode('playground')}
          label="Playground"
        />
        <TabButton
          active={mode === 'table'}
          onTap={() => setMode('table')}
          label="Table"
        />
      </view>
      {mode === 'playground' ? (
        <VariantPlayground {...rest}>{children}</VariantPlayground>
      ) : (
        <VariantTable variantMaps={props.variantMaps}>
          {(combo) => renderForTable(children, combo)}
        </VariantTable>
      )}
    </view>
  );
}

const noopSetValue = () => {};
function renderForTable(
  children: VariantPlaygroundProps['children'],
  combo: Record<string, PrimitiveValue>,
): ReactNode {
  return children(combo, noopSetValue);
}

function TabButton({
  active,
  onTap,
  label,
}: {
  active: boolean;
  onTap: () => void;
  label: string;
}) {
  return (
    <view
      bindtap={onTap}
      style={{
        width: '50%',
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
