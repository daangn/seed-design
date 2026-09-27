import React, { type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { usePositionedFloating } from "../../../../packages/react-headless/floating/src";
import { Menu } from "../../../../packages/react-headless/menu/src";
import { NavigationMenu } from "../../../../packages/react-headless/navigation-menu/src";

const params = new URLSearchParams(location.search);
const scenario = params.get("scenario");
const placement = scenario === "shift" ? "right" : scenario === "size" ? "bottom" : "top";
const triggerStyle = {
  position: "fixed",
  left: 300,
  top: scenario === "shift" ? 0 : 160,
  width: 80,
  height: 24,
} satisfies CSSProperties;
const contentStyle = {
  width: 180,
  height: scenario === "size" ? 1000 : 100,
  maxHeight: "var(--seed-menu-available-height)",
  overflow: "auto",
  background: "lightblue",
} satisfies CSSProperties;

function Floating() {
  const floating = usePositionedFloating({ open: true, placement, overflowPadding: 16, gutter: 8 });

  return (
    <>
      <button ref={floating.refs.setReference} style={triggerStyle}>
        Trigger
      </button>
      <div ref={floating.refs.setFloating} data-testid="positioner" style={floating.floatingStyles}>
        <div style={contentStyle}>Content</div>
      </div>
    </>
  );
}

function Fixture() {
  if (params.get("kind") === "floating") return <Floating />;

  if (params.get("kind") === "menu")
    return (
      <Menu.Root open placement={placement} overflowPadding={16} gutter={8}>
        <Menu.Trigger style={triggerStyle}>Trigger</Menu.Trigger>
        <Menu.Positioner data-testid="positioner">
          <Menu.Content style={contentStyle}>
            <Menu.Item>Content</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    );

  return (
    <NavigationMenu.Provider value="item">
      <NavigationMenu.Root value="item" placement={placement} overflowPadding={16} gutter={8}>
        <NavigationMenu.Trigger style={triggerStyle}>Trigger</NavigationMenu.Trigger>
        <NavigationMenu.Positioner data-testid="positioner">
          <NavigationMenu.Content style={contentStyle}>
            <NavigationMenu.Item>Content</NavigationMenu.Item>
          </NavigationMenu.Content>
        </NavigationMenu.Positioner>
      </NavigationMenu.Root>
    </NavigationMenu.Provider>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing fixture root");

createRoot(root).render(<Fixture />);
