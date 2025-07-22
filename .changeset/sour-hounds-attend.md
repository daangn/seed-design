---
"@seed-design/react": patch
---

Layout 컴포넌트 `pb`, `pt`, `paddingBottom`, `paddingTop` 속성에 `safeArea` 값을 지정할 수 있도록 지원
  
```tsx
<Box pt="safeArea" paddingTop="safeArea" />
<Box pb="safeArea" paddingBottom="safeArea" />
```
