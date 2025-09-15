---
"@seed-design/tailwind3-plugin": patch
"@seed-design/tailwind4-theme": patch
"@seed-design/rootage-artifacts": patch
"@seed-design/react": patch
"@seed-design/css": patch
---

Manner Temp, Manner Temp Badge 컴포넌트를 업데이트합니다.

- 신규 10단계 반영
- snippet 내 오타 수정
- 업데이트 가이드
  1. `@seed-design/css@0.2.5 @seed-design/react@0.2.5` 설치
  2. `npx @seed-design/cli@latest add manner-temp manner-temp-badge`로 snippet 최신화
  3. 온도 범위가 변경되었으므로, `<MannerTemp level="l1" />` 혹은 `<MannerTempBadge level="l1" />`과 같이 `level`을 직접 지정하여 사용하고 있는 경우가 있는지 확인
