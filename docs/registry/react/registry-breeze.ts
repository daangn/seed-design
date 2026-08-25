import type { Registry } from "../schema";

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
    {
      id: "blur-swap",
      description: "두 콘텐츠를 blur crossfade로 교차하는 컴포넌트",
      snippets: [{ path: "blur-swap/blur-swap.tsx" }, { path: "blur-swap/blur-swap.module.css" }],
    },
    {
      id: "scroll-auto-hide",
      description: "스크롤 방향에 따라 고정 영역을 숨기고 드러내는 컴포넌트",
      snippets: [
        { path: "scroll-auto-hide/scroll-auto-hide.tsx" },
        { path: "scroll-auto-hide/scroll-auto-hide.module.css" },
      ],
    },
  ],
};
