"use client";

import {
  IconBarchartBoardLine,
  IconBellLine,
  IconDocumentLine,
  IconGearLine,
  IconGlobeLine,
  IconHouseLine,
  IconMegaphoneLine,
  IconPerson2Line,
  IconPersonLine,
  IconReceiptLine,
  IconWrenchLine,
} from "@karrotmarket/react-monochrome-icon";
import { Flex } from "@seed-design/react";

import {
  SideNavigationContent,
  SideNavigationFooter,
  SideNavigationGroup,
  SideNavigationGroupLabel,
  SideNavigationHeader,
  SideNavigationInset,
  SideNavigationMenuItemButton,
  SideNavigationMenuItemCollapsibleContent,
  SideNavigationMenuItemCollapsibleRoot,
  SideNavigationMenuItemCollapsibleTrigger,
  SideNavigationProvider,
  SideNavigationRoot,
  SideNavigationTrigger,
} from "../ui/side-navigation";

export default function SideNavigation1() {
  return (
    <SideNavigationProvider>
      <div style={{ display: "flex", height: "100dvh" }}>
        <SideNavigationRoot>
          <SideNavigationHeader>
            <SideNavigationTrigger />
          </SideNavigationHeader>

          <SideNavigationContent>
            <SideNavigationGroup>
              <SideNavigationMenuItemButton prefixIcon={<IconHouseLine />} label="홈" current />
              <SideNavigationMenuItemButton
                prefixIcon={<IconBarchartBoardLine />}
                label="대시보드"
              />
              <SideNavigationMenuItemButton prefixIcon={<IconBellLine />} label="알림" />
            </SideNavigationGroup>

            <SideNavigationGroup>
              <SideNavigationGroupLabel>콘텐츠</SideNavigationGroupLabel>
              <SideNavigationMenuItemButton prefixIcon={<IconDocumentLine />} label="게시글" />
              <SideNavigationMenuItemButton prefixIcon={<IconMegaphoneLine />} label="공지사항" />
              <SideNavigationMenuItemCollapsibleRoot>
                <SideNavigationMenuItemCollapsibleTrigger
                  prefixIcon={<IconGlobeLine />}
                  label="채널"
                />
                <SideNavigationMenuItemCollapsibleContent>
                  <SideNavigationMenuItemButton label="일반" />
                  <SideNavigationMenuItemButton label="공지" />
                  <SideNavigationMenuItemButton label="피드백" />
                </SideNavigationMenuItemCollapsibleContent>
              </SideNavigationMenuItemCollapsibleRoot>
            </SideNavigationGroup>

            <SideNavigationGroup>
              <SideNavigationGroupLabel>관리</SideNavigationGroupLabel>
              <SideNavigationMenuItemButton prefixIcon={<IconPerson2Line />} label="팀 관리" />
              <SideNavigationMenuItemCollapsibleRoot>
                <SideNavigationMenuItemCollapsibleTrigger
                  prefixIcon={<IconWrenchLine />}
                  label="설정"
                />
                <SideNavigationMenuItemCollapsibleContent>
                  <SideNavigationMenuItemButton label="일반 설정" />
                  <SideNavigationMenuItemButton label="권한" />
                  <SideNavigationMenuItemButton label="연동" />
                </SideNavigationMenuItemCollapsibleContent>
              </SideNavigationMenuItemCollapsibleRoot>
              <SideNavigationMenuItemButton prefixIcon={<IconReceiptLine />} label="결제" />
            </SideNavigationGroup>
          </SideNavigationContent>

          <SideNavigationFooter>
            <SideNavigationMenuItemButton prefixIcon={<IconGearLine />} label="환경설정" />
            <SideNavigationMenuItemButton prefixIcon={<IconPersonLine />} label="내 프로필" />
          </SideNavigationFooter>
        </SideNavigationRoot>

        <SideNavigationInset>
          <Flex align="center" justify="center">
            SideNavigationInset
          </Flex>
        </SideNavigationInset>
      </div>
    </SideNavigationProvider>
  );
}
