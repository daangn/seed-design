---
"@seed-design/rootage-artifacts": patch
"@seed-design/figma": patch
"@seed-design/react": patch
"@seed-design/css": patch
---

Switch 컴포넌트를 업데이트합니다.

- size: medium → 32, small → 16으로 rename합니다.
  - (React) `size="medium"`으로 `32`, `size="small"`로 `16`을 사용할 수 있습니다. (deprecated)
- size: 24를 추가합니다.
- 모든 size에 대해 레이블 스타일을 추가합니다. (기존: small에만 존재)
