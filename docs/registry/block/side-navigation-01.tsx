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
import { Layout } from "@seed-design/react";

import {
  SideNavigationContent,
  SideNavigationFooter,
  SideNavigationGroup,
  SideNavigationGroupLabel,
  SideNavigationHeader,
  SideNavigationInset,
  SideNavigationMenuItemButton,
  SideNavigationMenuItemCollapsible,
  SideNavigationProvider,
  SideNavigationRoot,
  SideNavigationTrigger,
} from "../ui/side-navigation";

export default function SideNavigation1() {
  return (
    <Layout.Root>
      <SideNavigationProvider>
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
              <SideNavigationMenuItemCollapsible
                prefixIcon={<IconGlobeLine />}
                label="채널"
                items={[{ label: "일반" }, { label: "공지" }, { label: "피드백" }]}
              />
            </SideNavigationGroup>

            <SideNavigationGroup>
              <SideNavigationGroupLabel>관리</SideNavigationGroupLabel>
              <SideNavigationMenuItemButton prefixIcon={<IconPerson2Line />} label="팀 관리" />
              <SideNavigationMenuItemCollapsible
                prefixIcon={<IconWrenchLine />}
                label="설정"
                items={[{ label: "일반 설정" }, { label: "권한" }, { label: "연동" }]}
              />
              <SideNavigationMenuItemButton prefixIcon={<IconReceiptLine />} label="결제" />
            </SideNavigationGroup>
          </SideNavigationContent>

          <SideNavigationFooter>
            <SideNavigationMenuItemButton prefixIcon={<IconGearLine />} label="환경설정" />
            <SideNavigationMenuItemButton prefixIcon={<IconPersonLine />} label="내 프로필" />
          </SideNavigationFooter>
        </SideNavigationRoot>

        <SideNavigationInset>
          <Layout.Content>SideNavigationInset</Layout.Content>
        </SideNavigationInset>
      </SideNavigationProvider>
    </Layout.Root>
  );
}
