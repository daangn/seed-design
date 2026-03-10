---
"@seed-design/react-popover": patch
"@seed-design/react": patch
---

- PopoverPositionerPortal의 preserveTabOrder 기본값을 false로 변경하여 iOS Safari에서 가상 키보드 dismiss 후 viewport 복원 이슈를 해결합니다.
- HelpBubblePositionerPortalProps에 preserveTabOrder JSDoc을 추가합니다.
