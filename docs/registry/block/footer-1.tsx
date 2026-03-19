"use client";

import { Box, HStack, Text, VStack } from "@seed-design/react";
import * as React from "react";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <Text textStyle="t4Regular" color="fg.neutralSubtle">
        {children}
      </Text>
    </a>
  );
}

function FooterInfo({ children }: { children: React.ReactNode }) {
  return (
    <Text textStyle="t4Regular" color="fg.neutralMuted">
      {children}
    </Text>
  );
}

export function Footer1() {
  return (
    <Box
      as="footer"
      width="100%"
      style={{ maxWidth: "1040px", marginInline: "auto" }}
      paddingX="x8"
      paddingY="x10"
    >
      <VStack gap="x4" align="flex-start">
        <HStack gap="x4" wrap>
          <FooterLink href="#">이용약관</FooterLink>
          <FooterLink href="#">개인정보처리방침</FooterLink>
          <FooterLink href="#">위치기반서비스 이용약관</FooterLink>
          <FooterLink href="#">광고주센터</FooterLink>
          <FooterLink href="#">고객센터</FooterLink>
        </HStack>

        <VStack gap="x1" align="flex-start">
          <FooterInfo>주식회사 당근마켓 | 대표 김용현 | 사업자등록번호 000-00-00000</FooterInfo>
          <FooterInfo>
            직업정보제공사업 신고번호 J0000000000000 | 통신판매업 신고번호 제2000-서울서초-0000호
          </FooterInfo>
          <FooterInfo>서울특별시 서초구 강남대로 000, 0층 (서초동, 당근빌딩)</FooterInfo>
        </VStack>

        <HStack gap="x3" wrap>
          <FooterLink href="mailto:cs@daangn.com">cs@daangn.com</FooterLink>
        </HStack>

        <Text textStyle="t4Regular" color="fg.neutralMuted">
          © 2026 Danggeun Market Inc.
        </Text>
      </VStack>
    </Box>
  );
}
