# docs/registry/react/icon

## 디렉터리 개요

Block에서 사용하는 SVG 아이콘을 개별 파일로 제공하는 React registry다. registry id는 `"icon"`이며 CLI 카탈로그에는 표시하지 않고 block의 `innerDependency`로만 사용한다.

## 파일 작성 컨벤션

- 파일명은 `icon-{서비스명}.tsx`를 사용한다(예: `icon-facebook.tsx`).
- 컴포넌트명은 `Icon` prefix와 PascalCase를 사용한다(예: `IconFacebook`, `IconKakaoTalk`).
- 각 파일은 단일 아이콘 컴포넌트만 export하고 `React.SVGProps<SVGSVGElement>`을 props로 받는다.

## 코드 작성 컨벤션

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

아이콘을 추가하면 `docs/registry/registry-icon.ts`에 item으로 등록한다.
