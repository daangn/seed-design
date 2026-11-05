"use client";

import type * as React from "react";
import { Box, Footer, HStack, Icon, Text, VStack } from "@seed-design/react";
import { ActionButton } from "../ui/action-button";

import { IconFacebook } from "../icon/icon-facebook";
import { IconInstagram } from "../icon/icon-instagram";
import { IconYouTube } from "../icon/icon-youtube";

function DaanggnLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="57"
      height="32"
      viewBox="0 0 57 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#daangn-logo-clip)">
        <path
          d="M8.2061 10.3566C3.67422 10.3566 0 13.9495 0 18.4855C0 24.7529 8.22967 28.0786 8.2061 28.0696C8.18365 28.0786 16.4122 24.7529 16.4122 18.4855C16.4122 13.9529 12.738 10.3566 8.2061 10.3566ZM8.2061 21.7764C7.59158 21.776 6.99099 21.5933 6.48027 21.2515C5.96954 20.9097 5.57162 20.4241 5.33681 19.8561C5.102 19.2881 5.04085 18.6632 5.16109 18.0604C5.28133 17.4577 5.57757 16.9041 6.01233 16.4698C6.4471 16.0354 7.00088 15.7397 7.60365 15.6201C8.20643 15.5005 8.83112 15.5623 9.39876 15.7978C9.9664 16.0332 10.4515 16.4318 10.7927 16.943C11.1339 17.4541 11.3159 18.055 11.3157 18.6697C11.3164 19.0784 11.2365 19.4833 11.0805 19.8611C10.9245 20.2389 10.6955 20.5822 10.4067 20.8713C10.1178 21.1604 9.77474 21.3897 9.39712 21.546C9.01951 21.7023 8.61477 21.7825 8.2061 21.782V21.7764Z"
          fill="#FF6F0F"
        />
        <path
          d="M10.0539 0C8.13874 0 6.80511 1.33836 6.59519 2.91924C4.04242 2.21413 2.04198 4.1543 2.04198 6.28759C2.04198 7.92125 3.16456 9.24052 4.66097 9.66942C5.86775 10.0141 8.04107 9.757 8.04107 9.757C8.02985 9.22929 8.51593 8.64994 9.26581 8.12223C11.3987 6.62219 13.0669 5.91483 13.324 3.86912C13.5934 1.72909 12.0049 0 10.0539 0Z"
          fill="#00A05B"
        />
        <path
          d="M32.6998 13.1826C30.9665 13.7272 27.9659 14.0169 25.1471 14.0169V10.5879H30.9688V8.03467H22.0251V16.7295C26.9163 16.7295 31.1866 16.1401 32.9894 15.582L32.6998 13.1826Z"
          fill="#FF6F0F"
        />
        <path
          d="M36.8096 7.0174H33.6922V17.0135H36.8096V13.8799H39.3242V11.1526H36.8096V7.0174Z"
          fill="#FF6F0F"
        />
        <path
          d="M31.0193 16.99C27.7166 16.99 25.2941 18.81 25.2941 21.4811C25.2941 24.1522 27.7189 25.9723 31.0193 25.9723C34.3197 25.9723 36.7445 24.1511 36.7445 21.4811C36.7445 18.8111 34.3219 16.99 31.0193 16.99ZM31.0193 23.4718C29.5307 23.4718 28.4138 22.7577 28.4138 21.4766C28.4138 20.1955 29.5307 19.4826 31.0193 19.4826C32.5078 19.4826 33.6248 20.1967 33.6248 21.4766C33.6248 22.7566 32.509 23.4718 31.0193 23.4718Z"
          fill="#FF6F0F"
        />
        <path d="M45.3952 18.316H42.2081V25.0785H54.8754V22.4018H45.3952V18.316Z" fill="#FF6F0F" />
        <path
          d="M54.4802 7.85162H42.0644V10.5283H51.3504C51.3504 11.193 51.3819 12.7739 51.0776 14.5704H39.6901V17.3392H56.978V14.5749H53.8976C54.3107 12.3046 54.4286 10.5351 54.4802 7.85162Z"
          fill="#FF6F0F"
        />
      </g>
      <defs>
        <clipPath id="daangn-logo-clip">
          <rect width="56.9825" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <VStack gap="x4" align="flex-start" style={{ minWidth: "100px" }}>
      <Text textStyle="t3Medium" color="fg.neutralMuted">
        {title}
      </Text>
      <VStack gap="x4" align="flex-start">
        {links.map((link) => (
          <Footer.LinkText key={link.label} size="large" href={link.href}>
            {link.label}
          </Footer.LinkText>
        ))}
      </VStack>
    </VStack>
  );
}

const COUNTRY_LINKS = [
  { label: "Canada", href: "#" },
  { label: "United States", href: "#" },
  { label: "United Kingdom", href: "#" },
  { label: "日本", href: "#" },
];

const LINK_COLUMNS = [
  {
    title: "회사",
    links: [
      { label: "회사 소개", href: "#" },
      { label: "당근페이", href: "#" },
      { label: "팀문화", href: "#" },
      { label: "서비스 소개", href: "#" },
      { label: "블로그", href: "#" },
      { label: "채용", href: "#" },
    ],
  },
  {
    title: "탐색",
    links: [
      { label: "중고거래", href: "#" },
      { label: "부동산", href: "#" },
      { label: "중고차", href: "#" },
      { label: "알바/과외/레슨", href: "#" },
      { label: "동네업체", href: "#" },
      { label: "동네생활", href: "#" },
      { label: "모임", href: "#" },
      { label: "카페", href: "#" },
      { label: "채팅하기", href: "#" },
    ],
  },
  {
    title: "비즈니스",
    links: [
      { label: "당근 비즈니스", href: "#" },
      { label: "제휴 문의", href: "#" },
      { label: "광고 문의", href: "#" },
    ],
  },
  {
    title: "문의",
    links: [
      { label: "IR", href: "#" },
      { label: "PR", href: "#" },
      { label: "고객센터", href: "#" },
    ],
  },
  {
    title: "주요 지역",
    links: [
      { label: "한남동", href: "#" },
      { label: "판교동", href: "#" },
      { label: "후암동", href: "#" },
      { label: "이촌동", href: "#" },
      { label: "이태현동", href: "#" },
      { label: "이촌제1동", href: "#" },
      { label: "더보기", href: "#" },
    ],
  },
  {
    title: "인기 상품",
    links: [
      { label: "에어컨", href: "#" },
      { label: "자전거", href: "#" },
      { label: "아이폰", href: "#" },
      { label: "컴퓨터", href: "#" },
      { label: "냉장고", href: "#" },
      { label: "굿즈", href: "#" },
      { label: "더보기", href: "#" },
    ],
  },
];

export default function FooterBlock() {
  return (
    <Box
      as="footer"
      width="100%"
      style={{ maxWidth: "1040px", marginInline: "auto" }}
      paddingX="x8"
      paddingY="x10"
    >
      <VStack gap="x10" align="flex-start">
        {/* Upper: Logo + Country Links + Link Columns */}
        <HStack gap="x8" align="flex-start" width="100%" wrap>
          {/* Logo + Country Links */}
          <VStack gap="x4" align="flex-start" style={{ flex: 1, minWidth: "120px" }}>
            <DaanggnLogo />
            <VStack gap="x3" align="flex-start">
              {COUNTRY_LINKS.map((link) => (
                <Footer.LinkText key={link.label} size="medium" href={link.href}>
                  {link.label}
                </Footer.LinkText>
              ))}
            </VStack>
          </VStack>

          {/* Link Columns Grid */}
          <HStack gap="x8" wrap align="flex-start">
            {LINK_COLUMNS.map((column) => (
              <LinkColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </HStack>
        </HStack>

        {/* Divider */}
        <Box
          width="100%"
          style={{ height: "1px", backgroundColor: "var(--seed-v3-color-stroke-neutral)" }}
        />

        {/* Lower: Links + Company Info + Copyright + SNS */}
        <VStack gap="x4" align="flex-start" width="100%">
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
              위치기반서비스 이용약관
            </Footer.LinkText>
            <Footer.LinkText size="medium" href="#">
              이용자보호 비전과 계획
            </Footer.LinkText>
            <Footer.LinkText size="medium" href="#">
              청소년보호정책
            </Footer.LinkText>
          </HStack>

          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            (주)당근마켓 | 사업자 등록번호: 375-87-00088 | 통신판매업신고번호: 2016-서울서초-0051 |
            대표: 황도연, 김용현 | 주소: 서울특별시 구로구 디지털로 300 10층 (당근서비스)
            <br />
            호스팅 사업자: Amazon Web Service(AWS)
          </Text>

          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            전화: 1877-9737 | 고객문의: cs@daangnservice.com
          </Text>

          <HStack justify="space-between" align="center" width="100%" wrap gap="x4">
            <Text textStyle="t4Medium" color="fg.neutralMuted">
              ⓒ 2026 Danggeun Market Inc.
            </Text>

            <HStack gap="x6">
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
            </HStack>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}
