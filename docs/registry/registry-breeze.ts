import type { Registry } from "./schema";

export const registryBreeze: Registry = {
  id: "breeze",
  items: [
    {
      id: "animate-number",
      description: "숫자를 부드럽게 애니메이션하는 컴포넌트",
      snippets: [
        { path: "animate-number/animate-number.tsx" },
        { path: "animate-number/animate-number.module.css" },
      ],
    },
  ],
};
