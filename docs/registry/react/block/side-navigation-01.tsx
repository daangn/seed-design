"use client";

import {
  IconBarchartBoardFill,
  IconBellFill,
  IconDocumentFill,
  IconGearFill,
  IconGlobeFill,
  IconHouseFill,
  IconMegaphoneFill,
  IconPerson2Fill,
  IconPersonFill,
  IconReceiptFill,
  IconWrenchFill,
} from "@karrotmarket/react-monochrome-icon";
import { Layout, Text, VStack } from "@seed-design/react";
import { useState } from "react";

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
  const [currentItem, setCurrentItem] = useState("홈");

  const navItemProps = (label: string) => ({
    current: currentItem === label,
    onClick: () => setCurrentItem(label),
  });

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
                { label: "홈", prefixIcon: <IconHouseFill />, ...navItemProps("홈") },
                {
                  label: "대시보드",
                  prefixIcon: <IconBarchartBoardFill />,
                  ...navItemProps("대시보드"),
                },
                { label: "알림", prefixIcon: <IconBellFill />, ...navItemProps("알림") },
              ]}
            />

            <SideNavigationGroup
              label="콘텐츠"
              items={[
                { label: "게시글", prefixIcon: <IconDocumentFill />, ...navItemProps("게시글") },
                {
                  label: "공지사항",
                  prefixIcon: <IconMegaphoneFill />,
                  ...navItemProps("공지사항"),
                },
                {
                  label: "채널",
                  prefixIcon: <IconGlobeFill />,
                  items: [
                    { label: "일반", ...navItemProps("일반") },
                    { label: "공지", ...navItemProps("공지") },
                    { label: "피드백", ...navItemProps("피드백") },
                  ],
                },
              ]}
            />

            <SideNavigationGroup
              label="관리"
              items={[
                { label: "팀 관리", prefixIcon: <IconPerson2Fill />, ...navItemProps("팀 관리") },
                {
                  label: "설정",
                  prefixIcon: <IconWrenchFill />,
                  items: [
                    { label: "일반 설정", ...navItemProps("일반 설정") },
                    { label: "권한", ...navItemProps("권한") },
                    { label: "연동", ...navItemProps("연동") },
                  ],
                },
                { label: "결제", prefixIcon: <IconReceiptFill />, ...navItemProps("결제") },
              ]}
            />
          </SideNavigationContent>

          <SideNavigationFooter>
            <SideNavigationItemButton
              prefixIcon={<IconGearFill />}
              label="환경설정"
              {...navItemProps("환경설정")}
            />
            <SideNavigationItemButton
              prefixIcon={<IconPersonFill />}
              label="내 프로필"
              {...navItemProps("내 프로필")}
            />
          </SideNavigationFooter>
        </SideNavigationRoot>

        <SideNavigationInset>
          <Layout.Content>
            <VStack px="spacingX.globalGutter" py="x4">
              <Text as="p" textStyle="articleBody">
                현재 선택: {currentItem}
              </Text>
            </VStack>
          </Layout.Content>
        </SideNavigationInset>
      </SideNavigationProvider>
    </Layout.Root>
  );
}
