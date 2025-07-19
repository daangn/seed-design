---
"@seed-design/react": patch
---

Layout 컴포넌트에 Safe Area 스타일 속성 추가
  
- `safeAreaTop`과 `safeAreaBottom` 속성을 추가하여 디바이스의 safe area inset을 패딩으로 적용 가능
- `paddingTop`, `pt`와 `paddingBottom`, `pb`에 `safeArea` 값을 직접 지정할 수 있도록 지원
- safe area 속성과 기존 padding 값을 함께 사용할 경우 두 값이 자동으로 합산되어 적용

```tsx
<Box safeAreaTop />
<Box safeAreaBottom />
<Box pt="safeArea" paddingTop="safeArea" />
<Box pb="safeArea" paddingBottom="safeArea" />

// 중복 적용되진 않음
<Box safeAreaTop pt="safeArea" pb="safeArea" /> // 둘 중 하나만 적용됨

// 두 값이 함께 사용될 경우 두 값이 자동으로 합산되어 적용
<Box safeAreaTop pt="10px" /> // calc(10px + safe area inset)
```
