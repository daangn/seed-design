import type { PairSyncCheck } from "../types";
import { pascalToKebab } from "../utils/naming";

const LAYOUT_UTILS = [
  "Article",
  "AspectRatio",
  "Box",
  "Columns",
  "ConsistentWidth",
  "Flex",
  "Float",
  "Grid",
  "GridItem",
  "Icon",
  "Inline",
  "Portal",
  "ResponsivePair",
  "Stack",
  "Text",
  "VisuallyHidden",
];

export const newComponentCheck: PairSyncCheck = {
  kind: "pair",
  id: "new-component",
  name: "새 React 컴포넌트 추가",
  detectNewOnly: true,
  source: {
    pattern: /^packages\/react\/src\/components\/([^/]+)\//,
    exclude: LAYOUT_UTILS,
  },
  targets: [
    {
      id: "storybook",
      name: "Storybook Story",
      path: (name) => `docs/stories/${name}.stories.tsx`,
      severity: "warning",
      message: "새 컴포넌트에 Storybook story가 필요합니다",
    },
    {
      id: "react-docs",
      name: "React 컴포넌트 문서",
      path: (name) => `docs/content/react/components/${pascalToKebab(name)}.mdx`,
      severity: "warning",
      message: "새 컴포넌트에 React 문서가 필요합니다",
    },
    {
      id: "design-docs",
      name: "디자인 가이드라인 문서",
      path: (name) => `docs/content/docs/components/**/${pascalToKebab(name)}.mdx`,
      severity: "warning",
      message: "새 컴포넌트에 디자인 가이드 문서가 필요합니다",
    },
    {
      id: "recipe",
      name: "CSS Recipe",
      path: (name) => `packages/qvism-preset/src/recipes/${pascalToKebab(name)}.ts`,
      severity: "warning",
      message: "새 컴포넌트에 스타일 Recipe가 필요합니다",
    },
    {
      id: "example",
      name: "stackflow 예제",
      path: (name) => `examples/stackflow-spa/src/seed-design/ui/${pascalToKebab(name)}.tsx`,
      severity: "info",
      message: "새 컴포넌트에 stackflow 예제가 있으면 좋습니다",
    },
  ],
};
