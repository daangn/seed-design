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
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "footer-02",
      description: "표준 Footer (링크 + 회사정보 + 연락처 + SNS 아이콘)",
      snippets: [
        {
          path: "footer-02.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "footer-03",
      description: "컴팩트 Footer (링크 + 회사정보 + SNS 아이콘)",
      snippets: [
        {
          path: "footer-03.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "footer-04",
      description: "풀사이즈 Footer (로고 + 멀티 컬럼 링크 + 회사정보 + SNS 아이콘)",
      snippets: [
        {
          path: "footer-04.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "side-navigation-1",
      description: "풀 스펙 SideNavigation (Collapsible + Footer + 다수 그룹 + Inset 레이아웃)",
      snippets: [
        {
          path: "side-navigation-1.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
  ],
};
