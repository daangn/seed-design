---
"@seed-design/tailwind3-plugin": minor
"@seed-design/tailwind4-theme": minor
"@seed-design/css": minor
---

플랫폼별 조건부 폰트 스케일링 제한 (iOS: 135%, Android: 150%) 적용

- CSS 변수 `--seed-{font-size|line-height}-limit-{min|max}` 도입
- 빌드 타임 basePx 계산을 런타임 static 토큰 참조로 대체
- global.ts에 폰트 스케일링 변수 통합
