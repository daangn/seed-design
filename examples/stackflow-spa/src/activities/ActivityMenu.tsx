import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";

import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuRoot,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuItemLabel,
  MenuDivider,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
} from "@seed-design/react";

declare module "@stackflow/config" {
  interface Register {
    ActivityMenu: {};
  }
}

const ActivityMenu: StaticActivityComponentType<"ActivityMenu"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Menu</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 16 }}>
          {/* Basic Menu */}
          <section>
            <h3 style={{ marginBottom: 8 }}>Basic</h3>
            <MenuRoot>
              <MenuTrigger render={<ActionButton />}>Open Menu</MenuTrigger>
              <MenuPositioner sideOffset={8}>
                <MenuContent>
                  <MenuItem onClick={() => console.log("Add to Library")}>
                    <MenuItemLabel>Add to Library</MenuItemLabel>
                  </MenuItem>
                  <MenuItem onClick={() => console.log("Add to Playlist")}>
                    <MenuItemLabel>Add to Playlist</MenuItemLabel>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => console.log("Play Next")}>
                    <MenuItemLabel>Play Next</MenuItemLabel>
                  </MenuItem>
                  <MenuItem onClick={() => console.log("Play Last")}>
                    <MenuItemLabel>Play Last</MenuItemLabel>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </section>

          {/* Menu with Groups */}
          <section>
            <h3 style={{ marginBottom: 8 }}>Groups</h3>
            <MenuRoot>
              <MenuTrigger render={<ActionButton />}>Grouped Menu</MenuTrigger>
              <MenuPositioner sideOffset={8}>
                <MenuContent>
                  <MenuGroup>
                    <MenuGroupHeader>Actions</MenuGroupHeader>
                    <MenuItem>
                      <MenuItemLabel>Edit</MenuItemLabel>
                    </MenuItem>
                    <MenuItem>
                      <MenuItemLabel>Duplicate</MenuItemLabel>
                    </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup>
                    <MenuGroupHeader>Danger Zone</MenuGroupHeader>
                    <MenuItem>
                      <MenuItemLabel>Archive</MenuItemLabel>
                    </MenuItem>
                    <MenuItem>
                      <MenuItemLabel>Delete</MenuItemLabel>
                    </MenuItem>
                  </MenuGroup>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </section>

          {/* Nested Menu */}
          <section>
            <h3 style={{ marginBottom: 8 }}>Nested</h3>
            <MenuRoot defaultOpen>
              <MenuTrigger render={<ActionButton />}>Nested Menu</MenuTrigger>
              <MenuPositioner sideOffset={8}>
                <MenuContent>
                  <MenuItem>
                    <MenuItemLabel>Add to Library</MenuItemLabel>
                  </MenuItem>
                  <MenuSubmenuRoot>
                    <MenuSubmenuTrigger>
                      <MenuItemLabel>Add to Playlist</MenuItemLabel>
                    </MenuSubmenuTrigger>
                    <MenuPositioner sideOffset={4} alignOffset={-4}>
                      <MenuContent>
                        <MenuItem>
                          <MenuItemLabel>Get Up!</MenuItemLabel>
                        </MenuItem>
                        <MenuItem>
                          <MenuItemLabel>Inside Out</MenuItemLabel>
                        </MenuItem>
                        <MenuItem>
                          <MenuItemLabel>Night Beats</MenuItemLabel>
                        </MenuItem>
                        <MenuDivider />
                        {Array.from({ length: 100 }, (_, i) => (
                          <MenuItem key={i}>
                            <MenuItemLabel>Playlist {i + 1}</MenuItemLabel>
                          </MenuItem>
                        ))}
                        <MenuDivider />
                        <MenuItem>
                          <MenuItemLabel>New playlist...</MenuItemLabel>
                        </MenuItem>
                      </MenuContent>
                    </MenuPositioner>
                  </MenuSubmenuRoot>
                  <MenuDivider />
                  <MenuItem>
                    <MenuItemLabel>Favorite</MenuItemLabel>
                  </MenuItem>
                  <MenuItem>
                    <MenuItemLabel>Share</MenuItemLabel>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </section>

          {/* Disabled items */}
          <section>
            <h3 style={{ marginBottom: 8 }}>Disabled Items</h3>
            <MenuRoot>
              <MenuTrigger render={<ActionButton />}>With Disabled</MenuTrigger>
              <MenuPositioner sideOffset={8}>
                <MenuContent>
                  <MenuItem>
                    <MenuItemLabel>Available Action</MenuItemLabel>
                  </MenuItem>
                  <MenuItem disabled>
                    <MenuItemLabel>Disabled Action</MenuItemLabel>
                  </MenuItem>
                  <MenuItem>
                    <MenuItemLabel>Another Action</MenuItemLabel>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </section>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMenu;
