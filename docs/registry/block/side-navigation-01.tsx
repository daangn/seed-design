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
  SideNavigationHeader,
  SideNavigationInset,
  SideNavigationItemButton,
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
            <SideNavigationGroup
              items={[
                { label: "홈", prefixIcon: <IconHouseLine />, current: true },
                { label: "대시보드", prefixIcon: <IconBarchartBoardLine /> },
                { label: "알림", prefixIcon: <IconBellLine /> },
              ]}
            />

            <SideNavigationGroup
              label="콘텐츠"
              items={[
                { label: "게시글", prefixIcon: <IconDocumentLine /> },
                { label: "공지사항", prefixIcon: <IconMegaphoneLine /> },
                {
                  label: "채널",
                  prefixIcon: <IconGlobeLine />,
                  items: [{ label: "일반" }, { label: "공지" }, { label: "피드백" }],
                },
              ]}
            />

            <SideNavigationGroup
              label="관리"
              items={[
                { label: "팀 관리", prefixIcon: <IconPerson2Line /> },
                {
                  label: "설정",
                  prefixIcon: <IconWrenchLine />,
                  items: [{ label: "일반 설정" }, { label: "권한" }, { label: "연동" }],
                },
                { label: "결제", prefixIcon: <IconReceiptLine /> },
              ]}
            />
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
