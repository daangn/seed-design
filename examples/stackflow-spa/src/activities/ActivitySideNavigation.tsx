import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { SideNavigation } from "@seed-design/react";

declare module "@stackflow/config" {
  interface Register {
    ActivitySideNavigation: {};
  }
}

const ActivitySideNavigation: StaticActivityComponentType<"ActivitySideNavigation"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Side Navigation</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div style={{ display: "flex", height: "100%" }}>
          <SideNavigation.Root style={{ width: 240, borderRight: "1px solid #eee" }}>
            <SideNavigation.Header style={{ padding: 16 }}>
              <strong>Service Name</strong>
            </SideNavigation.Header>

            <SideNavigation.Content style={{ flex: 1, overflowY: "auto" }}>
              <SideNavigation.Group>
                <SideNavigation.GroupLabel
                  style={{ padding: "8px 16px", fontSize: 12, color: "#888" }}
                >
                  Platform
                </SideNavigation.GroupLabel>

                <SideNavigation.MenuItemCollapsibleRoot defaultOpen>
                  <SideNavigation.MenuItemCollapsibleTrigger
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    Models
                  </SideNavigation.MenuItemCollapsibleTrigger>
                  <SideNavigation.MenuItemCollapsibleContent>
                    <SideNavigation.MenuItemCollapsibleItem
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "6px 16px 6px 32px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      Genesis
                    </SideNavigation.MenuItemCollapsibleItem>
                    <SideNavigation.MenuItemCollapsibleItem
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "6px 16px 6px 32px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      Explorer
                    </SideNavigation.MenuItemCollapsibleItem>
                  </SideNavigation.MenuItemCollapsibleContent>
                </SideNavigation.MenuItemCollapsibleRoot>

                <SideNavigation.MenuItemButton
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  Documentation
                </SideNavigation.MenuItemButton>
              </SideNavigation.Group>

              <SideNavigation.Group>
                <SideNavigation.GroupLabel
                  style={{ padding: "8px 16px", fontSize: 12, color: "#888" }}
                >
                  Settings
                </SideNavigation.GroupLabel>

                <SideNavigation.MenuItemButton
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  General
                </SideNavigation.MenuItemButton>
                <SideNavigation.MenuItemButton
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  Billing
                </SideNavigation.MenuItemButton>
              </SideNavigation.Group>
            </SideNavigation.Content>

            <SideNavigation.Footer style={{ padding: 16, borderTop: "1px solid #eee" }}>
              <SideNavigation.MenuItemButton
                style={{
                  display: "block",
                  width: "100%",
                  padding: "4px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 13,
                  color: "#888",
                }}
              >
                Help Center
              </SideNavigation.MenuItemButton>
            </SideNavigation.Footer>
          </SideNavigation.Root>

          <SideNavigation.Inset style={{ flex: 1, padding: 24 }}>
            <h2>Main Content Area</h2>
            <p>This is the inset area next to the side navigation.</p>
          </SideNavigation.Inset>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySideNavigation;
