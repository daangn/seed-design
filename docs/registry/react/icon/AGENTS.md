# docs/registry/icons

Block에서 사용하는 SVG 아이콘을 개별 파일로 제공하는 registry (`id: "icon"`).

## 파일 컨벤션

- 파일명: `icon-{서비스명}.tsx` (예: `icon-facebook.tsx`, `icon-blog.tsx`)
- 컴포넌트명: `Icon` prefix + PascalCase (예: `IconFacebook`, `IconBlog`, `IconKakaoTalk`)
- 모든 아이콘은 `React.SVGProps<SVGSVGElement>`을 props로 받음
- 각 파일은 단일 아이콘만 export

## 코드 패턴

```tsx
import type * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export function IconExample(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="..." fill="currentColor" />
    </svg>
  );
}
```

## Registry 등록

`docs/registry/registry-icon.ts`에 item으로 등록. `hideFromCLICatalog: true`이므로 CLI 카탈로그에 표시되지 않고, block의 `innerDependency`로만 사용됨.
