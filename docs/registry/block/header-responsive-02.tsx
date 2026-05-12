"use client";

import { IconHorizline3VerticalLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Header as SeedHeader, HStack, Icon, SuffixIcon, VStack } from "@seed-design/react";
import { AccordionContent, Accordion, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ActionButton } from "../ui/action-button";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "../ui/side-panel";

type NavItem = {
  id: string;
  label: string;
  href?: string;
  subItems?: { label: string; href: string; external?: boolean }[];
};

const NAV_ITEMS: NavItem[] = [
  { id: "used", label: "중고거래", href: "/used" },
  {
    id: "realty",
    label: "부동산",
    subItems: [
      { label: "부동산 검색", href: "/realty/search" },
      { label: "중개사 서비스", href: "/realty/agents", external: true },
      { label: "중개사 이용 가이드", href: "/realty/guide", external: true },
    ],
  },
  {
    id: "car",
    label: "중고차",
    subItems: [
      { label: "중고차 검색", href: "/car/search" },
      { label: "딜러 입점하기", href: "/car/dealer", external: true },
    ],
  },
  {
    id: "jobs",
    label: "알바/과외/레슨",
    subItems: [
      { label: "알바 찾기", href: "/jobs/parttime" },
      { label: "과외 찾기", href: "/jobs/tutoring" },
      { label: "레슨 찾기", href: "/jobs/lessons" },
    ],
  },
  { id: "biz", label: "동네업체", href: "/biz" },
  { id: "story", label: "동네생활", href: "/story" },
  { id: "group", label: "모임", href: "/group" },
  { id: "cafe", label: "카페", href: "/cafe" },
];

function DaangnLogo() {
  return (
    <HStack gap="x1" alignItems="center">
      <span style={{ fontSize: 24 }} aria-hidden="true">
        🥕
      </span>
      <span style={{ fontWeight: 700, fontSize: 18 }}>당근</span>
    </HStack>
  );
}

function DesktopNavItem({ item }: { item: NavItem }) {
  if (!item.subItems) {
    return <SeedHeader.ActionButton size="small">{item.label}</SeedHeader.ActionButton>;
  }
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <SeedHeader.ActionButton size="small">{item.label}</SeedHeader.ActionButton>
      </MenuTrigger>
      <MenuContent>
        {item.subItems.map((sub) => (
          <MenuItem key={sub.label} label={sub.label} />
        ))}
      </MenuContent>
    </MenuRoot>
  );
}

function MobileNavItem({ item }: { item: NavItem }) {
  if (!item.subItems) {
    return (
      <ActionButton variant="neutralWeak" layout="withText">
        {item.label}
      </ActionButton>
    );
  }
  return (
    <AccordionItem value={item.id}>
      <AccordionTrigger title={item.label} />
      <AccordionContent>
        <VStack gap="x1" paddingY="x2" paddingX="x4">
          {item.subItems.map((sub) => (
            <ActionButton
              key={sub.label}
              variant="neutralWeak"
              layout="withText"
              size="small"
              color="fg.neutralSubtle"
            >
              {sub.label}
              {sub.external && (
                <SuffixIcon
                  svg={
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M14 4h6v6h-2V7.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V4zM6 6v2h6v2H4v10h10v-8h2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2z" />
                    </svg>
                  }
                />
              )}
            </ActionButton>
          ))}
        </VStack>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function DaangnResponsiveHeader() {
  return (
    <SeedHeader.Root divider>
      <SeedHeader.Left>
        <DaangnLogo />
        <Box display={{ base: "none", md: "flex" }}>
          <HStack gap="x2" px="x4">
            {NAV_ITEMS.map((item) => (
              <DesktopNavItem key={item.id} item={item} />
            ))}
          </HStack>
        </Box>
      </SeedHeader.Left>
      <SeedHeader.Right>
        <Box display={{ base: "none", md: "flex" }}>
          <ActionButton variant="neutralSolid" size="small">
            앱 다운로드
          </ActionButton>
        </Box>
        <Box hideFrom="md">
          <SidePanelRoot direction="left">
            <SidePanelTrigger asChild>
              <SeedHeader.ActionButton size="small" aria-label="메뉴 열기">
                <Icon svg={<IconHorizline3VerticalLine />} size="20px" />
              </SeedHeader.ActionButton>
            </SidePanelTrigger>
            <SidePanelContent title="메뉴">
              <SidePanelBody>
                <Accordion>
                  <VStack gap="x0" paddingY="x2">
                    {NAV_ITEMS.map((item) => (
                      <MobileNavItem key={item.id} item={item} />
                    ))}
                  </VStack>
                </Accordion>
              </SidePanelBody>
              <SidePanelFooter>
                <ActionButton variant="neutralSolid" size="medium">
                  앱 다운로드
                </ActionButton>
              </SidePanelFooter>
            </SidePanelContent>
          </SidePanelRoot>
        </Box>
      </SeedHeader.Right>
    </SeedHeader.Root>
  );
}
