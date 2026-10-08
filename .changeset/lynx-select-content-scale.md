---
"@seed-design/lynx-css": major
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `select-trigger`·`select-item` Recipe를 직접 조합했다면 콘텐츠를 `scaleContent` slot으로 감싸고, `root`에 지정한 콘텐츠 간격과 직접 자식 selector를 새 slot에 맞게 수정해야 합니다.) `Select.Trigger`와 `Select.Item`은 누르면 배경을 유지하고 콘텐츠만 축소합니다. 크기별 `gap`은 `root`에서 `scaleContent`로 이동합니다. `@seed-design/lynx-react`의 styled 컴포넌트는 기존 children 조합을 그대로 사용할 수 있습니다.
