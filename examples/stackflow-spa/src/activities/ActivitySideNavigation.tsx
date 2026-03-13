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
          {/* TODO: width/border will come from recipe variant (neutral/transparent) */}
          <SideNavigation.Root style={{ width: 240, borderRight: "1px solid #eee" }}>
            <SideNavigation.Header style={{ padding: 16 }}>
              <strong>Service Name</strong>
            </SideNavigation.Header>

            <SideNavigation.Content>
              <SideNavigation.Group>
                <SideNavigation.GroupLabel
                  style={{ padding: "8px 16px", fontSize: 12, color: "#888" }}
                >
                  Platform
                </SideNavigation.GroupLabel>

                <SideNavigation.MenuItemCollapsibleRoot defaultOpen>
                  <SideNavigation.MenuItemCollapsibleTrigger
                    style={{ justifyContent: "space-between", padding: "8px 16px" }}
                  >
                    Models
                  </SideNavigation.MenuItemCollapsibleTrigger>
                  <SideNavigation.MenuItemCollapsibleContent>
                    <SideNavigation.MenuItemCollapsibleItem
                      style={{ padding: "6px 16px 6px 32px" }}
                    >
                      Genesis
                    </SideNavigation.MenuItemCollapsibleItem>
                    <SideNavigation.MenuItemCollapsibleItem
                      style={{ padding: "6px 16px 6px 32px" }}
                    >
                      Explorer
                    </SideNavigation.MenuItemCollapsibleItem>
                  </SideNavigation.MenuItemCollapsibleContent>
                </SideNavigation.MenuItemCollapsibleRoot>

                <SideNavigation.MenuItemButton style={{ padding: "8px 16px" }}>
                  Documentation
                </SideNavigation.MenuItemButton>
              </SideNavigation.Group>

              <SideNavigation.Group>
                <SideNavigation.GroupLabel
                  style={{ padding: "8px 16px", fontSize: 12, color: "#888" }}
                >
                  Settings
                </SideNavigation.GroupLabel>

                <SideNavigation.MenuItemButton style={{ padding: "8px 16px" }}>
                  General
                </SideNavigation.MenuItemButton>
                <SideNavigation.MenuItemButton style={{ padding: "8px 16px" }}>
                  Billing
                </SideNavigation.MenuItemButton>
              </SideNavigation.Group>
            </SideNavigation.Content>

            <SideNavigation.Footer style={{ padding: 16, borderTop: "1px solid #eee" }}>
              <SideNavigation.MenuItemButton
                style={{ padding: "4px 0", fontSize: 13, color: "#888" }}
              >
                Help Center
              </SideNavigation.MenuItemButton>
            </SideNavigation.Footer>
          </SideNavigation.Root>

          <SideNavigation.Inset style={{ padding: 24 }}>
            <h2>Main Content Area</h2>
            <p>This is the inset area next to the side navigation.</p>
          </SideNavigation.Inset>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySideNavigation;
