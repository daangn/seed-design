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
            <IconHouseFill />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        {/* `Layout` 같은 컴포넌트가 필요할듯 */}
        <div style={{ display: "flex", height: "100%" }}>
          <SideNavigation.Provider defaultCollapsed={false}>
            <SideNavigation.Root>
              <SideNavigation.Header>
                <SideNavigation.Trigger>T</SideNavigation.Trigger>
              </SideNavigation.Header>

              <SideNavigation.Content>
                <SideNavigation.Group>
                  <SideNavigation.GroupLabel>광고</SideNavigation.GroupLabel>

                  <SideNavigation.MenuItemButton>
                    <SideNavigation.MenuItemPrefixIcon svg={<IconHouseFill />} />
                    <SideNavigation.MenuItemLabel>홈</SideNavigation.MenuItemLabel>
                  </SideNavigation.MenuItemButton>

                  <SideNavigation.MenuItemCollapsibleRoot defaultOpen>
                    <SideNavigation.MenuItemCollapsibleTrigger>
                      <SideNavigation.MenuItemPrefixIcon svg={<IconMegaphoneTiltedFill />} />
                      <SideNavigation.MenuItemLabel>광고 만들기</SideNavigation.MenuItemLabel>
                      <SideNavigation.MenuItemSuffixIcon svg={<IconChevronUpSmallFill />} />
                    </SideNavigation.MenuItemCollapsibleTrigger>
                    <SideNavigation.MenuItemCollapsibleContent>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>
                          디스플레이 광고 관리
                        </SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>검색 광고 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                    </SideNavigation.MenuItemCollapsibleContent>
                  </SideNavigation.MenuItemCollapsibleRoot>

                  <SideNavigation.MenuItemButton>
                    <SideNavigation.MenuItemPrefixIcon svg={<IconPlusCircleFill />} />
                    <SideNavigation.MenuItemLabel>광고 만들기</SideNavigation.MenuItemLabel>
                  </SideNavigation.MenuItemButton>

                  <SideNavigation.MenuItemButton>
                    <SideNavigation.MenuItemPrefixIcon svg={<IconDocumentFill />} />
                    <SideNavigation.MenuItemLabel>보고서</SideNavigation.MenuItemLabel>
                  </SideNavigation.MenuItemButton>

                  <SideNavigation.MenuItemCollapsibleRoot defaultOpen>
                    <SideNavigation.MenuItemCollapsibleTrigger>
                      <SideNavigation.MenuItemPrefixIcon svg={<IconToolboxFill />} />
                      <SideNavigation.MenuItemLabel>광고 도구</SideNavigation.MenuItemLabel>
                      <SideNavigation.MenuItemSuffixIcon svg={<IconChevronUpSmallFill />} />
                    </SideNavigation.MenuItemCollapsibleTrigger>
                    <SideNavigation.MenuItemCollapsibleContent>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>카탈로그 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>전환 추적 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>맞춤 타겟 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>리드폼 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>대량 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                    </SideNavigation.MenuItemCollapsibleContent>
                  </SideNavigation.MenuItemCollapsibleRoot>
                </SideNavigation.Group>

                <SideNavigation.Group>
                  <SideNavigation.GroupLabel>결제</SideNavigation.GroupLabel>

                  <SideNavigation.MenuItemCollapsibleRoot>
                    <SideNavigation.MenuItemCollapsibleTrigger>
                      <SideNavigation.MenuItemPrefixIcon svg={<IconWonCircleFill />} />
                      <SideNavigation.MenuItemLabel>광고캐시</SideNavigation.MenuItemLabel>
                      <SideNavigation.MenuItemSuffixIcon svg={<IconChevronUpSmallFill />} />
                    </SideNavigation.MenuItemCollapsibleTrigger>
                    <SideNavigation.MenuItemCollapsibleContent>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>광고캐시 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>세금계산서</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                    </SideNavigation.MenuItemCollapsibleContent>
                  </SideNavigation.MenuItemCollapsibleRoot>

                  <SideNavigation.MenuItemButton>
                    <SideNavigation.MenuItemPrefixIcon svg={<IconReceiptFill />} />
                    <SideNavigation.MenuItemLabel>변경내역</SideNavigation.MenuItemLabel>
                  </SideNavigation.MenuItemButton>
                </SideNavigation.Group>

                <SideNavigation.Group>
                  <SideNavigation.GroupLabel>계정</SideNavigation.GroupLabel>

                  <SideNavigation.MenuItemCollapsibleRoot>
                    <SideNavigation.MenuItemCollapsibleTrigger>
                      <SideNavigation.MenuItemPrefixIcon svg={<IconGearFill />} />
                      <SideNavigation.MenuItemLabel>설정</SideNavigation.MenuItemLabel>
                      <SideNavigation.MenuItemSuffixIcon svg={<IconChevronUpSmallFill />} />
                    </SideNavigation.MenuItemCollapsibleTrigger>
                    <SideNavigation.MenuItemCollapsibleContent>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>광고계정 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>심사서류 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>운영자 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>
                          광고 대행사 관리
                        </SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
                      <SideNavigation.MenuItemCollapsibleItem>
                        <SideNavigation.MenuItemLabel>내 알림 관리</SideNavigation.MenuItemLabel>
                      </SideNavigation.MenuItemCollapsibleItem>
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
