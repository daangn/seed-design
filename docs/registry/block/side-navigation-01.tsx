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
  SideNavigationItemButton,
  SideNavigationItemCollapsible,
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
              <SideNavigationItemButton prefixIcon={<IconHouseLine />} label="홈" current />
              <SideNavigationItemButton
                prefixIcon={<IconBarchartBoardLine />}
                label="대시보드"
              />
              <SideNavigationItemButton prefixIcon={<IconBellLine />} label="알림" />
            </SideNavigationGroup>

            <SideNavigationGroup>
              <SideNavigationGroupLabel>콘텐츠</SideNavigationGroupLabel>
              <SideNavigationItemButton prefixIcon={<IconDocumentLine />} label="게시글" />
              <SideNavigationItemButton prefixIcon={<IconMegaphoneLine />} label="공지사항" />
              <SideNavigationItemCollapsible
                prefixIcon={<IconGlobeLine />}
                label="채널"
                items={[{ label: "일반" }, { label: "공지" }, { label: "피드백" }]}
              />
            </SideNavigationGroup>

            <SideNavigationGroup>
              <SideNavigationGroupLabel>관리</SideNavigationGroupLabel>
              <SideNavigationItemButton prefixIcon={<IconPerson2Line />} label="팀 관리" />
              <SideNavigationItemCollapsible
                prefixIcon={<IconWrenchLine />}
                label="설정"
                items={[{ label: "일반 설정" }, { label: "권한" }, { label: "연동" }]}
              />
              <SideNavigationItemButton prefixIcon={<IconReceiptLine />} label="결제" />
            </SideNavigationGroup>
          </SideNavigationContent>

          <SideNavigationFooter>
            <SideNavigationItemButton prefixIcon={<IconGearLine />} label="환경설정" />
            <SideNavigationItemButton prefixIcon={<IconPersonLine />} label="내 프로필" />
          </SideNavigationFooter>
        </SideNavigationRoot>

        <SideNavigationInset>
          <Layout.Content>SideNavigationInset</Layout.Content>
        </SideNavigationInset>
      </SideNavigationProvider>
    </Layout.Root>
  );
}
