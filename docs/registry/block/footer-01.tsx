"use client";

import { Box, Footer, HStack, Text, VStack } from "@seed-design/react";

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
        </HStack>

        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          (주)에이비씨컴퍼니 | 사업자 등록번호: 000-00-00000 | 통신판매업신고번호:
          0000-서울강남-0000 | 대표: 홍길동 | 주소: 서울특별시 강남구 테헤란로 123
          <br />
          호스팅 사업자: Amazon Web Service(AWS)
        </Text>
      </VStack>
    </Box>
  );
}
