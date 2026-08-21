import { useRef, useState } from "@lynx-js/react";
import { bottomSheetVariantMap } from "@seed-design/lynx-css/recipes/bottom-sheet";
import { ActionButton } from "@seed-design/lynx-react";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import {
  definePreviewStates,
  defineVariantAxes,
  type SetVariantValue,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  type BottomSheetRootRef,
  BottomSheetTrigger,
} from "../seed-design/ui/bottom-sheet";

const SNAP_POINTS_FIT_80: Array<number | string> = ["fit", "80%"];
const SNAP_POINTS_FIT: Array<number | string> = ["fit"];
const SNAP_POINTS_80: Array<number | string> = ["80%"];

const BACKGROUND_LIST_ITEMS = Array.from(
  { length: 10 },
  (_, index) => `Background row ${index + 1}`,
);
const SHEET_LIST_ITEMS = Array.from({ length: 24 }, (_, index) => `Sheet item ${index + 1}`);

const variants = defineVariantAxes([
  {
    key: "headerAlign",
    options: bottomSheetVariantMap.headerAlign,
    defaultValue: "left",
  },
  {
    key: "skipAnimation",
    options: bottomSheetVariantMap.skipAnimation,
    defaultValue: false,
  },
]);

const previewStates = definePreviewStates([{ key: "open", defaultValue: false }]);

type BottomSheetValues = VariantCatalogValues<typeof variants, typeof previewStates>;

function renderBottomSheet(
  values: BottomSheetValues,
  setValue: SetVariantValue<BottomSheetValues>,
) {
  const { headerAlign } = values;
  const skipAnimation = Boolean(values.skipAnimation);
  const open = Boolean(values.open);

  return (
    <BottomSheetRoot
      headerAlign={headerAlign}
      skipAnimation={skipAnimation}
      open={open}
      onOpenChange={(next) => setValue("open", next)}
      snapPoints={SNAP_POINTS_FIT_80}
    >
      <BottomSheetTrigger className="self-start" bindtap={() => setValue("open", true)}>
        <ActionButton variant="brandSolid">Open sheet</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent
        title={`Header ${headerAlign}`}
        description={skipAnimation ? "Animation skipped" : "Default animation"}
        showHandle
      >
        <BottomSheetBody>
          <text className="t3-regular text-fg-neutral">
            Use the trigger to inspect this variant.
          </text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <text className="t3-regular text-fg-neutral">Footer area</text>
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
        <BottomSheetTrigger className="self-start">
          <ActionButton variant="brandSolid">Trigger 탭</ActionButton>
        </BottomSheetTrigger>
        <BottomSheetContent
          title="기본 Bottom Sheet"
          description="Trigger를 탭하면 열립니다."
          showHandle
        >
          <BottomSheetBody>
            <text className="t3-regular text-fg-neutral">
              본문에 자유로운 Lynx 엘리먼트를 배치할 수 있습니다.
            </text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <text className="t3-regular text-fg-neutral">하단 액션 영역</text>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>

      <CatalogSectionTitle>Scrollable body over list</CatalogSectionTitle>
      <BottomSheetRoot snapPoints={SNAP_POINTS_80} handleOnly>
        <BottomSheetTrigger className="self-start">
          <ActionButton variant="brandSolid">긴 본문 열기</ActionButton>
        </BottomSheetTrigger>
        <view className="flex flex-col gap-x2">
          {BACKGROUND_LIST_ITEMS.map((item) => (
            <view key={item} className="p-x3 rounded-r3 bg-bg-layer-fill">
              <text className="t3-regular text-fg-neutral">{item}</text>
            </view>
          ))}
        </view>
        <BottomSheetContent
          title="스크롤 가능한 본문"
          description="Body 영역만 세로로 스크롤됩니다."
          showHandle
        >
          <BottomSheetBody className="gap-x2">
            {SHEET_LIST_ITEMS.map((item) => (
              <view key={item} className="p-x3 rounded-r3 bg-bg-layer-fill">
                <text className="t3-bold text-fg-neutral">{item}</text>
                <text className="t2-regular text-fg-neutral-muted">
                  BottomSheetBody 내부의 스크롤 항목입니다.
                </text>
              </view>
            ))}
          </BottomSheetBody>
          <BottomSheetFooter>
            <text className="t3-regular text-fg-neutral">고정 하단 영역</text>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>

      <CatalogSectionTitle>Imperative ref</CatalogSectionTitle>
      <view className="flex flex-row gap-x2 flex-wrap">
        <ActionButton bindtap={() => uncontrolledRef.current?.open()}>open()</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.snapTo(0)}>snapTo(0)</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.snapTo(1)}>snapTo(1)</ActionButton>
        <ActionButton bindtap={() => uncontrolledRef.current?.close()}>close()</ActionButton>
      </view>
      <BottomSheetRoot ref={uncontrolledRef} snapPoints={SNAP_POINTS_FIT_80}>
        <BottomSheetContent title="Imperative 예제" showHandle>
          <BottomSheetBody>
            <text className="t3-regular text-fg-neutral">
              위 버튼으로 snapTo/open/close를 호출합니다.
            </text>
          </BottomSheetBody>
        </BottomSheetContent>
      </BottomSheetRoot>

      <CatalogSectionTitle>Controlled</CatalogSectionTitle>
      <view className="flex flex-row gap-x2">
        <ActionButton bindtap={() => setControlledOpen(true)}>open=true</ActionButton>
        <ActionButton bindtap={() => setControlledOpen(false)}>open=false</ActionButton>
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
