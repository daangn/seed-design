import { useRef, useState } from '@lynx-js/react';
import { bottomSheetVariantMap } from '@seed-design/lynx-css/recipes/bottom-sheet';
import { ActionButton, type BottomSheetRootRef } from '@seed-design/lynx-react';

import {
  CatalogExamples,
  CatalogSectionTitle,
} from '../components/catalog-examples.jsx';
import {
  type PreviewState,
  type SetVariantValue,
  type VariantAxis,
  VariantCatalog,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  type BottomSheetRootProps,
  BottomSheetTrigger,
} from '../seed-design/ui/bottom-sheet';

const SNAP_POINTS_FIT_80: Array<number | string> = ['fit', '80%'];
const SNAP_POINTS_FIT: Array<number | string> = ['fit'];

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

const previewStates: readonly PreviewState[] = [
  { key: 'open', defaultValue: false },
];

function renderBottomSheet(values: VariantValues, setValue: SetVariantValue) {
  const headerAlign = values.headerAlign as BottomSheetHeaderAlign;
  const skipAnimation = Boolean(values.skipAnimation);
  const open = Boolean(values.open);

  return (
    <BottomSheetRoot
      headerAlign={headerAlign}
      skipAnimation={skipAnimation}
      open={open}
      onOpenChange={(next) => setValue('open', next)}
      snapPoints={SNAP_POINTS_FIT_80}
    >
      <BottomSheetTrigger
        style={{ alignSelf: 'flex-start' }}
        bindtap={() => setValue('open', true)}
      >
        <ActionButton variant="brandSolid">Open sheet</ActionButton>
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

function BottomSheetExamples() {
  const uncontrolledRef = useRef<BottomSheetRootRef>(null);
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <CatalogExamples title="BottomSheet" gap="16px">
      <CatalogSectionTitle>Uncontrolled (Trigger 기반)</CatalogSectionTitle>
      <BottomSheetRoot snapPoints={SNAP_POINTS_FIT_80}>
        <BottomSheetTrigger style={{ alignSelf: 'flex-start' }}>
          <ActionButton variant="brandSolid">Trigger 탭</ActionButton>
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

      <CatalogSectionTitle>Imperative ref</CatalogSectionTitle>
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

      <CatalogSectionTitle>Controlled</CatalogSectionTitle>
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
    </CatalogExamples>
  );
}

export function BottomSheetPage() {
  return (
    <VariantCatalog
      variants={variants}
      previewStates={previewStates}
      examples={<BottomSheetExamples />}
    >
      {(values, setValue) => renderBottomSheet(values, setValue)}
    </VariantCatalog>
  );
}
