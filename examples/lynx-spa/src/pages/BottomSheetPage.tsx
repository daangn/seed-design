import { useEffect, useRef, useState } from "@lynx-js/react";
import { bottomSheetVariantMap } from "@seed-design/lynx-css/recipes/bottom-sheet";
import { ActionButton } from "@seed-design/lynx-react";
import * as HeadlessBottomSheet from "@seed-design/lynx-react-bottom-sheet";

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
const SNAP_POINTS_RESIZE_PARTIAL: Array<number | string> = [300, "fit"];

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
      <BottomSheetResizeExample />
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
            <view key={item} className="p-x3 rounded-r3 bg-bg-neutral-muted">
              <text className="t3-regular text-fg-neutral">{item}</text>
            </view>
          ))}
        </view>
        <BottomSheetContent
          title="스크롤 가능한 본문"
          description="Body 영역만 세로로 스크롤됩니다."
          showHandle
        >
          <BottomSheetBody>
            <view className="flex flex-col gap-x2">
              {SHEET_LIST_ITEMS.map((item) => (
                <view key={item} className="p-x3 rounded-r3 bg-bg-neutral-muted">
                  <text className="t3-bold text-fg-neutral">{item}</text>
                  <text className="t2-regular text-fg-neutral-muted">
                    BottomSheetBody 내부의 스크롤 항목입니다.
                  </text>
                </view>
              ))}
            </view>
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

function BottomSheetResizeExample() {
  const sheetRef = useRef<HeadlessBottomSheet.BottomSheetRootRef>(null);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(300);
  const [partial, setPartial] = useState(false);
  const [lastReason, setLastReason] = useState("-");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function openExample(partialSnap: boolean, resizeDuringEnter: boolean) {
    "background only";
    clearTimeout(timer.current);
    setPartial(partialSnap);
    setHeight(partialSnap ? 500 : 300);
    setOpen(true);
    if (resizeDuringEnter) timer.current = setTimeout(() => setHeight(500), 200);
  }

  function resizeAndClose() {
    "background only";
    clearTimeout(timer.current);
    setHeight(height === 300 ? 500 : 300);
    timer.current = setTimeout(() => {
      sheetRef.current?.snapTo(0);
      timer.current = setTimeout(() => setOpen(false), 200);
    }, 200);
  }

  function resizeAndSnap() {
    "background only";
    clearTimeout(timer.current);
    setHeight(height === 300 ? 500 : 300);
    timer.current = setTimeout(() => sheetRef.current?.snapTo(0), 200);
  }

  return (
    <>
      <CatalogSectionTitle>Backdrop resize regression</CatalogSectionTitle>
      <text className="t3-regular text-fg-neutral">
        {`height: ${height}, open: ${open}, reason: ${lastReason}`}
      </text>
      <view className="flex flex-row gap-x2 flex-wrap">
        <ActionButton bindtap={() => openExample(false, false)}>Fit resize</ActionButton>
        <ActionButton bindtap={() => openExample(false, true)}>Resize during enter</ActionButton>
        <ActionButton bindtap={() => openExample(true, false)}>Partial snap resize</ActionButton>
      </view>
      <HeadlessBottomSheet.BottomSheetRoot
        ref={sheetRef}
        open={open}
        onOpenChange={(nextOpen, details) => {
          setOpen(nextOpen);
          setLastReason(details.reason);
        }}
        snapPoints={partial ? SNAP_POINTS_RESIZE_PARTIAL : SNAP_POINTS_FIT}
      >
        <HeadlessBottomSheet.BottomSheetPositioner style={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <HeadlessBottomSheet.BottomSheetBackdrop
            className="resize-regression-backdrop"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          />
          <HeadlessBottomSheet.BottomSheetContent
            className="resize-regression-content"
            innerStyle={{ height: `${height}px`, backgroundColor: "white", padding: "20px" }}
            enterAnimation={{ type: "tween", duration: 1200 }}
            snapAnimation={{ type: "tween", duration: 1200 }}
            exitAnimation={{ type: "tween", duration: 600 }}
          >
            <HeadlessBottomSheet.BottomSheetHandle>
              <view style={{ height: "24px", backgroundColor: "#dddddd" }}>
                <text>Drag handle</text>
              </view>
            </HeadlessBottomSheet.BottomSheetHandle>
            <text style={{ color: "black", fontSize: "16px" }}>
              {`Content height: ${height}; ${partial ? "300 / fit snap" : "fit snap"}`}
            </text>
            <input
              id="resize-regression-input"
              placeholder="Focus to grow"
              style={{ height: "44px", backgroundColor: "#eeeeee", color: "black" }}
              bindfocus={() => setHeight(500)}
              bindblur={() => setHeight(300)}
            />
            <view className="flex flex-row gap-x2 flex-wrap">
              <ActionButton bindtap={() => setHeight(height === 300 ? 500 : 300)}>
                Resize 300 / 500
              </ActionButton>
              <ActionButton bindtap={resizeAndSnap}>Resize then snap</ActionButton>
              <ActionButton bindtap={resizeAndClose}>Resize then close</ActionButton>
              <HeadlessBottomSheet.BottomSheetCloseButton>
                <ActionButton>Close</ActionButton>
              </HeadlessBottomSheet.BottomSheetCloseButton>
            </view>
          </HeadlessBottomSheet.BottomSheetContent>
        </HeadlessBottomSheet.BottomSheetPositioner>
      </HeadlessBottomSheet.BottomSheetRoot>
    </>
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
