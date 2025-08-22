---
"@seed-design/tailwind3-plugin": patch
"@seed-design/tailwind4-theme": patch
"@seed-design/rootage-artifacts": patch
"@seed-design/figma": patch
"@seed-design/react": patch
"@seed-design/css": patch
---

Page Banner 컴포넌트를 추가합니다. Inline Banner 컴포넌트를 deprecate합니다.

- Inline Banner 컴포넌트 대비 모든 `tone`에서 모든 `variant`를 지원하며, 내부 Button의 충분한 터치 영역을 보장합니다.

```tsx
<PageBanner
  tone="informative"
  variant="weak"
  description="사업자 정보를 등록해주세요."
  suffix={
    <PageBannerButton asChild>
      <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
        새 탭에서 열기
      </a>
    </PageBannerButton>
  }
/>
```

시맨틱 색상 토큰을 추가하고 수정합니다.

- `$color.bg.positive-solid-pressed`: theme-dark에서 `$color.palette.green-500` → `$color.palette.green-600`
- `$color.bg.warning-solid-pressed` 추가
