"use client";

import {
  IconArrowUpRightFill,
  IconChevronDownSmallLine,
} from "@karrotmarket/react-monochrome-icon";
import { Header as SeedHeader, HStack, SuffixIcon } from "@seed-design/react";
import { ActionButton } from "../ui/action-button";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";

const PLATFORM_ITEMS = [
  { label: "Analytics", description: "Track user behavior and engagement" },
  { label: "Data Tools", description: "Query and visualize your data" },
  { label: "API Access", description: "Build integrations with our API" },
];

const FEATURES_ITEMS = [
  { label: "Dashboard", description: "Overview of key metrics" },
  { label: "Automation", description: "Automate repetitive workflows" },
  { label: "Marketplace", description: "Discover and install extensions" },
];

function PlaceholderLogo() {
  return (
    <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function NavMenu({
  label,
  items,
}: {
  label: string;
  items: { label: string; description: string }[];
}) {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <SeedHeader.ActionButton size="small">
          {label}
          <SuffixIcon svg={<IconChevronDownSmallLine />} />
        </SeedHeader.ActionButton>
      </MenuTrigger>
      <MenuContent>
        {items.map((item) => (
          <MenuItem key={item.label} label={item.label} description={item.description} />
        ))}
      </MenuContent>
    </MenuRoot>
  );
}

export default function Header() {
  return (
    <SeedHeader.Root divider>
      <SeedHeader.Left>
        <PlaceholderLogo />
        <HStack gap="x2" px="x4">
          <NavMenu label="Platform" items={PLATFORM_ITEMS} />
          <NavMenu label="Features" items={FEATURES_ITEMS} />
          <SeedHeader.ActionButton size="small">Integrations</SeedHeader.ActionButton>
          <SeedHeader.ActionButton size="small">Case Studies</SeedHeader.ActionButton>
          <SeedHeader.ActionButton size="small">
            Docs
            <SuffixIcon svg={<IconArrowUpRightFill />} />
          </SeedHeader.ActionButton>
        </HStack>
      </SeedHeader.Left>
      <SeedHeader.Right>
        <SeedHeader.ActionButton size="small">Support</SeedHeader.ActionButton>
        <ActionButton variant="neutralSolid" size="small">
          Get Started
        </ActionButton>
      </SeedHeader.Right>
    </SeedHeader.Root>
  );
}
