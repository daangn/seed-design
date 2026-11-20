---
"@seed-design/rootage-artifacts": major
"@seed-design/css": major
"@seed-design/react": major
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: breakpoint 값을 직접 복제해 쓰고 있다면 새 값으로 바꾸거나 `@seed-design/css/breakpoints`를 사용해야 합니다.) breakpoint 값을 공통 기준으로 변경합니다.

- `sm` 480px → 600px, `md` 768px → 840px, `lg` 1280px → 1200px, `xl` 1440px → 1600px로 바뀝니다.
- 768–839px(iPad 세로 등)에서는 `md`가 아니라 `sm`이 적용됩니다. `ResponsiveDialog`·`ResponsiveSidePanel`은 Bottom Sheet로 표시됩니다.
- 1200–1279px에서는 `lg`가 적용됩니다. `size="responsive"`인 Menu·Select·Text Input 등이 데스크톱 크기로 표시됩니다. Lynx Menu·Select도 1200px부터 같은 크기를 씁니다.
