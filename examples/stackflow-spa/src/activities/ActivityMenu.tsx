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
  // MenuSubmenuRoot,
  // MenuSubmenuTrigger,
} from "seed-design/ui/menu";
import {
  IconPlusLine,
  IconPencilLine,
  IconTrashcanLine,
  IconArrowRightLine,
} from "@karrotmarket/react-monochrome-icon";

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
          <MenuRoot size="medium">
            <MenuTrigger asChild>
              <ActionButton>Trigger</ActionButton>
            </MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuGroupHeader>Actions</MenuGroupHeader>
                <MenuItem label="Add to Library" prefixIcon={<IconPlusLine />} />
                <MenuItem
                  label="Edit"
                  description="Modify the current item"
                  prefixIcon={<IconPencilLine />}
                />
                <MenuItem
                  label="Share"
                  description="Share with others"
                  suffixIcon={<IconArrowRightLine />}
                />
                <MenuItem label="Disabled Action" prefixIcon={<IconPlusLine />} disabled />
              </MenuGroup>
              <MenuDivider />
              {/* <MenuGroup>
                <MenuSubmenuRoot>
                  <MenuSubmenuTrigger
                    label="Add to Playlist"
                    suffixIcon={<IconChevronRightLine />}
                  />
                  <MenuContent sideOffset={-84} alignOffset={-4}>
                    <MenuGroup>
                      <MenuItem label="Get Up!" />
                      <MenuItem label="Inside Out" />
                      <MenuItem label="Night Beats" />
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup>
                      {Array.from({ length: 50 }, (_, i) => (
                        <MenuItem key={`playlist-${i}`} label={`Playlist ${i + 1}`} />
                      ))}
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup>
                      <MenuItem label="New playlist..." />
                    </MenuGroup>
                  </MenuContent>
                </MenuSubmenuRoot>
              </MenuGroup> */}
              <MenuDivider />
              <MenuGroup>
                <MenuItem
                  label="Delete"
                  description="This action cannot be undone"
                  tone="critical"
                  prefixIcon={<IconTrashcanLine />}
                />
              </MenuGroup>
            </MenuContent>
          </MenuRoot>

          <MenuRoot size="small">
            <MenuTrigger asChild>
              <ActionButton>Small</ActionButton>
            </MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuGroupHeader>Actions</MenuGroupHeader>
                <MenuItem label="Add to Library" prefixIcon={<IconPlusLine />} />
                <MenuItem
                  label="Edit"
                  description="Modify the current item"
                  prefixIcon={<IconPencilLine />}
                />
                <MenuItem
                  label="Share"
                  description="Share with others"
                  suffixIcon={<IconArrowRightLine />}
                />
                <MenuItem label="Disabled Action" prefixIcon={<IconPlusLine />} disabled />
              </MenuGroup>
              <MenuDivider />
              <MenuGroup>
                {/* <MenuSubmenuRoot>
                  <MenuSubmenuTrigger
                    label="Add to Playlist"
                    suffixIcon={<IconChevronRightLine />}
                  />
                  <MenuContent sideOffset={-84} alignOffset={-4}>
                    <MenuGroup>
                      <MenuItem label="Get Up!" />
                      <MenuItem label="Inside Out" />
                      <MenuItem label="Night Beats" />
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup>
                      {Array.from({ length: 50 }, (_, i) => (
                        <MenuItem key={`playlist-sm-${i}`} label={`Playlist ${i + 1}`} />
                      ))}
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup>
                      <MenuItem label="New playlist..." />
                    </MenuGroup>
                  </MenuContent>
                </MenuSubmenuRoot> */}
              </MenuGroup>
              <MenuDivider />
              <MenuGroup>
                <MenuItem
                  label="Delete"
                  description="This action cannot be undone"
                  tone="critical"
                  prefixIcon={<IconTrashcanLine />}
                />
              </MenuGroup>
            </MenuContent>
          </MenuRoot>

          <p>
            Dolore excepteur et consequat quis minim non sit exercitation enim do irure qui. Elit
            sint veniam eiusmod Lorem voluptate commodo veniam ex. Aliqua duis do ea dolor excepteur
            in id excepteur excepteur nisi cupidatat id. Anim adipisicing ea duis tempor. Laborum
            ullamco Lorem sit aliqua ut eu excepteur amet sunt consectetur duis velit. Anim ea
            fugiat nisi adipisicing. Tempor veniam et in Lorem elit exercitation amet ipsum eu magna
            enim consectetur. Dolore non ad aliqua ex nulla. Minim quis ipsum laborum do ullamco
            voluptate irure mollit cupidatat sint nulla nostrud minim qui. Enim sunt tempor do
            proident consequat commodo quis occaecat ea eiusmod. Incididunt quis id labore do quis
            eiusmod sint reprehenderit. Ut ea amet tempor minim duis aliquip est sunt. Anim laboris
            exercitation culpa magna. Ut ipsum enim nulla sit quis veniam laboris laboris eiusmod id
            cillum amet. Pariatur adipisicing commodo velit aliquip occaecat consectetur ipsum. Nisi
            magna velit excepteur qui culpa cillum. Aliqua culpa ea eiusmod. Officia do ut voluptate
            voluptate. Adipisicing Lorem amet do ea adipisicing nisi voluptate consequat officia.
            Elit pariatur Lorem officia aliquip ipsum qui id incididunt proident excepteur amet
            culpa laboris dolore sint. Commodo irure commodo nisi consectetur veniam occaecat
            eiusmod. Voluptate est dolore sunt quis consequat. Eiusmod aute qui id voluptate
            incididunt qui excepteur excepteur incididunt nostrud adipisicing duis. Reprehenderit
            voluptate aliquip cupidatat et pariatur minim dolore minim incididunt mollit magna
            consectetur proident nisi. Reprehenderit aliquip magna Lorem do reprehenderit labore
            deserunt sit consectetur tempor. Et adipisicing dolor ex velit deserunt excepteur velit.
            Adipisicing nostrud cupidatat laborum occaecat. Cillum elit consectetur cupidatat mollit
            labore anim reprehenderit. Quis eiusmod consectetur enim occaecat officia mollit elit
            magna quis proident est veniam voluptate commodo consectetur. In duis exercitation enim
            est. Esse et laborum voluptate commodo sit ex ex. Eu velit minim amet officia aute Lorem
            eiusmod quis occaecat amet elit elit quis. Ullamco id velit duis esse nisi in do sit
            veniam do irure ipsum sunt cillum. Veniam laboris excepteur labore occaecat enim mollit
            excepteur duis culpa irure tempor. Voluptate labore consequat elit deserunt esse sunt
            consequat labore voluptate adipisicing commodo non est. Ut mollit sit ad. Ea aliqua sint
            proident tempor occaecat laboris pariatur pariatur laboris sint adipisicing duis. Eu
            occaecat velit dolor labore ipsum velit. Fugiat non irure nisi ad ullamco tempor.
          </p>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMenu;
