import { useRef, useState } from '@lynx-js/react';
import { bottomSheetVariantMap } from '@seed-design/lynx-css/recipes/bottom-sheet';
import { vars } from '@seed-design/lynx-css/vars';
import { type BottomSheetRootRef } from '@seed-design/lynx-react';

import {
  VariantCatalog,
  type VariantAxis,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import { ActionButton } from '../seed-design/ui/action-button';
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
  type BottomSheetRootProps,
} from '../seed-design/ui/bottom-sheet';

const SNAP_POINTS_FIT_80: Array<number | string> = ['fit', '80%'];
const SNAP_POINTS_FIT: Array<number | string> = ['fit'];

const { $color } = vars;

type BottomSheetHeaderAlign = NonNullable<BottomSheetRootProps['headerAlign']>;

const variants: readonly VariantAxis[] = [
  {
    key: 'headerAlign',
    options: bottomSheetVariantMap.headerAlign,
    defaultValue: 'left',
  },
  {
    key: 'skipAnimation',
    options: bottomSheetVariantMap.skipAnimation,
    defaultValue: false,
  },
];

function renderBottomSheet(values: VariantValues) {
  const headerAlign = values.headerAlign as BottomSheetHeaderAlign;
  const skipAnimation = Boolean(values.skipAnimation);

  return (
    <BottomSheetRoot
      headerAlign={headerAlign}
      skipAnimation={skipAnimation}
      snapPoints={SNAP_POINTS_FIT_80}
    >
      <BottomSheetTrigger
        style={{
          padding: '10px 16px',
          backgroundColor: $color.bg.brandSolid,
          borderRadius: '8px',
          alignSelf: 'flex-start',
        }}
      >
        <text style={{ color: $color.fg.brandContrast }}>Open sheet</text>
      </BottomSheetTrigger>
      <BottomSheetContent
        title={`Header ${headerAlign}`}
        description={skipAnimation ? 'Animation skipped' : 'Default animation'}
        showHandle
      >
        <BottomSheetBody>
          <text>Use the trigger to inspect this variant.</text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <text>Footer area</text>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
      {children}
    </text>
  );
}

function BottomSheetExamples() {
  const uncontrolledRef = useRef<BottomSheetRootRef>(null);
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <scroll-view
      scroll-y
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        flex: 1,
        padding: '16px',
      }}
    >
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>BottomSheet</text>

      <SectionTitle>Uncontrolled (Trigger 기반)</SectionTitle>
      <BottomSheetRoot snapPoints={SNAP_POINTS_FIT_80}>
        <BottomSheetTrigger
          style={{
            padding: '10px 16px',
            backgroundColor: $color.bg.brandSolid,
            borderRadius: '8px',
            alignSelf: 'flex-start',
          }}
        >
          <text style={{ color: $color.fg.brandContrast }}>Trigger 탭</text>
        </BottomSheetTrigger>
        <BottomSheetContent
          title="기본 Bottom Sheet"
          description="Trigger를 탭하면 열립니다."
          showHandle
        >
          <BottomSheetBody>
            <text>본문에 자유로운 Lynx 엘리먼트를 배치할 수 있습니다.</text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <text>하단 액션 영역</text>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>

      <SectionTitle>Imperative ref</SectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <ActionButton bindtap={() => uncontrolledRef.current?.open()}>
          open()
        </ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.snapTo(0)}>
          snapTo(0)
        </ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.snapTo(1)}>
          snapTo(1)
        </ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.close()}>
          close()
        </ActionButton>
      </view>
      <BottomSheetRoot ref={uncontrolledRef} snapPoints={SNAP_POINTS_FIT_80}>
        <BottomSheetContent title="Imperative 예제" showHandle>
          <BottomSheetBody>
            <text>위 버튼으로 snapTo/open/close를 호출합니다.</text>
          </BottomSheetBody>
        </BottomSheetContent>
      </BottomSheetRoot>

      <SectionTitle>Controlled</SectionTitle>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        <ActionButton bindtap={() => setControlledOpen(true)}>
          open=true
        </ActionButton>
        <ActionButton bindtap={() => setControlledOpen(false)}>
          open=false
        </ActionButton>
      </view>
      <BottomSheetRoot
        open={controlledOpen}
        onOpenChange={setControlledOpen}
        snapPoints={SNAP_POINTS_FIT}
      >
        <BottomSheetContent
          title="Controlled 예제"
          description="backdrop 탭 / drag-to-close 시 onOpenChange로 외부 state가 갱신됩니다."
        />
      </BottomSheetRoot>
    </scroll-view>
  );
}

export function BottomSheetPage() {
  return (
    <VariantCatalog variants={variants} examples={<BottomSheetExamples />}>
      {(values) => renderBottomSheet(values)}
    </VariantCatalog>
  );
}
