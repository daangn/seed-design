---
"@seed-design/codemod": patch
---

- stitches 관련 transform 추가
  - replace-stitches-styled-color
  - replace-stitches-styled-typography
  - replace-stitches-theme-color
- trasnform 이름 변경
  - replace-color-design-token → replace-seed-design-token-vars
  - replace-color-prop → replace-custom-text-component-color-prop
  - replace-css-color-variable → replace-css-seed-design-color-variable
  - replace-css-typography-variable replace-css-seed-design-typography-variable
  - replace-tailwind-color 유지
  - replace-tailwind-typography 유지
  - replace-text-component → replace-custom-seed-design-text-component
  - replace-typography-design-token → replace-seed-design-token-typography-classname
  - replace-v2-icon → replace-react-icon
