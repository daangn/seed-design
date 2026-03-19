import type { Registry } from "./schema";

export const registryBlock: Registry = {
  id: "block",
  items: [
    {
      id: "footer-1",
      description: "심플 텍스트형 Footer (회사정보 + 링크 + 저작권)",
      snippets: [
        {
          path: "footer-1.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
  ],
};
