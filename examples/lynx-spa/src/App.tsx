import { useState } from "@lynx-js/react";
import { ActionButton } from "@seed-design/lynx-react";
import { getThemeClassName } from "@seed-design/rsbuild-plugin/lynx";
import LynxConsole from "lynx-console";
import "lynx-console/style.css";

declare const __SEED_COLOR_MODE__: string;

type Page = "home" | "theming" | "action-button";

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

function ThemingPage() {
  const colorMode = typeof __SEED_COLOR_MODE__ !== "undefined" ? __SEED_COLOR_MODE__ : "system";
  const globalProps = lynx?.__globalProps as Record<string, unknown> | undefined;
  const systemTheme = (globalProps?.theme as string) ?? "unknown";
  const frontendTheme = (globalProps?.frontendTheme as string) ?? "unknown";
  const themeClass = getThemeClassName(
    colorMode as "system" | "light-only" | "dark-only",
    systemTheme,
  );

  return (
    <view style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Theming</text>

      <view
        style={{
          padding: "12px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <text style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>Environment</text>
        <text style={{ fontSize: "13px", color: "#555" }}>colorMode (plugin): "{colorMode}"</text>
        <text style={{ fontSize: "13px", color: "#555" }}>
          systemTheme (device): "{systemTheme}"
        </text>
        <text style={{ fontSize: "13px", color: "#555" }}>
          frontendTheme (app): "{frontendTheme}"
        </text>
        <text style={{ fontSize: "13px", color: "#555" }}>Applied class: "{themeClass}"</text>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Theme Preview</text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <ActionButton variant="brandSolid">Brand Solid</ActionButton>
        <ActionButton variant="neutralSolid">Neutral Solid</ActionButton>
        <ActionButton variant="neutralWeak">Neutral Weak</ActionButton>
        <ActionButton variant="criticalSolid">Critical Solid</ActionButton>
      </view>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <ActionButton variant="brandOutline">Brand Outline</ActionButton>
        <ActionButton variant="neutralOutline">Neutral Outline</ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
      </view>
    </view>
  );
}

function ActionButtonPage() {
  return (
    <view style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>ActionButton</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Variants</text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <ActionButton variant="brandSolid">Brand Solid</ActionButton>
        <ActionButton variant="neutralSolid">Neutral Solid</ActionButton>
        <ActionButton variant="neutralWeak">Neutral Weak</ActionButton>
        <ActionButton variant="criticalSolid">Critical Solid</ActionButton>
        <ActionButton variant="brandOutline">Brand Outline</ActionButton>
        <ActionButton variant="neutralOutline">Neutral Outline</ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Sizes</text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <ActionButton size="xsmall">XSmall</ActionButton>
        <ActionButton size="small">Small</ActionButton>
        <ActionButton size="medium">Medium</ActionButton>
        <ActionButton size="large">Large</ActionButton>
      </view>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Disabled</text>
      <view
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <ActionButton variant="brandSolid" disabled>
          Disabled
        </ActionButton>
        <ActionButton variant="neutralOutline" disabled>
          Disabled Outline
        </ActionButton>
      </view>
      {/* LynxConsole: floating developer console for debugging */}
      <LynxConsole theme="light" safeAreaInsetBottom="34px" />
    </view>
  );
}

function ListItem({ title, onTap }: { title: string; onTap: () => void }) {
  return (
    <view
      bindtap={onTap}
      style={{
        padding: "14px 12px",
        borderBottomWidth: "1px",
        borderBottomColor: "#eee",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <text style={{ fontSize: "16px", color: "#333" }}>{title}</text>
      <text style={{ fontSize: "16px", color: "#999" }}>{"→"}</text>
    </view>
  );
}

function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <view style={{ display: "flex", flexDirection: "column" }}>
      <text
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#3498db",
        }}
      >
        SEED Design Lynx Catalog
      </text>
      <ListItem title="Theming" onTap={() => navigate("theming")} />
      <ListItem title="ActionButton" onTap={() => navigate("action-button")} />
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
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {currentPage !== "home" && <BackButton onBack={() => setCurrentPage("home")} />}
      {currentPage === "home" && <HomePage navigate={setCurrentPage} />}
      {currentPage === "theming" && <ThemingPage />}
      {currentPage === "action-button" && <ActionButtonPage />}
    </view>
  );
}
