"use client";

import { Header as SeedHeader } from "@seed-design/react";

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
      <SeedHeader.Right>
        <SeedHeader.ActionButton size="small">My Account</SeedHeader.ActionButton>
      </SeedHeader.Right>
    </SeedHeader.Root>
  );
}
