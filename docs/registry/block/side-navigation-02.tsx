"use client";

import {
  IconBellFill,
  IconHouseFill,
  IconPersonFill,
  IconWrenchFill,
} from "@karrotmarket/react-monochrome-icon";
import { Badge, Box, HStack, Layout, Text, VStack } from "@seed-design/react";
import { useSideNavigationContext } from "@seed-design/react/primitive";
import { useState } from "react";

import { Avatar } from "../ui/avatar";
import { IdentityPlaceholder } from "../ui/identity-placeholder";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
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

function SideNavigationHeaderContent() {
  const { collapsed } = useSideNavigationContext();

  return (
    <VStack paddingX="x2" paddingY="x2" gap="x3">
      <HStack alignItems="center" height="x8">
        {!collapsed && (
          <Badge size="large" tone="neutral" variant="weak">
            서비스명
          </Badge>
        )}
      </HStack>

      <MenuRoot matchReferenceWidth={!collapsed} placement={collapsed ? "right-start" : "bottom"}>
        <MenuTrigger asChild>
          <HStack
            as="button"
            alignItems="center"
            gap="x3"
            width="full"
            borderRadius="x2_5"
            style={{ cursor: "pointer" }}
          >
            <Box flexShrink={0} {...(collapsed && { style: { transform: "translateX(-5px)" } })}>
              <Avatar
                size="36"
                src="https://avatars.githubusercontent.com/u/54893898?v=4"
                fallback={<IdentityPlaceholder />}
              />
            </Box>
            {!collapsed && (
              <Text fontSize="t4" lineHeight="t4" color="fg.neutral" maxLines={1}>
                닉네임
              </Text>
            )}
          </HStack>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuItem label="프로필 설정" />
            <MenuItem label="계정 전환" />
            <MenuItem label="로그아웃" />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </VStack>
  );
}

export default function SideNavigation2() {
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
            <SideNavigationHeaderContent />
            <SideNavigationTrigger />
          </SideNavigationHeader>

          <SideNavigationContent>
            <SideNavigationGroup
              items={[
                { label: "홈", prefixIcon: <IconHouseFill />, ...navItemProps("홈") },
                { label: "알림", prefixIcon: <IconBellFill />, ...navItemProps("알림") },
                {
                  label: "설정",
                  prefixIcon: <IconWrenchFill />,
                  items: [
                    { label: "일반", ...navItemProps("일반") },
                    { label: "알림 설정", ...navItemProps("알림 설정") },
                    { label: "보안", ...navItemProps("보안") },
                  ],
                },
              ]}
            />
          </SideNavigationContent>

          <SideNavigationFooter>
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
