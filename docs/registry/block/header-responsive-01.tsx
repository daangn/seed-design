"use client";

import {
  IconArrowUpRightFill,
  IconHorizline3VerticalLine,
} from "@karrotmarket/react-monochrome-icon";
import { Box, Header as SeedHeader, HStack, Icon, SuffixIcon, VStack } from "@seed-design/react";
import { ActionButton } from "../ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "../ui/side-panel";

const NAV_ITEMS = [
  { label: "Platform", href: "/platform" },
  { label: "Features", href: "/features" },
  { label: "Integrations", href: "/integrations" },
  { label: "Case Studies", href: "/case-studies" },
];

const EXTERNAL_LINK = { label: "Docs", href: "https://docs.example.com" };

function PlaceholderLogo() {
  return (
    <svg
      width="80"
      height="40"
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Company logo"
    >
      <rect width="80" height="40" rx="8" fill="currentColor" fillOpacity="0.08" />
      <text
        x="40"
        y="24"
        textAnchor="middle"
        fill="currentColor"
        fillOpacity="0.5"
        fontSize="14"
        fontWeight="600"
        fontFamily="inherit"
      >
        Logo
      </text>
    </svg>
  );
}

export default function ResponsiveHeader() {
  return (
    <SeedHeader.Root divider>
      <SeedHeader.Left>
        <PlaceholderLogo />
        <Box display={{ base: "none", md: "flex" }}>
          <HStack gap="x2" px="x4">
            {NAV_ITEMS.map((item) => (
              <SeedHeader.ActionButton key={item.label} size="small">
                {item.label}
              </SeedHeader.ActionButton>
            ))}
            <SeedHeader.ActionButton size="small">
              {EXTERNAL_LINK.label}
              <SuffixIcon svg={<IconArrowUpRightFill />} />
            </SeedHeader.ActionButton>
          </HStack>
        </Box>
      </SeedHeader.Left>
      <SeedHeader.Right>
        <Box display={{ base: "none", md: "flex" }}>
          <ActionButton variant="neutralSolid" size="small">
            Get Started
          </ActionButton>
        </Box>
        <Box hideFrom="md">
          <SidePanelRoot direction="left">
            <SidePanelTrigger asChild>
              <SeedHeader.ActionButton size="small" aria-label="메뉴 열기">
                <Icon svg={<IconHorizline3VerticalLine />} size="20px" />
              </SeedHeader.ActionButton>
            </SidePanelTrigger>
            <SidePanelContent title="Menu">
              <SidePanelBody>
                <VStack gap="x1" paddingY="x2">
                  {NAV_ITEMS.map((item) => (
                    <ActionButton key={item.label} variant="neutralWeak" layout="withText">
                      {item.label}
                    </ActionButton>
                  ))}
                  <ActionButton variant="neutralWeak" layout="withText">
                    {EXTERNAL_LINK.label}
                    <SuffixIcon svg={<IconArrowUpRightFill />} />
                  </ActionButton>
                </VStack>
              </SidePanelBody>
              <SidePanelFooter>
                <ActionButton variant="neutralSolid" size="medium">
                  Get Started
                </ActionButton>
              </SidePanelFooter>
            </SidePanelContent>
          </SidePanelRoot>
        </Box>
      </SeedHeader.Right>
    </SeedHeader.Root>
  );
}
