"use client";

import { Box, Footer, HStack, Icon, Text, VStack } from "@seed-design/react";
import { ActionButton } from "../ui/action-button";

import { IconFacebook } from "../icon/icon-facebook";
import { IconGitHub } from "../icon/icon-github";
import { IconInstagram } from "../icon/icon-instagram";
import { IconMedium } from "../icon/icon-medium";

export default function FooterBlock() {
  return (
    <Box
      as="footer"
      width="100%"
      style={{ maxWidth: "1040px", marginInline: "auto" }}
      paddingX="x8"
      paddingY="x10"
    >
      <VStack gap="x4" align="flex-start">
        <HStack gap="x6" wrap align="center">
          <Footer.LinkText size="medium" href="#">
            개인정보처리방침
          </Footer.LinkText>
          <Footer.LinkText size="medium" href="#">
            브랜드 가이드라인
          </Footer.LinkText>
          <Footer.LinkText size="medium" href="#">
            자주 묻는 질문
          </Footer.LinkText>
          <Footer.LinkText size="medium" href="#">
            문의
          </Footer.LinkText>
        </HStack>

        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          (주)에이비씨컴퍼니 | 주소: 서울특별시 강남구 테헤란로 123 | 채용문의: recruit@example.com
        </Text>

        <HStack justify="space-between" align="center" width="100%" wrap gap="x4">
          <Text textStyle="t4Medium" color="fg.neutralMuted">
            ⓒ 2026 Company Inc.
          </Text>

          <HStack gap="x6">
            <ActionButton
              variant="ghost"
              size="large"
              layout="iconOnly"
              bleedX="asPadding"
              aria-label="GitHub"
            >
              <Icon svg={<IconGitHub />} />
            </ActionButton>
            <ActionButton
              variant="ghost"
              size="large"
              layout="iconOnly"
              bleedX="asPadding"
              aria-label="Medium"
            >
              <Icon svg={<IconMedium />} />
            </ActionButton>
            <ActionButton
              variant="ghost"
              size="large"
              layout="iconOnly"
              bleedX="asPadding"
              aria-label="Facebook"
            >
              <Icon svg={<IconFacebook />} />
            </ActionButton>
            <ActionButton
              variant="ghost"
              size="large"
              layout="iconOnly"
              bleedX="asPadding"
              aria-label="Instagram"
            >
              <Icon svg={<IconInstagram />} />
            </ActionButton>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}
