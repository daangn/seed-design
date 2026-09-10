import { Suspense, type ReactNode, useCallback, useState } from "@lynx-js/react";
import { ActionButton, Text, useSafeArea, VStack } from "@seed-design/lynx-react";
import LynxConsole from "lynx-console";
import type { LynxExampleId, LynxPlaygroundExample } from "../../../docs/playground/lynx/types";
import { examples } from "lynx-docs-examples";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "@/components/ui/app-bar";
import { AccordionPage } from "./pages/AccordionPage.jsx";
import { ActionButtonPage } from "./pages/ActionButtonPage.jsx";
import { AppBarPage } from "./pages/AppBarPage.jsx";
import { BadgePage } from "./pages/BadgePage.jsx";
import { BottomSheetPage } from "./pages/BottomSheetPage.jsx";
import { CalloutPage } from "./pages/CalloutPage.jsx";
import { CheckboxPage } from "./pages/CheckboxPage.jsx";
import { CSSSelectorTestPage } from "./pages/CSSSelectorTestPage.jsx";
import { DocsComponentPage } from "./pages/DocsComponentPage.jsx";
import { DocsExamplePage } from "./pages/DocsExamplePage.jsx";
import { FoundationColorPage } from "./pages/FoundationColorPage.jsx";
import { FoundationMonochromeIconPage } from "./pages/FoundationMonochromeIconPage.jsx";
import { FoundationMulticolorIconPage } from "./pages/FoundationMulticolorIconPage.jsx";
import { FoundationTypographyPage } from "./pages/FoundationTypographyPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { legacyPageTitle, type HomeCategory } from "./pages/home-navigation.js";
import { IconColorPOCPage } from "./pages/IconColorPOCPage.jsx";
import {
  LayoutStressSeedPrimitivesPage,
  LayoutStressStylePage,
  LayoutStressTailwindPage,
} from "./pages/LayoutPrimitiveStressPages.jsx";
import { LayoutPrimitivesPage } from "./pages/LayoutPrimitivesPage.jsx";
import { MannerTempPage } from "./pages/MannerTempPage.jsx";
import { NestedVarsTestPage } from "./pages/NestedVarsTestPage.jsx";
import { PageBannerPage } from "./pages/PageBannerPage.jsx";
import { ProgressCirclePage } from "./pages/ProgressCirclePage.jsx";
import { RadioGroupPage } from "./pages/RadioGroupPage.jsx";
import { SafeAreaDebugPage } from "./pages/SafeAreaDebugPage.jsx";
import { SwitchPage } from "./pages/SwitchPage.jsx";
import { TabsPage } from "./pages/TabsPage.jsx";
import { TagGroupPage } from "./pages/TagGroupPage.jsx";
import { TailwindDemoPage } from "./pages/TailwindDemoPage.jsx";
import { TextPrimitivePage } from "./pages/TextPrimitivePage.jsx";
import { TextFieldPage } from "./pages/TextFieldPage.jsx";
import { ThemingPage } from "./pages/ThemingPage.jsx";
import { UseControllableStatePage } from "./pages/UseControllableStatePage.jsx";
import { UsePressTapPage } from "./pages/UsePressTapPage.jsx";
import { formatLynxExampleName } from "./utils/lynx-example.js";

export type Page =
  | "home"
  | "theming"
  | "accordion"
  | "action-button"
  | "app-bar"
  | "badge"
  | "bottom-sheet"
  | "callout"
  | "checkbox"
  | "manner-temp"
  | "page-banner"
  | "progress-circle"
  | "radio-group"
  | "switch"
  | "tabs"
  | "tag-group"
  | "text-field"
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

type LegacyPage = Exclude<Page, "home">;

type Route =
  | { kind: "home" }
  | { kind: "docs-component"; component: string }
  | { kind: "docs-example"; id: LynxExampleId }
  | { kind: "legacy"; page: LegacyPage };

const FULLSCREEN_PAGES: Partial<Record<LegacyPage, true>> = {
  accordion: true,
  "action-button": true,
  badge: true,
  "bottom-sheet": true,
  callout: true,
  checkbox: true,
  "manner-temp": true,
  "page-banner": true,
  "progress-circle": true,
  "radio-group": true,
  switch: true,
  tabs: true,
  "tag-group": true,
  "text-field": true,
  "foundation-monochrome-icon": true,
  "foundation-multicolor-icon": true,
};

const MEASUREMENT_PAGES: Partial<Record<LegacyPage, true>> = {
  "layout-stress-tailwind": true,
  "layout-stress-style": true,
  "layout-stress-seed-primitives": true,
};

const HIDE_LYNX_CONSOLE_IN_MEASUREMENT = true;

interface CatalogShellProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showLynxConsole: boolean;
  children: ReactNode;
}

function CatalogShell({ title, subtitle, onBack, showLynxConsole, children }: CatalogShellProps) {
  const { safeAreaInsetBottom } = useSafeArea();

  return (
    <view
      className="flex flex-col h-screen min-h-0 bg-bg-layer-basement"
      style={{ paddingBottom: safeAreaInsetBottom }}
    >
      <AppBar>
        {onBack ? (
          <AppBarLeft>
            <AppBarBackButton bindtap={onBack} />
          </AppBarLeft>
        ) : null}
        <AppBarMain title={title} subtitle={subtitle} />
      </AppBar>
      <view className="flex flex-col flex-1 min-h-0">{children}</view>
      {showLynxConsole ? (
        <Suspense>
          <LynxConsole theme="light" />
        </Suspense>
      ) : null}
    </view>
  );
}

function MissingRoute({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <VStack className="flex-1" align="center" justify="center" gap="x4" px="x4">
      <Text textStyle="t5Bold" color="fg.neutral">
        {message}
      </Text>
      <ActionButton bindtap={onBack}>목록으로</ActionButton>
    </VStack>
  );
}

function LegacyPageContent({ page }: { page: LegacyPage }) {
  return (
    <>
      {page === "accordion" && <AccordionPage />}
      {page === "action-button" && <ActionButtonPage />}
      {page === "badge" && <BadgePage />}
      {page === "bottom-sheet" && <BottomSheetPage />}
      {page === "callout" && <CalloutPage />}
      {page === "checkbox" && <CheckboxPage />}
      {page === "manner-temp" && <MannerTempPage />}
      {page === "page-banner" && <PageBannerPage />}
      {page === "progress-circle" && <ProgressCirclePage />}
      {page === "radio-group" && <RadioGroupPage />}
      {page === "switch" && <SwitchPage />}
      {page === "tabs" && <TabsPage />}
      {page === "tag-group" && <TagGroupPage />}
      {page === "text-field" && <TextFieldPage />}
      <Suspense>
        {page === "foundation-monochrome-icon" && <FoundationMonochromeIconPage />}
        {page === "foundation-multicolor-icon" && <FoundationMulticolorIconPage />}
      </Suspense>
      {page === "theming" && <ThemingPage />}
      {page === "nested-vars-test" && <NestedVarsTestPage />}
      {page === "foundation-color" && <FoundationColorPage />}
      {page === "foundation-typography" && <FoundationTypographyPage />}
      {page === "tailwind-demo" && <TailwindDemoPage />}
      {page === "layout-primitives" && <LayoutPrimitivesPage />}
      {page === "text-primitive" && <TextPrimitivePage />}
      {page === "layout-stress-tailwind" && <LayoutStressTailwindPage />}
      {page === "layout-stress-style" && <LayoutStressStylePage />}
      {page === "layout-stress-seed-primitives" && <LayoutStressSeedPrimitivesPage />}
      {page === "safe-area-debug" && <SafeAreaDebugPage />}
      {page === "css-selector-test" && <CSSSelectorTestPage />}
      {page === "icon-color-poc" && <IconColorPOCPage />}
      {page === "use-controllable-state" && <UseControllableStatePage />}
      {page === "use-press-tap" && <UsePressTapPage />}
    </>
  );
}

export function App(props: { onRender?: () => void }) {
  const [route, setRoute] = useState<Route>({ kind: "home" });
  const [homeCategory, setHomeCategory] = useState<HomeCategory>("docs");
  const { safeAreaInsetBottom } = useSafeArea();

  const handleGoHome = useCallback(() => {
    "background only";
    setRoute({ kind: "home" });
  }, []);

  const handleHomeCategoryChange = useCallback((category: HomeCategory) => {
    "background only";
    setHomeCategory(category);
  }, []);

  const handleOpenComponent = useCallback((component: string) => {
    "background only";
    setRoute({ kind: "docs-component", component });
  }, []);

  const handleOpenExample = useCallback((example: LynxPlaygroundExample) => {
    "background only";
    setRoute({ kind: "docs-example", id: example.id });
  }, []);

  const handleOpenLegacy = useCallback((page: LegacyPage) => {
    "background only";
    setRoute({ kind: "legacy", page });
  }, []);
  const legacyPage = route.kind === "legacy" ? route.page : undefined;
  const showLynxConsole =
    !HIDE_LYNX_CONSOLE_IN_MEASUREMENT || legacyPage == null || !MEASUREMENT_PAGES[legacyPage];

  props.onRender?.();

  if (legacyPage === "app-bar") {
    return (
      <view
        className="flex flex-col h-screen min-h-0 bg-bg-layer-default"
        style={{ paddingBottom: safeAreaInsetBottom }}
      >
        <AppBarPage onBack={handleGoHome} />
        {showLynxConsole ? (
          <Suspense>
            <LynxConsole theme="light" />
          </Suspense>
        ) : null}
      </view>
    );
  }

  if (legacyPage) {
    const content = <LegacyPageContent page={legacyPage} />;
    return (
      <CatalogShell
        title={legacyPageTitle(legacyPage)}
        onBack={handleGoHome}
        showLynxConsole={showLynxConsole}
      >
        {FULLSCREEN_PAGES[legacyPage] ? (
          content
        ) : (
          <scroll-view scroll-orientation="vertical" className="flex-1 min-h-0 px-x4 pb-x4">
            {content}
          </scroll-view>
        )}
      </CatalogShell>
    );
  }

  if (route.kind === "docs-component") {
    const allComponentExamples = examples.filter(
      (example) => example.component === route.component,
    );
    return (
      <CatalogShell
        title={formatLynxExampleName(route.component)}
        onBack={handleGoHome}
        showLynxConsole={showLynxConsole}
      >
        {allComponentExamples.length > 0 ? (
          <DocsComponentPage
            component={route.component}
            examples={allComponentExamples}
            onOpenExample={handleOpenExample}
          />
        ) : (
          <MissingRoute message="예제를 찾을 수 없습니다." onBack={handleGoHome} />
        )}
      </CatalogShell>
    );
  }

  if (route.kind === "docs-example") {
    const example = examples.find((candidate) => candidate.id === route.id);
    const component = route.id.split("/")[1] ?? "";
    return (
      <CatalogShell
        title={formatLynxExampleName(example?.component ?? component)}
        subtitle={example?.scenario}
        onBack={() => setRoute({ kind: "docs-component", component })}
        showLynxConsole={showLynxConsole}
      >
        {example ? (
          <DocsExamplePage
            example={example}
            onBack={() => setRoute({ kind: "docs-component", component })}
          />
        ) : (
          <MissingRoute
            message="예제를 찾을 수 없습니다."
            onBack={() => setRoute({ kind: "docs-component", component })}
          />
        )}
      </CatalogShell>
    );
  }

  return (
    <CatalogShell title="SEED Lynx" showLynxConsole={showLynxConsole}>
      <HomePage
        category={homeCategory}
        examples={examples}
        catalogIsEmpty={examples.length === 0}
        onCategoryChange={handleHomeCategoryChange}
        onOpenComponent={handleOpenComponent}
        onOpenLegacy={handleOpenLegacy}
      />
    </CatalogShell>
  );
}
