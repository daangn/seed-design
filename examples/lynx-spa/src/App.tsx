import { Suspense, lazy, useState } from "@lynx-js/react";
import { vars } from "@seed-design/lynx-css/vars";

import { ActionButtonPage } from "./pages/ActionButtonPage.jsx";
import { FoundationColorPage } from "./pages/FoundationColorPage.jsx";
import { FoundationMonochromeIconPage } from "./pages/FoundationMonochromeIconPage.jsx";
import { FoundationMulticolorIconPage } from "./pages/FoundationMulticolorIconPage.jsx";
import { FoundationTypographyPage } from "./pages/FoundationTypographyPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { TailwindDemoPage } from "./pages/TailwindDemoPage.jsx";
import { TestNativeBoxPage } from "./pages/TestNativeBoxPage.jsx";
import { TestTailwindBoxPage } from "./pages/TestTailwindBoxPage.jsx";
import { NestedVarsTestPage } from "./pages/NestedVarsTestPage.jsx";
import { ProgressCirclePage } from "./pages/ProgressCirclePage.jsx";
import { ThemingPage } from "./pages/ThemingPage.jsx";

const LynxConsole = lazy(() => import("lynx-console"));

export type Page =
  | "home"
  | "theming"
  | "action-button"
  | "progress-circle"
  | "nested-vars-test"
  | "foundation-color"
  | "foundation-monochrome-icon"
  | "foundation-multicolor-icon"
  | "foundation-typography"
  | "tailwind-demo"
  | "test-native-box"
  | "test-tailwind-box";

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <view
      bindtap={onBack}
      style={{
        padding: "8px 0",
        marginBottom: "8px",
      }}
    >
      <text style={{ fontSize: "16px", color: vars.$color.fg.brand }}>{"← Back"}</text>
    </view>
  );
}

export function App(props: { onRender?: () => void }) {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  props.onRender?.();

  return (
    <scroll-view
      scroll-y
      style={{
        padding: "16px",
        paddingTop: "calc(16px + env(safe-area-inset-top))",
        paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {currentPage !== "home" && <BackButton onBack={() => setCurrentPage("home")} />}
      {currentPage === "home" && <HomePage navigate={setCurrentPage} />}
      {currentPage === "theming" && <ThemingPage />}
      {currentPage === "action-button" && <ActionButtonPage />}
      {currentPage === "progress-circle" && <ProgressCirclePage />}
      {currentPage === "nested-vars-test" && <NestedVarsTestPage />}
      {currentPage === "foundation-color" && <FoundationColorPage />}
      {currentPage === "foundation-monochrome-icon" && <FoundationMonochromeIconPage />}
      {currentPage === "foundation-multicolor-icon" && <FoundationMulticolorIconPage />}
      {currentPage === "foundation-typography" && <FoundationTypographyPage />}
      {currentPage === "tailwind-demo" && <TailwindDemoPage />}
      {currentPage === "test-native-box" && <TestNativeBoxPage />}
      {currentPage === "test-tailwind-box" && <TestTailwindBoxPage />}
      <Suspense>
        <LynxConsole theme="light" />
      </Suspense>
    </scroll-view>
  );
}
