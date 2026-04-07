"use client";

import { Box, Footer, HStack, Icon, Text, VStack } from "@seed-design/react";
import { ActionButton } from "../ui/action-button";

import { IconBlog } from "../icon/icon-blog";
import { IconFacebook } from "../icon/icon-facebook";
import { IconInstagram } from "../icon/icon-instagram";
import { IconYouTube } from "../icon/icon-youtube";

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
            이용약관
          </Footer.LinkText>
          <Footer.LinkText size="medium" href="#">
            운영정책
          </Footer.LinkText>
          <Footer.LinkText size="medium" href="#">
            판매 운영정책
          </Footer.LinkText>
          <Footer.LinkText size="medium" href="#">
            주문 이용약관
          </Footer.LinkText>
        </HStack>

        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          (주)에이비씨컴퍼니 | 사업자 등록번호: 000-00-00000 | 통신판매업신고번호:
          0000-서울강남-0000 | 대표: 홍길동 | 주소: 서울특별시 강남구 테헤란로 123
          <br />
          호스팅 사업자: Amazon Web Service(AWS)
        </Text>

        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          전화: 000-0000-0000 | 고객문의: support@example.com
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
              aria-label="Blog"
            >
              <Icon svg={<IconBlog />} />
            </ActionButton>
            <ActionButton
              variant="ghost"
              size="large"
              layout="iconOnly"
              bleedX="asPadding"
              aria-label="YouTube"
            >
              <Icon svg={<IconYouTube />} />
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
            <ActionButton
              variant="ghost"
              size="large"
              layout="iconOnly"
              bleedX="asPadding"
              aria-label="Facebook"
            >
              <Icon svg={<IconFacebook />} />
            </ActionButton>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}
