import type { Registry } from "./schema";

export const registryBlock: Registry = {
  id: "block",
  items: [
    {
      id: "footer-01",
      description: "미니멀 Footer (링크 + 회사정보)",
      snippets: [
        {
          path: "footer-01.tsx",
          dependencies: { "@seed-design/react": "~1.3.0", "@seed-design/css": "~1.3.0" },
        },
      ],
    },
    {
      id: "footer-02",
      description: "표준 Footer (링크 + 회사정보 + 연락처 + SNS 아이콘)",
      snippets: [
        {
          path: "footer-02.tsx",
          dependencies: { "@seed-design/react": "~1.3.0", "@seed-design/css": "~1.3.0" },
        },
      ],
    },
    {
      id: "footer-03",
      description: "컴팩트 Footer (링크 + 회사정보 + SNS 아이콘)",
      snippets: [
        {
          path: "footer-03.tsx",
          dependencies: { "@seed-design/react": "~1.3.0", "@seed-design/css": "~1.3.0" },
        },
      ],
    },
    {
      id: "footer-04",
      description: "풀사이즈 Footer (로고 + 멀티 컬럼 링크 + 회사정보 + SNS 아이콘)",
      snippets: [
        {
          path: "footer-04.tsx",
          dependencies: { "@seed-design/react": "~1.3.0", "@seed-design/css": "~1.3.0" },
        },
      ],
    },
    {
      id: "side-navigation-01",
      description: "기본 SideNavigation (그룹 + Collapsible + Footer)",
      snippets: [
        {
          path: "side-navigation-01.tsx",
          dependencies: { "@seed-design/react": "~1.3.0", "@seed-design/css": "~1.3.0" },
        },
      ],
    },
    {
      id: "side-navigation-02",
      description: "SideNavigation with Header 브랜딩 (collapsed 상태 반응형 + 프로필 Menu)",
      snippets: [
        {
          path: "side-navigation-02.tsx",
          dependencies: { "@seed-design/react": "~1.3.0", "@seed-design/css": "~1.3.0" },
        },
      ],
    },
    {
      id: "layout-01",
      description: "기본 Layout (Header + Content + Footer)",
      snippets: [
        {
          path: "layout-01.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "layout-02",
      description: "대시보드 Layout (density=high + 그리드 카드)",
      snippets: [
        {
          path: "layout-02.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "responsive-header-01",
      description: "반응형 Header — 일반 회사 (768px↑ nav / 768px↓ SidePanel)",
      snippets: [
        {
          path: "responsive-header-01.tsx",
          dependencies: {
            "@seed-design/react": "~1.0.0",
            "@seed-design/css": "~1.0.0",
            "@karrotmarket/react-monochrome-icon": "~0",
          },
        },
      ],
    },
    {
      id: "responsive-header-02",
      description: "반응형 Header — 당근닷컴 (서브메뉴 Menu↔Accordion 전환)",
      snippets: [
        {
          path: "responsive-header-02.tsx",
          dependencies: {
            "@seed-design/react": "~1.0.0",
            "@seed-design/css": "~1.0.0",
            "@karrotmarket/react-monochrome-icon": "~0",
          },
        },
      ],
    },
    {
      id: "header-01",
      description: "미니멀 Header (로고 + 계정 버튼)",
      snippets: [
        {
          path: "header-01.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "header-02",
      description: "네비게이션 Header (로고 + 센터 메뉴 + CTA)",
      snippets: [
        {
          path: "header-02.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "header-03",
      description: "확장 Header (로고 + 좌측 메뉴 + 외부 링크 + CTA)",
      snippets: [
        {
          path: "header-03.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "header-04",
      description: "당근닷컴 Header (로고 + 서비스 메뉴 + Menu 드롭다운 + 검색 + 앱 다운로드)",
      snippets: [
        {
          path: "header-04.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
  ],
};
