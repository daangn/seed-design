---
"@seed-design/rootage-artifacts": minor
"@seed-design/css": minor
"@seed-design/react": minor
---

Side Panel 컴포넌트를 추가합니다.

- 화면 좌/우 가장자리에서 슬라이드하는 데스크탑용 패널 컴포넌트입니다. `direction="left" | "right"`, `size="small" | "medium" | "large"`를 지원하며, `<SidePanelContent>`에 `width`/`maxWidth`를 직접 전달해 뷰포트 기반의 유동 크기로도 사용할 수 있습니다.
- 모바일(sm 이하)에서는 화면 너비의 80%로 자동 축소되고, `<SidePanelHeader>`/`<SidePanelFooter>`와 패널 가장자리에 `safe-area-inset`이 적용됩니다.
- 데스크탑 UI에서는 `ui:responsive-side-panel` 스니펫(`ResponsiveSidePanelRoot/Trigger/Content/Body/Footer`) 사용을 권장합니다. md 이상에서는 Side Panel, sm 이하에서는 Bottom Sheet로 자동 전환되며, 전환 중에도 `open` 상태가 유지됩니다.
