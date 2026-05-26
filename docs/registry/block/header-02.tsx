"use client";

import { Header as SeedHeader, HStack } from "@seed-design/react";
import { ActionButton } from "../ui/action-button";

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

export default function Header() {
  return (
    <SeedHeader.Root divider>
      <SeedHeader.Left>
        <PlaceholderLogo />
      </SeedHeader.Left>
      <SeedHeader.Center>
        <HStack gap="x2" px="x4">
          <SeedHeader.ActionButton size="small">Products</SeedHeader.ActionButton>
          <SeedHeader.ActionButton size="small">Solutions</SeedHeader.ActionButton>
          <SeedHeader.ActionButton size="small">Pricing</SeedHeader.ActionButton>
          <SeedHeader.ActionButton size="small">Resources</SeedHeader.ActionButton>
          <SeedHeader.ActionButton size="small">Enterprise</SeedHeader.ActionButton>
          <SeedHeader.ActionButton size="small">Blog</SeedHeader.ActionButton>
        </HStack>
      </SeedHeader.Center>
      <SeedHeader.Right>
        <SeedHeader.ActionButton size="small">Search</SeedHeader.ActionButton>
        <ActionButton variant="neutralSolid" size="small">
          Sign Up
        </ActionButton>
      </SeedHeader.Right>
    </SeedHeader.Root>
  );
}
