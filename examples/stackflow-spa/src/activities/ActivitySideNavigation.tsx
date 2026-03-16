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
  SideNavigationProvider,
  SideNavigationRoot,
  SideNavigationHeader,
  SideNavigationContent,
  SideNavigationGroup,
  SideNavigationGroupLabel,
  SideNavigationMenuItemCollapsibleRoot,
  SideNavigationMenuItemCollapsibleTrigger,
  SideNavigationMenuItemCollapsibleContent,
  SideNavigationMenuItemButton,
  SideNavigationFooter,
  SideNavigationInset,
  SideNavigationTrigger,
} from "seed-design/ui/side-navigation";

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
  IconBarchartSquareFill,
  IconPersonFill,
  IconPerson2Fill,
  IconStoreFill,
  IconTagFill,
  IconBellFill,
  IconClockFill,
  IconBookmarkFill,
  IconStarFill,
  IconGiftFill,
  IconFlagFill,
  IconLockFill,
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
          <SideNavigationProvider defaultCollapsed={false}>
            <SideNavigationRoot>
              <SideNavigationHeader>header</SideNavigationHeader>
              <SideNavigationTrigger />
              <SideNavigationContent>
                <SideNavigationGroup>
                  <SideNavigationGroupLabel>광고</SideNavigationGroupLabel>

                  <SideNavigationMenuItemButton prefixIcon={<IconHouseFill />} label="홈" />

                  <SideNavigationMenuItemCollapsibleRoot defaultOpen>
                    <SideNavigationMenuItemCollapsibleTrigger
                      prefixIcon={<IconMegaphoneTiltedFill />}
                      label="광고 관리"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigationMenuItemCollapsibleContent>
                      <SideNavigationMenuItemButton label="디스플레이 광고 관리" />
                      <SideNavigationMenuItemButton label="검색 광고 관리" />
                    </SideNavigationMenuItemCollapsibleContent>
                  </SideNavigationMenuItemCollapsibleRoot>

                  <SideNavigationMenuItemButton
                    prefixIcon={<IconPlusCircleFill />}
                    label="광고 만들기"
                  />

                  <SideNavigationMenuItemButton prefixIcon={<IconDocumentFill />} label="보고서" />

                  <SideNavigationMenuItemCollapsibleRoot defaultOpen>
                    <SideNavigationMenuItemCollapsibleTrigger
                      prefixIcon={<IconToolboxFill />}
                      label="광고 도구"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigationMenuItemCollapsibleContent>
                      <SideNavigationMenuItemButton label="카탈로그 관리" />
                      <SideNavigationMenuItemButton label="전환 추적 관리" />
                      <SideNavigationMenuItemButton label="맞춤 타겟 관리" />
                      <SideNavigationMenuItemButton label="리드폼 관리" />
                      <SideNavigationMenuItemButton label="대량 관리" />
                    </SideNavigationMenuItemCollapsibleContent>
                  </SideNavigationMenuItemCollapsibleRoot>
                </SideNavigationGroup>

                <SideNavigationGroup>
                  <SideNavigationGroupLabel>결제</SideNavigationGroupLabel>

                  <SideNavigationMenuItemCollapsibleRoot>
                    <SideNavigationMenuItemCollapsibleTrigger
                      prefixIcon={<IconWonCircleFill />}
                      label="광고캐시"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigationMenuItemCollapsibleContent>
                      <SideNavigationMenuItemButton label="광고캐시 관리" />
                      <SideNavigationMenuItemButton label="세금계산서" />
                    </SideNavigationMenuItemCollapsibleContent>
                  </SideNavigationMenuItemCollapsibleRoot>

                  <SideNavigationMenuItemButton prefixIcon={<IconReceiptFill />} label="변경내역" />
                </SideNavigationGroup>

                <SideNavigationGroup>
                  <SideNavigationGroupLabel>계정</SideNavigationGroupLabel>

                  <SideNavigationMenuItemCollapsibleRoot>
                    <SideNavigationMenuItemCollapsibleTrigger
                      prefixIcon={<IconGearFill />}
                      label="설정"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigationMenuItemCollapsibleContent>
                      <SideNavigationMenuItemButton label="광고계정 관리" />
                      <SideNavigationMenuItemButton label="심사서류 관리" />
                      <SideNavigationMenuItemButton label="운영자 관리" />
                      <SideNavigationMenuItemButton label="광고 대행사 관리" />
                      <SideNavigationMenuItemButton label="내 알림 관리" />
                    </SideNavigationMenuItemCollapsibleContent>
                  </SideNavigationMenuItemCollapsibleRoot>
                </SideNavigationGroup>

                <SideNavigationGroup>
                  <SideNavigationGroupLabel>성과 분석</SideNavigationGroupLabel>

                  <SideNavigationMenuItemButton
                    prefixIcon={<IconBarchartSquareFill />}
                    label="대시보드"
                  />
                  <SideNavigationMenuItemCollapsibleRoot>
                    <SideNavigationMenuItemCollapsibleTrigger
                      prefixIcon={<IconStarFill />}
                      label="성과 리포트"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigationMenuItemCollapsibleContent>
                      <SideNavigationMenuItemButton label="일간 리포트" />
                      <SideNavigationMenuItemButton label="주간 리포트" />
                      <SideNavigationMenuItemButton label="월간 리포트" />
                      <SideNavigationMenuItemButton label="맞춤 기간 리포트" />
                    </SideNavigationMenuItemCollapsibleContent>
                  </SideNavigationMenuItemCollapsibleRoot>
                  <SideNavigationMenuItemButton prefixIcon={<IconFlagFill />} label="목표 관리" />
                  <SideNavigationMenuItemButton
                    prefixIcon={<IconBookmarkFill />}
                    label="저장된 필터"
                  />
                </SideNavigationGroup>

                <SideNavigationGroup>
                  <SideNavigationGroupLabel>비즈니스</SideNavigationGroupLabel>

                  <SideNavigationMenuItemButton
                    prefixIcon={<IconStoreFill />}
                    label="비즈프로필 관리"
                  />
                  <SideNavigationMenuItemCollapsibleRoot>
                    <SideNavigationMenuItemCollapsibleTrigger
                      prefixIcon={<IconTagFill />}
                      label="쿠폰"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigationMenuItemCollapsibleContent>
                      <SideNavigationMenuItemButton label="쿠폰 만들기" />
                      <SideNavigationMenuItemButton label="발급 내역" />
                      <SideNavigationMenuItemButton label="사용 내역" />
                    </SideNavigationMenuItemCollapsibleContent>
                  </SideNavigationMenuItemCollapsibleRoot>
                  <SideNavigationMenuItemButton prefixIcon={<IconGiftFill />} label="프로모션" />
                </SideNavigationGroup>

                <SideNavigationGroup>
                  <SideNavigationGroupLabel>고객 관리</SideNavigationGroupLabel>

                  <SideNavigationMenuItemCollapsibleRoot>
                    <SideNavigationMenuItemCollapsibleTrigger
                      prefixIcon={<IconPersonFill />}
                      label="타겟 고객"
                      suffixIcon={<IconChevronUpSmallFill />}
                    />
                    <SideNavigationMenuItemCollapsibleContent>
                      <SideNavigationMenuItemButton label="고객 세그먼트" />
                      <SideNavigationMenuItemButton label="리타겟팅 목록" />
                      <SideNavigationMenuItemButton label="유사 타겟" />
                    </SideNavigationMenuItemCollapsibleContent>
                  </SideNavigationMenuItemCollapsibleRoot>
                  <SideNavigationMenuItemButton
                    prefixIcon={<IconPerson2Fill />}
                    label="고객 인사이트"
                  />
                  <SideNavigationMenuItemButton prefixIcon={<IconBellFill />} label="알림 발송" />
                </SideNavigationGroup>

                <SideNavigationGroup>
                  <SideNavigationGroupLabel>기타</SideNavigationGroupLabel>

                  <SideNavigationMenuItemButton prefixIcon={<IconClockFill />} label="활동 로그" />
                  <SideNavigationMenuItemButton prefixIcon={<IconLockFill />} label="권한 관리" />
                </SideNavigationGroup>
              </SideNavigationContent>

              <SideNavigationFooter />
            </SideNavigationRoot>

            <SideNavigationInset>
              <h2>Main Content Area</h2>
              <p>This is the inset area next to the side navigation.</p>
            </SideNavigationInset>
          </SideNavigationProvider>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivitySideNavigation;
