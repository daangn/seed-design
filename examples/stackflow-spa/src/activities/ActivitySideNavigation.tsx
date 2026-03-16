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
import { SideNavigation } from "seed-design/ui/side-navigation";

import {
  IconHouseFill,
  IconChevronUpSmallFill,
  IconMegaphoneTiltedFill,
  IconPlusCircleFill,
  IconDocumentFill,
  IconToolboxFill,
  IconWonCircleFill,
  IconReceiptFill,
  IconGearFill,
} from "@karrotmarket/react-monochrome-icon";

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
            <IconHouseFill />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div style={{ display: "flex", height: "100%" }}>
          <SideNavigation.Provider defaultCollapsed={false}>
            <SideNavigation.Root>
              <SideNavigation.Header>header</SideNavigation.Header>
              <SideNavigation.Trigger>T</SideNavigation.Trigger>
              <SideNavigation.Content>
                <SideNavigation.Group>
                  <SideNavigation.GroupLabel>광고</SideNavigation.GroupLabel>

                  <SideNavigation.MenuItemButton prefixIcon={<IconHouseFill />} label="홈" />

                  <SideNavigation.MenuItemCollapsibleRoot defaultOpen>
                    <SideNavigation.MenuItemCollapsibleTrigger
                      prefixIcon={<IconMegaphoneTiltedFill />}
                      label="광고 관리"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigation.MenuItemCollapsibleContent>
                      <SideNavigation.MenuItem label="디스플레이 광고 관리" />
                      <SideNavigation.MenuItem label="검색 광고 관리" />
                    </SideNavigation.MenuItemCollapsibleContent>
                  </SideNavigation.MenuItemCollapsibleRoot>

                  <SideNavigation.MenuItemButton
                    prefixIcon={<IconPlusCircleFill />}
                    label="광고 만들기"
                  />

                  <SideNavigation.MenuItemButton prefixIcon={<IconDocumentFill />} label="보고서" />

                  <SideNavigation.MenuItemCollapsibleRoot defaultOpen>
                    <SideNavigation.MenuItemCollapsibleTrigger
                      prefixIcon={<IconToolboxFill />}
                      label="광고 도구"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigation.MenuItemCollapsibleContent>
                      <SideNavigation.MenuItem label="카탈로그 관리" />
                      <SideNavigation.MenuItem label="전환 추적 관리" />
                      <SideNavigation.MenuItem label="맞춤 타겟 관리" />
                      <SideNavigation.MenuItem label="리드폼 관리" />
                      <SideNavigation.MenuItem label="대량 관리" />
                    </SideNavigation.MenuItemCollapsibleContent>
                  </SideNavigation.MenuItemCollapsibleRoot>
                </SideNavigation.Group>

                <SideNavigation.Group>
                  <SideNavigation.GroupLabel>결제</SideNavigation.GroupLabel>

                  <SideNavigation.MenuItemCollapsibleRoot>
                    <SideNavigation.MenuItemCollapsibleTrigger
                      prefixIcon={<IconWonCircleFill />}
                      label="광고캐시"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigation.MenuItemCollapsibleContent>
                      <SideNavigation.MenuItem label="광고캐시 관리" />
                      <SideNavigation.MenuItem label="세금계산서" />
                    </SideNavigation.MenuItemCollapsibleContent>
                  </SideNavigation.MenuItemCollapsibleRoot>

                  <SideNavigation.MenuItemButton
                    prefixIcon={<IconReceiptFill />}
                    label="변경내역"
                  />
                </SideNavigation.Group>

                <SideNavigation.Group>
                  <SideNavigation.GroupLabel>계정</SideNavigation.GroupLabel>

                  <SideNavigation.MenuItemCollapsibleRoot>
                    <SideNavigation.MenuItemCollapsibleTrigger
                      prefixIcon={<IconGearFill />}
                      label="설정"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigation.MenuItemCollapsibleContent>
                      <SideNavigation.MenuItem label="광고계정 관리" />
                      <SideNavigation.MenuItem label="심사서류 관리" />
                      <SideNavigation.MenuItem label="운영자 관리" />
                      <SideNavigation.MenuItem label="광고 대행사 관리" />
                      <SideNavigation.MenuItem label="내 알림 관리" />
                    </SideNavigation.MenuItemCollapsibleContent>
                  </SideNavigation.MenuItemCollapsibleRoot>
                </SideNavigation.Group>
              </SideNavigation.Content>

              <SideNavigation.Footer />
            </SideNavigation.Root>

            <SideNavigation.Inset>
              <h2>Main Content Area</h2>
              <p>This is the inset area next to the side navigation.</p>
            </SideNavigation.Inset>
          </SideNavigation.Provider>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySideNavigation;
