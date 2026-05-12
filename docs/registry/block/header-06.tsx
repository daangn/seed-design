"use client";

import { useEffect, useState } from "react";
import { Header as SeedHeader, Text, VStack } from "@seed-design/react";
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

const SCROLL_THRESHOLD = 50;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "200vh" }}>
      <div
        style={{
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VStack align="center" gap="x4">
          <Text as="h1" textStyle="t8Bold" style={{ color: "#fff" }}>
            Landing Page Hero
          </Text>
          <Text textStyle="t4Regular" style={{ color: "rgba(255,255,255,0.8)" }}>
            Scroll down to see the header transition
          </Text>
        </VStack>
      </div>

      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text textStyle="t5Regular" style={{ opacity: 0.5 }}>
          Content section
        </Text>
      </div>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <SeedHeader.Root
          transparent={!scrolled}
          divider={scrolled}
          style={{
            transition: "background-color 200ms, border-color 200ms",
          }}
        >
          <SeedHeader.Left>
            <PlaceholderLogo />
          </SeedHeader.Left>
          <SeedHeader.Right>
            <SeedHeader.ActionButton size="small">About</SeedHeader.ActionButton>
            <SeedHeader.ActionButton size="small">Contact</SeedHeader.ActionButton>
            <ActionButton variant="neutralSolid" size="small">
              Sign Up
            </ActionButton>
          </SeedHeader.Right>
        </SeedHeader.Root>
      </div>
    </div>
  );
}
