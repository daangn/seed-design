import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { useRef, useState } from "react";

import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconArrowUpBracketDownLine, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuRoot,
  MenuTrigger,
  MenuAnchor,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  // MenuSubmenuRoot,
  // MenuSubmenuTrigger,
} from "seed-design/ui/menu";
import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { BottomSheetRoot, BottomSheetContent, BottomSheetBody } from "seed-design/ui/bottom-sheet";
import {
  IconPlusLine,
  IconPencilLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "seed-design/ui/alert-dialog";
import { BottomSheetFooter, ResponsivePair, Portal } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";

declare module "@stackflow/config" {
  interface Register {
    ActivityMenu: {};
  }
}

const ActivityMenu: StaticActivityComponentType<"ActivityMenu"> = () => {
  const { push } = useFlow();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetFromMenuOpen, setSheetFromMenuOpen] = useState(false);
  const menuInSheetOpenRef = useRef(false);
  const menuInDialogOpenRef = useRef(false);
  const [fieldButtonMenuOpen, setFieldButtonMenuOpen] = useState(false);
  const [selectedFruit, setSelectedFruit] = useState("");

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
          <p>
            Duis consectetur ad veniam id sit sunt reprehenderit exercitation amet dolore sunt
            veniam sunt aliquip quis. Culpa adipisicing aute anim anim amet enim incididunt culpa.
            Dolore quis ullamco consequat fugiat proident ad commodo nostrud eu commodo. Eiusmod
            incididunt pariatur est. Ea aliquip officia quis culpa dolore irure esse non pariatur
            duis. Cupidatat ad id esse esse Lorem consectetur magna consectetur reprehenderit sit.
            Pariatur nisi sunt ipsum amet veniam exercitation nulla sint reprehenderit proident
            cillum minim nostrud. Magna ullamco laborum ex deserunt esse sunt ea excepteur proident
            magna amet enim proident culpa.Velit amet veniam adipisicing. Laborum nulla irure
            aliquip culpa aute Lorem veniam officia sunt ut enim consectetur. Pariatur enim mollit
            quis eiusmod esse occaecat. Consectetur excepteur esse qui ullamco nostrud irure et
            velit tempor qui proident proident ipsum amet dolor. Nulla nisi nisi sit aliquip dolore
            aliquip pariatur id nulla laboris eiusmod magna minim aute exercitation. Pariatur in
            labore anim ad elit ex enim. Est dolor elit aliquip est exercitation velit commodo et
            Lorem dolor sint do amet consectetur.Mollit sit velit consequat veniam est deserunt qui
            aliquip. Id consequat cillum ad magna ex officia non deserunt in sint duis veniam. Est
            culpa pariatur ut. Aute ea exercitation enim ut adipisicing enim voluptate do dolore
            culpa enim velit sit.
          </p>
          <MenuRoot size="medium">
            <MenuTrigger asChild>
              <ActionButton>Trigger</ActionButton>
            </MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuGroupLabel>Actions</MenuGroupLabel>
                <MenuItem label="Add to Library" prefixIcon={<IconPlusLine />} />
                <MenuItem
                  label="Edit"
                  description="Modify the current item"
                  prefixIcon={<IconPencilLine />}
                />
                <MenuItem
                  label="Share"
                  description="Share with others"
                  prefixIcon={<IconArrowUpBracketDownLine />}
                />
                <MenuItem label="Disabled Action" prefixIcon={<IconPlusLine />} disabled />
                <MenuItem
                  label="Open Sheet"
                  description="Opens a BottomSheet"
                  prefixIcon={<IconArrowUpBracketDownLine />}
                  onClick={() => setSheetFromMenuOpen(true)}
                />
              </MenuGroup>
              {/* <MenuDivider /> */}
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
                          <MenuGroup>
                      {Array.from({ length: 50 }, (_, i) => (
                        <MenuItem key={`playlist-${i}`} label={`Playlist ${i + 1}`} />
                      ))}
                    </MenuGroup>
                          <MenuGroup>
                      <MenuItem label="New playlist..." />
                    </MenuGroup>
                  </MenuContent>
                </MenuSubmenuRoot>
              </MenuGroup> */}
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

          <BottomSheetRoot open={sheetFromMenuOpen} onOpenChange={setSheetFromMenuOpen}>
            <Portal>
              <BottomSheetContent
                title="Opened from Menu"
                showHandle
                layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
              >
                <BottomSheetBody>
                  <p>Menu item 클릭으로 열린 BottomSheet입니다.</p>
                </BottomSheetBody>
              </BottomSheetContent>
            </Portal>
          </BottomSheetRoot>

          <MenuRoot size="small">
            <MenuTrigger asChild>
              <ActionButton>Small</ActionButton>
            </MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuGroupLabel>Actions</MenuGroupLabel>
                <MenuItem label="Add to Library" prefixIcon={<IconPlusLine />} />
                <MenuItem
                  label="Edit"
                  description="Modify the current item"
                  prefixIcon={<IconPencilLine />}
                />
                <MenuItem
                  label="Share"
                  description="Share with others"
                  prefixIcon={<IconArrowUpBracketDownLine />}
                />
                <MenuItem label="Disabled Action" prefixIcon={<IconPlusLine />} disabled />
              </MenuGroup>
              {/* <MenuDivider /> */}
              {/* <MenuGroup> */}
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
                          <MenuGroup>
                      {Array.from({ length: 50 }, (_, i) => (
                        <MenuItem key={`playlist-sm-${i}`} label={`Playlist ${i + 1}`} />
                      ))}
                    </MenuGroup>
                          <MenuGroup>
                      <MenuItem label="New playlist..." />
                    </MenuGroup>
                  </MenuContent>
                </MenuSubmenuRoot> */}
              {/* </MenuGroup> */}
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

          <ActionButton onClick={() => setSheetOpen(true)}>Menu in BottomSheet</ActionButton>
          <BottomSheetRoot open={sheetOpen} onOpenChange={setSheetOpen}>
            <Portal>
              <BottomSheetContent
                title="Menu in BottomSheet"
                showHandle
                layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
              >
                <BottomSheetBody>
                  <p>BottomSheet 내부에서 Menu를 열 수 있습니다.</p>
                </BottomSheetBody>
                <BottomSheetFooter>
                  <MenuRoot
                    size="medium"
                    onOpenChange={(open) => {
                      menuInSheetOpenRef.current = open;
                    }}
                  >
                    <MenuTrigger asChild>
                      <ActionButton variant="neutralWeak">Open Menu</ActionButton>
                    </MenuTrigger>
                    <MenuContent>
                      <MenuGroup>
                        <MenuGroupLabel>Actions</MenuGroupLabel>
                        <MenuItem label="Add to Library" prefixIcon={<IconPlusLine />} />
                        <MenuItem
                          label="Edit"
                          description="Modify the current item"
                          prefixIcon={<IconPencilLine />}
                        />
                        <MenuItem
                          label="Share"
                          description="Share with others"
                          prefixIcon={<IconArrowUpBracketDownLine />}
                        />
                      </MenuGroup>
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
                </BottomSheetFooter>
              </BottomSheetContent>
            </Portal>
          </BottomSheetRoot>

          <AlertDialogRoot>
            <AlertDialogTrigger asChild>
              <ActionButton>Menu in AlertDialog</ActionButton>
            </AlertDialogTrigger>
            <Portal>
              <AlertDialogContent layerIndex={useActivityZIndexBase({ activityOffset: 1 })}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Menu in AlertDialog</AlertDialogTitle>
                  <AlertDialogDescription>
                    AlertDialog 내부에서 Menu를 열 수 있습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <ResponsivePair gap="x2">
                    <MenuRoot size="medium">
                      <MenuTrigger asChild>
                        <ActionButton variant="neutralWeak">Open Menu</ActionButton>
                      </MenuTrigger>
                      <MenuContent>
                        <MenuGroup>
                          <MenuGroupLabel>Actions</MenuGroupLabel>
                          <MenuItem label="Add to Library" prefixIcon={<IconPlusLine />} />
                          <MenuItem
                            label="Edit"
                            description="Modify the current item"
                            prefixIcon={<IconPencilLine />}
                          />
                          <MenuItem
                            label="Share"
                            description="Share with others"
                            prefixIcon={<IconArrowUpBracketDownLine />}
                          />
                        </MenuGroup>
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
                    <AlertDialogAction variant="neutralSolid">Confirm</AlertDialogAction>
                  </ResponsivePair>
                </AlertDialogFooter>
              </AlertDialogContent>
            </Portal>
          </AlertDialogRoot>

          <MenuRoot
            open={fieldButtonMenuOpen}
            onOpenChange={setFieldButtonMenuOpen}
            matchReferenceWidth
          >
            <MenuAnchor asChild>
              <FieldButton
                label="과일"
                description="좋아하는 과일을 선택해주세요."
                values={selectedFruit ? [selectedFruit] : undefined}
                showClearButton={!!selectedFruit}
                onValuesChange={([value]) => setSelectedFruit(value)}
                buttonProps={{
                  onClick: () => setFieldButtonMenuOpen((prev) => !prev),
                  "aria-haspopup": "menu",
                  "aria-expanded": fieldButtonMenuOpen,
                  "aria-label": selectedFruit ? `과일 변경. 현재: ${selectedFruit}` : "과일 선택",
                }}
              >
                {selectedFruit ? (
                  <FieldButtonValue>{selectedFruit}</FieldButtonValue>
                ) : (
                  <FieldButtonPlaceholder>과일을 선택해주세요</FieldButtonPlaceholder>
                )}
              </FieldButton>
            </MenuAnchor>
            <MenuContent>
              <MenuGroup>
                {["사과", "바나나", "포도", "딸기", "수박"].map((fruit) => (
                  <MenuItem key={fruit} label={fruit} onClick={() => setSelectedFruit(fruit)} />
                ))}
              </MenuGroup>
            </MenuContent>
          </MenuRoot>

          <MenuRoot size="medium">
            <MenuTrigger asChild>
              <ActionButton>Many Items</ActionButton>
            </MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuGroupLabel>Recently Played</MenuGroupLabel>
                {Array.from({ length: 30 }, (_, i) => (
                  <MenuItem key={`track-${i}`} label={`Track ${i + 1}`} />
                ))}
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
