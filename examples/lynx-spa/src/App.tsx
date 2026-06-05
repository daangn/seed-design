import { lazy, Suspense, useState } from "@lynx-js/react";
import { useSafeArea } from "@seed-design/lynx-react";

import { ActionButtonPage } from "./pages/ActionButtonPage.jsx";
import { AppBarPage } from "./pages/AppBarPage.jsx";
import { BottomSheetPage } from "./pages/BottomSheetPage.jsx";
import { CheckboxPage } from "./pages/CheckboxPage.jsx";
import { CSSSelectorTestPage } from "./pages/CSSSelectorTestPage.jsx";
import { FoundationColorPage } from "./pages/FoundationColorPage.jsx";
import { FoundationTypographyPage } from "./pages/FoundationTypographyPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { IconColorPOCPage } from "./pages/IconColorPOCPage.jsx";
import {
  LayoutStressSeedPrimitivesPage,
  LayoutStressStylePage,
  LayoutStressTailwindPage,
} from "./pages/LayoutPrimitiveStressPages.jsx";
import { LayoutPrimitivesPage } from "./pages/LayoutPrimitivesPage.jsx";
import { NestedVarsTestPage } from "./pages/NestedVarsTestPage.jsx";
import { ProgressCirclePage } from "./pages/ProgressCirclePage.jsx";
import { RadioGroupPage } from "./pages/RadioGroupPage.jsx";
import { SafeAreaDebugPage } from "./pages/SafeAreaDebugPage.jsx";
import { SwitchPage } from "./pages/SwitchPage.jsx";
import { TagGroupPage } from "./pages/TagGroupPage.jsx";
import { TailwindDemoPage } from "./pages/TailwindDemoPage.jsx";
import { TextPrimitivePage } from "./pages/TextPrimitivePage.jsx";
import { ThemingPage } from "./pages/ThemingPage.jsx";
import { UseControllableStatePage } from "./pages/UseControllableStatePage.jsx";
import { UsePressTapPage } from "./pages/UsePressTapPage.jsx";

const LynxConsole = lazy(() => import("lynx-console"));
const FoundationMonochromeIconPage = lazy(async () => ({
  default: (await import("./pages/FoundationMonochromeIconPage.jsx")).FoundationMonochromeIconPage,
}));
const FoundationMulticolorIconPage = lazy(async () => ({
  default: (await import("./pages/FoundationMulticolorIconPage.jsx")).FoundationMulticolorIconPage,
}));

export type Page =
  | "home"
  | "theming"
  | "action-button"
  | "app-bar"
  | "bottom-sheet"
  | "checkbox"
  | "progress-circle"
  | "radio-group"
  | "switch"
  | "tag-group"
  | "nested-vars-test"
  | "foundation-color"
  | "foundation-monochrome-icon"
  | "foundation-multicolor-icon"
  | "foundation-typography"
  | "tailwind-demo"
  | "layout-primitives"
  | "text-primitive"
  | "layout-stress-tailwind"
  | "layout-stress-style"
  | "layout-stress-seed-primitives"
  | "safe-area-debug"
  | "css-selector-test"
  | "icon-color-poc"
  | "use-controllable-state"
  | "use-press-tap";

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <view bindtap={onBack} className="py-x2 mb-x2">
      <text className="t5-regular text-fg-brand">{"← Back"}</text>
    </view>
  );
}

// Pages that own their own scroll areas use a fullscreen flex shell.
const FULLSCREEN_PAGES = new Set<Page>([
  "action-button",
  "app-bar",
  "bottom-sheet",
  "checkbox",
  "progress-circle",
  "radio-group",
  "switch",
  "tag-group",
  "foundation-monochrome-icon",
  "foundation-multicolor-icon",
]);

const MEASUREMENT_PAGES = new Set<Page>([
  "layout-stress-tailwind",
  "layout-stress-style",
  "layout-stress-seed-primitives",
]);

const HIDE_LYNX_CONSOLE_IN_MEASUREMENT = true;

function addBaseToSafeAreaInset(inset: string, base: number) {
  return `calc(${base}px + ${inset})`;
}

export function App(props: { onRender?: () => void }) {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { safeAreaInsetTop, safeAreaInsetBottom } = useSafeArea();
  const showLynxConsole = !HIDE_LYNX_CONSOLE_IN_MEASUREMENT || !MEASUREMENT_PAGES.has(currentPage);

  props.onRender?.();

  if (FULLSCREEN_PAGES.has(currentPage)) {
    return (
      <view
        className="flex flex-col h-screen min-h-0 bg-bg-layer-default"
        style={{
          paddingTop: addBaseToSafeAreaInset(safeAreaInsetTop, 16),
          paddingBottom: safeAreaInsetBottom,
        }}
      >
        <view className="px-x4 shrink-0">
          <BackButton onBack={() => setCurrentPage("home")} />
        </view>
        {currentPage === "action-button" && <ActionButtonPage />}
        {currentPage === "app-bar" && <AppBarPage />}
        {currentPage === "bottom-sheet" && <BottomSheetPage />}
        {currentPage === "checkbox" && <CheckboxPage />}
        {currentPage === "progress-circle" && <ProgressCirclePage />}
        {currentPage === "radio-group" && <RadioGroupPage />}
        {currentPage === "switch" && <SwitchPage />}
        {currentPage === "tag-group" && <TagGroupPage />}
        <Suspense>
          {currentPage === "foundation-monochrome-icon" && <FoundationMonochromeIconPage />}
          {currentPage === "foundation-multicolor-icon" && <FoundationMulticolorIconPage />}
        </Suspense>
        {showLynxConsole && (
          <Suspense>
            <LynxConsole theme="light" />
          </Suspense>
        )}
      </view>
    );
  }

  return (
    <scroll-view
      scroll-y
      className="flex flex-col h-screen px-x4 bg-bg-layer-default"
      style={{
        paddingTop: addBaseToSafeAreaInset(safeAreaInsetTop, 16),
        paddingBottom: addBaseToSafeAreaInset(safeAreaInsetBottom, 16),
      }}
    >
      {currentPage !== "home" && <BackButton onBack={() => setCurrentPage("home")} />}
      {currentPage === "home" && <HomePage navigate={setCurrentPage} />}
      {currentPage === "theming" && <ThemingPage />}
      {currentPage === "nested-vars-test" && <NestedVarsTestPage />}
      {currentPage === "foundation-color" && <FoundationColorPage />}
      {currentPage === "foundation-typography" && <FoundationTypographyPage />}
      {currentPage === "tailwind-demo" && <TailwindDemoPage />}
      {currentPage === "layout-primitives" && <LayoutPrimitivesPage />}
      {currentPage === "text-primitive" && <TextPrimitivePage />}
      {currentPage === "layout-stress-tailwind" && <LayoutStressTailwindPage />}
      {currentPage === "layout-stress-style" && <LayoutStressStylePage />}
      {currentPage === "layout-stress-seed-primitives" && <LayoutStressSeedPrimitivesPage />}
      {currentPage === "safe-area-debug" && <SafeAreaDebugPage />}
      {currentPage === "css-selector-test" && <CSSSelectorTestPage />}
      {currentPage === "icon-color-poc" && <IconColorPOCPage />}
      {currentPage === "use-controllable-state" && <UseControllableStatePage />}
      {currentPage === "use-press-tap" && <UsePressTapPage />}
      {showLynxConsole && (
        <Suspense>
          <LynxConsole theme="light" />
        </Suspense>
      )}
    </scroll-view>
  );
}
