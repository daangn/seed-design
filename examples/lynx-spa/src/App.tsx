import { useState } from "@lynx-js/react";

import { ActionButtonPage } from "./pages/ActionButtonPage.jsx";
import { FoundationColorPage } from "./pages/FoundationColorPage.jsx";
import { FoundationTypographyPage } from "./pages/FoundationTypographyPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { NestedVarsTestPage } from "./pages/NestedVarsTestPage.jsx";
import { ThemingPage } from "./pages/ThemingPage.jsx";

export type Page =
  | "home"
  | "theming"
  | "action-button"
  | "nested-vars-test"
  | "foundation-color"
  | "foundation-typography";

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <view
      bindtap={onBack}
      style={{
        padding: "8px 0",
        marginBottom: "8px",
      }}
    >
      <text style={{ fontSize: "16px", color: "#3498db" }}>{"← Back"}</text>
    </view>
  );
}

export function App(props: { onRender?: () => void }) {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  props.onRender?.();

  return (
    <view
      style={{
        padding: "16px",
        paddingTop: "calc(16px + env(safe-area-inset-top))",
        paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {currentPage !== "home" && <BackButton onBack={() => setCurrentPage("home")} />}
      {currentPage === "home" && <HomePage navigate={setCurrentPage} />}
      {currentPage === "theming" && <ThemingPage />}
      {currentPage === "action-button" && <ActionButtonPage />}
      {currentPage === "nested-vars-test" && <NestedVarsTestPage />}
      {currentPage === "foundation-color" && <FoundationColorPage />}
      {currentPage === "foundation-typography" && <FoundationTypographyPage />}
    </view>
  );
}
